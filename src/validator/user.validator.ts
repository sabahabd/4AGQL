import {
	CreateUserInput,
	LoginInput,
	UpdateUserInput,
	UserRole,
} from "../models/User";

const ALLOWED_ROLES = new Set<UserRole>(["Student", "Professor"]);

function assertNonEmptyString(value: unknown, fieldName: string): string {
	if (typeof value !== "string" || value.trim().length === 0) {
		throw new Error(`${fieldName} is required`);
	}

	return value.trim();
}

function assertRole(value: unknown): UserRole {
	if (typeof value !== "string" || !ALLOWED_ROLES.has(value as UserRole)) {
		throw new Error("role must be Student or Professor");
	}

	return value as UserRole;
}

export function validateCreateUserInput(input: CreateUserInput): CreateUserInput {
	const email = assertNonEmptyString(input.email, "email").toLowerCase();
	const pseudo = assertNonEmptyString(input.pseudo, "pseudo");
	const password = assertNonEmptyString(input.password, "password");
	const role = assertRole(input.role);

	if (!email.includes("@")) {
		throw new Error("email is invalid");
	}

	if (password.length < 6) {
		throw new Error("password must be at least 6 characters long");
	}

	return {
		email,
		pseudo,
		password,
		role,
	};
}

export function validateUpdateUserInput(input: UpdateUserInput): UpdateUserInput {
	const nextInput: UpdateUserInput = {};

	if (input.email !== undefined) {
		const email = assertNonEmptyString(input.email, "email").toLowerCase();

		if (!email.includes("@")) {
			throw new Error("email is invalid");
		}

		nextInput.email = email;
	}

	if (input.pseudo !== undefined) {
		nextInput.pseudo = assertNonEmptyString(input.pseudo, "pseudo");
	}

	if (input.password !== undefined) {
		const password = assertNonEmptyString(input.password, "password");

		if (password.length < 6) {
			throw new Error("password must be at least 6 characters long");
		}

		nextInput.password = password;
	}

	if (input.role !== undefined) {
		nextInput.role = assertRole(input.role);
	}

	if (Object.keys(nextInput).length === 0) {
		throw new Error("At least one field is required for update");
	}

	return nextInput;
}

export function validateLoginInput(input: LoginInput): LoginInput {
	const email = assertNonEmptyString(input.email, "email").toLowerCase();
	const password = assertNonEmptyString(input.password, "password");

	if (!email.includes("@")) {
		throw new Error("email is invalid");
	}

	return { email, password };
}
