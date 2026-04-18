/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as apiKeys from "../apiKeys.js";
import type * as dashboard from "../dashboard.js";
import type * as http from "../http.js";
import type * as internalAuth from "../internalAuth.js";
import type * as org from "../org.js";
import type * as passkey from "../passkey.js";
import type * as receipts from "../receipts.js";
import type * as seal from "../seal.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  apiKeys: typeof apiKeys;
  dashboard: typeof dashboard;
  http: typeof http;
  internalAuth: typeof internalAuth;
  org: typeof org;
  passkey: typeof passkey;
  receipts: typeof receipts;
  seal: typeof seal;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
