import { describe, it, expect } from "vitest";
import {
  validateCreateUserInput,
  validateUpdateUserInput,
  validateLoginInput,
} from "../src/validator/user.validator";

describe("user.validator", () => {
  describe("validateCreateUserInput", () => {
    it("accepts valid input and normalizes email", () => {
      const input = { email: "ME@example.com", pseudo: "me", password: "secret1", role: "Student" } as any;
      const result = validateCreateUserInput(input);
      expect(result.email).toBe("me@example.com");
      expect(result.pseudo).toBe("me");
      expect(result.role).toBe("Student");
    });

    it("throws on short password or invalid email", () => {
      expect(() => validateCreateUserInput({ email: "no-at", pseudo: "p", password: "123", role: "Student" } as any)).toThrow();
    });
  });

  describe("validateUpdateUserInput", () => {
    it("accepts partial updates and validates fields", () => {
      const input = { email: "Up@Ex.com" } as any;
      const result = validateUpdateUserInput(input);
      expect(result.email).toBe("up@ex.com");
    });

    it("throws when no fields provided", () => {
      expect(() => validateUpdateUserInput({} as any)).toThrow("At least one field is required for update");
    });
  });

  describe("validateLoginInput", () => {
    it("normalizes email and requires password", () => {
      const res = validateLoginInput({ email: " A@B.com ", password: "pw" } as any);
      expect(res.email).toBe("a@b.com");
      expect(res.password).toBe("pw");
    });
  });
});
