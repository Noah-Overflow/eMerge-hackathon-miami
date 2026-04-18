import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const http = httpRouter();

http.route({
  path: "/finalizeSeal",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (
      request.headers.get("x-verity-signer-secret") !== process.env.SIGNER_SECRET
    ) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = (await request.json()) as {
      orgId: string;
      kind: "document" | "inference";
      verityDocId?: string;
      receiptId?: string;
      flowTxId: string;
      status: "sealed" | "failed";
      error?: string;
    };
    await ctx.runMutation(internal.seal.finalizeSeal, {
      ...body,
      orgId: body.orgId as Id<"organizations">,
    });
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
