import { describe, it, expect } from "vitest";
import {
	validateCreateGradeInput,
	validateUpdateGradeInput,
	validateCoursesFilter,
} from "../src/validator/grade.validator";

describe("grade.validator", () => {
	describe("validateCreateGradeInput", () => {
		it("accepts valid input", () => {
			const input = { course: "Math", value: 12.5, studentId: 1, classId: 2 };
			const result = validateCreateGradeInput(input);
			expect(result).toEqual({ course: "Math", value: 12.5, studentId: 1, classId: 2 });
		});

		it("throws on invalid fields", () => {
			expect(() => validateCreateGradeInput({ course: "", value: NaN, studentId: 0, classId: -1 } as any)).toThrow();
		});
	});

	describe("validateUpdateGradeInput", () => {
		it("accepts partial updates", () => {
			const input = { value: 15 };
			const result = validateUpdateGradeInput(input);
			expect(result).toEqual({ value: 15 });
		});

		it("throws when no fields provided", () => {
			expect(() => validateUpdateGradeInput({} as any)).toThrow("At least one field is required for update");
		});
	});

	describe("validateCoursesFilter", () => {
		it("returns undefined when courses undefined", () => {
			expect(validateCoursesFilter(undefined)).toBeUndefined();
		});

		it("normalizes and returns array when valid", () => {
			const input = [" Math ", "Physics"];
			expect(validateCoursesFilter(input)).toEqual(["Math", "Physics"]);
		});

		it("throws when not an array", () => {
			expect(() => validateCoursesFilter("not-an-array" as any)).toThrow();
		});
	});
});
