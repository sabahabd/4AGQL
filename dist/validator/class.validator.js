"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateClassSortOrder = validateClassSortOrder;
exports.validateCreateClassInput = validateCreateClassInput;
exports.validateUpdateClassInput = validateUpdateClassInput;
exports.validateClassAndStudentIds = validateClassAndStudentIds;
function assertNonEmptyString(value, fieldName) {
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error(`${fieldName} is required`);
    }
    return value.trim();
}
function assertPositiveInteger(value, fieldName) {
    if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
        throw new Error(`${fieldName} must be a positive integer`);
    }
    return value;
}
function validateClassSortOrder(sortOrder) {
    if (!sortOrder) {
        return "asc";
    }
    if (sortOrder !== "ASC" && sortOrder !== "DESC") {
        throw new Error("sortOrder must be ASC or DESC");
    }
    return sortOrder === "ASC" ? "asc" : "desc";
}
function validateCreateClassInput(input) {
    const name = assertNonEmptyString(input.name, "name");
    const nextInput = { name };
    if (input.professorId !== undefined) {
        nextInput.professorId = assertPositiveInteger(input.professorId, "professorId");
    }
    return nextInput;
}
function validateUpdateClassInput(input) {
    const nextInput = {};
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
function validateClassAndStudentIds(classId, studentId) {
    assertPositiveInteger(classId, "classId");
    assertPositiveInteger(studentId, "studentId");
}
