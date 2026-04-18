import type { AuthConfig } from "convex/server";

const JWKS_DATA_URI =
  "data:text/plain;charset=utf-8;base64,eyJrZXlzIjpbeyJrdHkiOiJSU0EiLCJuIjoidWxqaTZNM2lwdVVCeWRNYTJucVVSUWp6UE5weDBTTWZUdVJWV1NIS0tRbVhlQXRnWXRCZXVnekdxdWs0cVRPalg2UkdFTXNUN090QzN3Qm5HblBlVjE0X0N4NUo4M2VTT3ZIZDZlcjBsdzV5WnlfMEpNWExnVHZTdGx5RFh5czdYSFdPVDgwa2R2OHVPNy1sNE9waE1VUDZpSi1SQ1Z3N2VZZjV5VFM0ZWFDWW9mMVR6bUVmdDNkT0szdU1fdlh5b04yQ3FQcWZLR0hKVmRMR2ZEVUdNUHNFYVNjOUlIVlh0bXF0RVFLVnZfVkc2eUs4aGYwQTFqdFlOamdoOGJJbzBhUTBxa1VLRTBTSHBoWGNMTmVKSWF2RGVJNHotTk02VzhRclZObzIzWWJoSkZPN3YyQzA2TnFhOGxOd3ZhQkYzNU83NHlBNTFyM2pRWUJGbDVRcG13IiwiZSI6IkFRQUIiLCJ1c2UiOiJzaWciLCJhbGciOiJSUzI1NiIsImtpZCI6InZlcml0eS1kZXYtMSJ9XX0=";

export default {
  providers: [
    {
      type: "customJwt",
      applicationID: "verity-app",
      issuer: "https://verity.convex.auth",
      jwks: JWKS_DATA_URI,
      algorithm: "RS256",
    },
  ],
} satisfies AuthConfig;
