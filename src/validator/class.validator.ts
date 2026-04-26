import { ClassSortOrder, CreateClassInput, UpdateClassInput } from "../models/Class";

function assertNonEmptyString(value: unknown, fieldName: string): string {
	if (typeof value !== "string" || value.trim().length === 0) {
		throw new Error(`${fieldName} is required`);
	}

	return value.trim();
}

function assertPositiveInteger(value: unknown, fieldName: string): number {
	if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
		throw new Error(`${fieldName} must be a positive integer`);
	}

	return value;
}

export function validateClassSortOrder(sortOrder?: ClassSortOrder): "asc" | "desc" {
	if (!sortOrder) {
		return "asc";
	}

	if (sortOrder !== "ASC" && sortOrder !== "DESC") {
		throw new Error("sortOrder must be ASC or DESC");
	}

	return sortOrder === "ASC" ? "asc" : "desc";
}

export function validateCreateClassInput(input: CreateClassInput): CreateClassInput {
	const name = assertNonEmptyString(input.name, "name");
	const nextInput: CreateClassInput = { name };

	if (input.professorId !== undefined) {
		nextInput.professorId = assertPositiveInteger(input.professorId, "professorId");
	}

	return nextInput;
}

export function validateUpdateClassInput(input: UpdateClassInput): UpdateClassInput {
	const nextInput: UpdateClassInput = {};

	if (input.name !== undefined) {
		nextInput.name = assertNonEmptyString(input.name, "name");
	}

	if (input.professorId !== undefined) {
		nextInput.professorId = assertPositiveInteger(input.professorId, "professorId");
	}

	if (Object.keys(nextInput).length === 0) {
		throw new Error("At least one field is required for update");
	}

	return nextInput;
}

export function validateClassAndStudentIds(classId: number, studentId: number): void {
	assertPositiveInteger(classId, "classId");
	assertPositiveInteger(studentId, "studentId");
}