import { CreateGradeInput, UpdateGradeInput } from "../models/Grade";

function assertNonEmptyString(value: unknown, fieldName: string): string {
	if (typeof value !== "string" || value.trim().length === 0) {
		throw new Error(`${fieldName} is required`);
	}

	return value.trim();
}

function assertFiniteNumber(value: unknown, fieldName: string): number {
	if (typeof value !== "number" || !Number.isFinite(value)) {
		throw new Error(`${fieldName} must be a valid number`);
	}

	return value;
}

function assertPositiveInteger(value: unknown, fieldName: string): number {
	if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
		throw new Error(`${fieldName} must be a positive integer`);
	}

	return value;
}

export function validateCreateGradeInput(input: CreateGradeInput): CreateGradeInput {
	const course = assertNonEmptyString(input.course, "course");
	const value = assertFiniteNumber(input.value, "value");
	const studentId = assertPositiveInteger(input.studentId, "studentId");
	const classId = assertPositiveInteger(input.classId, "classId");

	return {
		course,
		value,
		studentId,
		classId,
	};
}

export function validateUpdateGradeInput(input: UpdateGradeInput): UpdateGradeInput {
	const nextInput: UpdateGradeInput = {};

	if (input.course !== undefined) {
		nextInput.course = assertNonEmptyString(input.course, "course");
	}

	if (input.value !== undefined) {
		nextInput.value = assertFiniteNumber(input.value, "value");
	}

	if (input.studentId !== undefined) {
		nextInput.studentId = assertPositiveInteger(input.studentId, "studentId");
	}

	if (input.classId !== undefined) {
		nextInput.classId = assertPositiveInteger(input.classId, "classId");
	}

	if (Object.keys(nextInput).length === 0) {
		throw new Error("At least one field is required for update");
	}

	return nextInput;
}

export function validateCoursesFilter(courses?: string[]): string[] | undefined {
	if (courses === undefined) {
		return undefined;
	}

	if (!Array.isArray(courses)) {
		throw new Error("courses must be an array of strings");
	}

	const normalized = courses.map((course) => assertNonEmptyString(course, "course"));
	return normalized.length > 0 ? normalized : undefined;
}

export function validateGradeAnalyticsFilter(filter?: {
	studentId?: number;
	course?: string;
	classId?: number;
}): {
	studentId?: number;
	course?: string;
	classId?: number;
} {
	if (!filter) {
		return {};
	}

	const nextFilter: {
		studentId?: number;
		course?: string;
		classId?: number;
	} = {};

	if (filter.studentId !== undefined) {
		nextFilter.studentId = assertPositiveInteger(filter.studentId, "studentId");
	}

	if (filter.course !== undefined) {
		nextFilter.course = assertNonEmptyString(filter.course, "course");
	}

	if (filter.classId !== undefined) {
		nextFilter.classId = assertPositiveInteger(filter.classId, "classId");
	}

	return nextFilter;
}