"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateGradeInput = validateCreateGradeInput;
exports.validateUpdateGradeInput = validateUpdateGradeInput;
exports.validateCoursesFilter = validateCoursesFilter;
exports.validateGradeAnalyticsFilter = validateGradeAnalyticsFilter;
function assertNonEmptyString(value, fieldName) {
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error(`${fieldName} is required`);
    }
    return value.trim();
}
function assertFiniteNumber(value, fieldName) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new Error(`${fieldName} must be a valid number`);
    }
    return value;
}
function assertPositiveInteger(value, fieldName) {
    if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
        throw new Error(`${fieldName} must be a positive integer`);
    }
    return value;
}
function validateCreateGradeInput(input) {
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
function validateUpdateGradeInput(input) {
    const nextInput = {};
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
function validateCoursesFilter(courses) {
    if (courses === undefined) {
        return undefined;
    }
    if (!Array.isArray(courses)) {
        throw new Error("courses must be an array of strings");
    }
    const normalized = courses.map((course) => assertNonEmptyString(course, "course"));
    return normalized.length > 0 ? normalized : undefined;
}
function validateGradeAnalyticsFilter(filter) {
    if (!filter) {
        return {};
    }
    const nextFilter = {};
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
