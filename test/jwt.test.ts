// Ensure predictable secret for tests
process.env.JWT_SECRET = "test-secret";

import { describe, it, expect } from "vitest";
import { generateAccessToken, getBearerToken, getAuthenticatedUserId } from "../src/auth/jwt";

describe("jwt utilities", () => {
  it("generateAccessToken and getAuthenticatedUserId roundtrip", () => {
    const token = generateAccessToken({ userId: 42, email: "a@b.com", role: "Student" });

    const headers = { authorization: `Bearer ${token}` };
    const extracted = getBearerToken(headers);
    expect(extracted).toBeTruthy();

    const id = getAuthenticatedUserId(headers);
    expect(id).toBe(42);
  });

  it("getBearerToken returns null for bad header", () => {
    expect(getBearerToken({})).toBeNull();
    expect(getBearerToken(undefined)).toBeNull();
    expect(getBearerToken({ authorization: "NotBearer token" })).toBeNull();
  });
});
