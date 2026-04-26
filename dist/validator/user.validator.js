"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateUserInput = validateCreateUserInput;
exports.validateUpdateUserInput = validateUpdateUserInput;
exports.validateLoginInput = validateLoginInput;
const ALLOWED_ROLES = new Set(["Student", "Professor"]);
function assertNonEmptyString(value, fieldName) {
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error(`${fieldName} is required`);
    }
    return value.trim();
}
function assertRole(value) {
    if (typeof value !== "string" || !ALLOWED_ROLES.has(value)) {
        throw new Error("role must be Student or Professor");
    }
    return value;
}
function validateCreateUserInput(input) {
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
function validateUpdateUserInput(input) {
    const nextInput = {};
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
function validateLoginInput(input) {
    const email = assertNonEmptyString(input.email, "email").toLowerCase();
    const password = assertNonEmptyString(input.password, "password");
    if (!email.includes("@")) {
        throw new Error("email is invalid");
    }
    return { email, password };
}
