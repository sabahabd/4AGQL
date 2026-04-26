"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeRepository = void 0;
const users_1 = __importDefault(require("../db/users"));
class GradeRepository {
    async create(data) {
        return users_1.default.grade.create({ data });
    }
    async findById(id) {
        return users_1.default.grade.findUnique({ where: { id } });
    }
    async updateById(id, data) {
        return users_1.default.grade.update({ where: { id }, data });
    }
    async deleteById(id) {
        return users_1.default.grade.delete({ where: { id } });
    }
    async findByStudentIdAndCourses(studentId, courses) {
        return users_1.default.grade.findMany({
            where: {
                studentId,
                ...(courses && courses.length > 0 ? { course: { in: courses } } : {}),
            },
            orderBy: [{ course: "asc" }, { id: "asc" }],
        });
    }
    async findByFilters(filters) {
        return users_1.default.grade.findMany({
            where: {
                ...(filters.studentId !== undefined ? { studentId: filters.studentId } : {}),
                ...(filters.course !== undefined ? { course: filters.course } : {}),
                ...(filters.classId !== undefined ? { classId: filters.classId } : {}),
            },
            orderBy: [{ course: "asc" }, { id: "asc" }],
        });
    }
}
exports.GradeRepository = GradeRepository;
