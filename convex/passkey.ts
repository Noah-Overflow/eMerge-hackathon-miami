"use node";

import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { SignJWT, importPKCS8 } from "jose";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";

const issuer = "https://verity.convex.auth";
const audience = "verity-app";

async function mintSessionToken(userId: string, orgId: string) {
  const pem = process.env.JWT_PRIVATE_KEY;
  if (!pem) {
    throw new Error(
      "JWT_PRIVATE_KEY missing: set it with `npx convex env set JWT_PRIVATE_KEY` (paste PEM including headers)",
    );
  }
  const key = await importPKCS8(pem, "RS256");
  return await new SignJWT({ orgId })
    .setProtectedHeader({ alg: "RS256", kid: "verity-dev-1", typ: "JWT" })
    .setSubject(userId)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(key);
}

function rpId() {
  return process.env.WEBAUTHN_RP_ID ?? "localhost";
}

function origin() {
  return process.env.WEBAUTHN_ORIGIN ?? "http://localhost:3000";
}

export const startRegistration = action({
  args: { displayName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const challengeId = crypto.randomUUID();
    const options = await generateRegistrationOptions({
      rpName: "Verity",
      rpID: rpId(),
      userName: args.displayName ?? "Verity user",
      userDisplayName: args.displayName ?? "Verity user",
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
    });
    await ctx.runMutation(internal.internalAuth.saveChallenge, {
      kind: "registration",
      challengeId,
      challenge: options.challenge,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });
    return { options, challengeId };
  },
});

export const finishRegistration = action({
  args: {
    challengeId: v.string(),
    response: v.any(),
    displayName: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{
    token: string;
    userId: string;
    orgId: string;
  }> => {
    const row = await ctx.runQuery(internal.internalAuth.getChallenge, {
      challengeId: args.challengeId,
    });
    if (!row || row.kind !== "registration" || row.expiresAt < Date.now()) {
      throw new Error("Invalid or expired challenge");
    }
    const verification = await verifyRegistrationResponse({
      response: args.response,
      expectedChallenge: row.challenge,
      expectedOrigin: origin(),
      expectedRPID: rpId(),
    });
    if (!verification.verified || !verification.registrationInfo) {
      throw new Error("Registration verification failed");
    }
    const { credential } = verification.registrationInfo;
    const transports = credential.transports?.map((t) => String(t));
    const { userId, orgId } = (await ctx.runMutation(
      internal.internalAuth.registerUserWithPasskey,
      {
        credentialId: credential.id,
        publicKey: Buffer.from(credential.publicKey).toString("base64url"),
        counter: credential.counter,
        transports,
        displayName: args.displayName,
      },
    )) as { userId: Id<"users">; orgId: Id<"organizations"> };
    await ctx.runMutation(internal.internalAuth.deleteChallenge, { id: row._id });
    const token = await mintSessionToken(userId, orgId);
    return { token, userId, orgId };
  },
});

export const startAuthentication = action({
  args: {},
  handler: async (ctx) => {
    const challengeId = crypto.randomUUID();
    const options = await generateAuthenticationOptions({
      rpID: rpId(),
      userVerification: "preferred",
    });
    await ctx.runMutation(internal.internalAuth.saveChallenge, {
      kind: "authentication",
      challengeId,
      challenge: options.challenge,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });
    return { options, challengeId };
  },
});

export const finishAuthentication = action({
  args: { challengeId: v.string(), response: v.any() },
  handler: async (ctx, args): Promise<{
    token: string;
    userId: string;
    orgId: string;
  }> => {
    const row = await ctx.runQuery(internal.internalAuth.getChallenge, {
      challengeId: args.challengeId,
    });
    if (!row || row.kind !== "authentication" || row.expiresAt < Date.now()) {
      throw new Error("Invalid or expired challenge");
    }
    const cred = (await ctx.runQuery(
      internal.internalAuth.getCredentialByCredentialId,
      { credentialId: args.response.id },
    )) as Doc<"passkeyCredentials"> | null;
    if (!cred) {
      throw new Error("Unknown credential");
    }
    const verification = await verifyAuthenticationResponse({
      response: args.response,
      expectedChallenge: row.challenge,
      expectedOrigin: origin(),
      expectedRPID: rpId(),
      credential: {
        id: cred.credentialId,
        publicKey: Buffer.from(cred.publicKey, "base64url"),
        counter: cred.counter,
        transports: cred.transports as ("ble" | "hybrid" | "internal" | "nfc" | "usb" | "cable" | "smart-card")[] | undefined,
      },
    });
    if (!verification.verified) {
      throw new Error("Authentication verification failed");
    }
    await ctx.runMutation(internal.internalAuth.updateCredentialCounter, {
      credentialDbId: cred._id,
      counter: verification.authenticationInfo.newCounter,
    });
    const orgId = (await ctx.runQuery(internal.internalAuth.getPrimaryOrgForUser, {
      userId: cred.userId,
    })) as Id<"organizations"> | null;
    if (!orgId) {
      throw new Error("No organization for user");
    }
    await ctx.runMutation(internal.internalAuth.deleteChallenge, { id: row._id });
    const token = await mintSessionToken(cred.userId, orgId);
    return { token, userId: cred.userId, orgId };
  },
});
