import { describe, it, expect, beforeEach, vi } from "vitest";
import { UserService } from "../src/services/userService";

// Mock bcrypt to deterministic behavior
vi.mock("bcryptjs", () => ({
  default: {
    hash: async (s: string) => `hashed-${s}`,
    compare: async (plain: string, hashed: string) => hashed === `hashed-${plain}`,
  },
}));

// Mock token generator
vi.mock("../src/auth/jwt", () => ({
  generateAccessToken: () => "fixed-token",
}));

const makeUser = (overrides = {}) => ({
  id: 7,
  email: "me@ex.com",
  pseudo: "me",
  password: "hashed-secret",
  role: "Student",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("UserService", () => {
  let repo: any;
  let svc: UserService;

  beforeEach(() => {
    repo = {
      findByEmail: async () => null,
      create: async (d: any) => makeUser({ ...d, id: 7 }),
      findAll: async () => [makeUser()],
      findById: async (id: number) => (id === 7 ? makeUser() : null),
      updateById: async (id: number, data: any) => ({ ...makeUser(), ...data }),
      deleteById: async () => ({}),
    };

    svc = new UserService(repo);
  });

  it("createUser hashes password and returns public user", async () => {
    const input = { email: "new@ex.com", pseudo: "n", password: "secret", role: "Student" } as any;
    const created = await svc.createUser(input);
    expect(created.email).toBe("new@ex.com");
    expect(created.id).toBe(7);
  });

  it("createUser throws when email exists", async () => {
    repo.findByEmail = async () => makeUser();
    await expect(svc.createUser({ email: "me@ex.com", pseudo: "x", password: "secret", role: "Student" } as any)).rejects.toThrow();
  });

  it("login returns token and user on success", async () => {
    repo.findByEmail = async () => makeUser({ password: "hashed-secret", id: 7 });
    const res = await svc.login({ email: "me@ex.com", password: "secret" } as any);
    expect(res.token).toBe("fixed-token");
    expect(res.user.id).toBe(7);
  });

  it("login throws on wrong credentials", async () => {
    repo.findByEmail = async () => makeUser({ password: "not-hashed" });
    await expect(svc.login({ email: "me@ex.com", password: "bad" } as any)).rejects.toThrow();
  });

  it("getUser throws when not found", async () => {
    repo.findById = async () => null;
    await expect(svc.getUser(123)).rejects.toThrow("User not found");
  });

  it("updateUser enforces ownership and updates successfully", async () => {
    const updated = await svc.updateUser(7, { pseudo: "new" } as any, 7);
    expect(updated.pseudo).toBe("new");
  });

  it("deleteUser enforces ownership and returns true on success", async () => {
    const res = await svc.deleteUser(7, 7);
    expect(res).toBe(true);
  });
});
