"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeService = void 0;
const grade_validator_1 = require("../validator/grade.validator");
class GradeService {
    constructor(gradeRepository, userRepository) {
        this.gradeRepository = gradeRepository;
        this.userRepository = userRepository;
    }
    toPublicGrade(grade) {
        return {
            id: grade.id,
            course: grade.course,
            value: grade.value,
            studentId: grade.studentId,
            classId: grade.classId,
            createdAt: grade.createdAt,
            updatedAt: grade.updatedAt,
        };
    }
    async assertProfessor(authenticatedUserId) {
        if (!authenticatedUserId) {
            throw new Error("Authentication required");
        }
        const authenticatedUser = await this.userRepository.findById(authenticatedUserId);
        if (!authenticatedUser) {
            throw new Error("Authenticated user not found");
        }
        if (authenticatedUser.role !== "Professor") {
            throw new Error("Only professors can manage grades");
        }
    }
    async getMyGradesByCourse(authenticatedUserId, courses) {
        if (!authenticatedUserId) {
            throw new Error("Authentication required");
        }
        const normalizedCourses = (0, grade_validator_1.validateCoursesFilter)(courses);
        const grades = await this.gradeRepository.findByStudentIdAndCourses(authenticatedUserId, normalizedCourses);
        const grouped = new Map();
        for (const grade of grades) {
            const publicGrade = this.toPublicGrade(grade);
            const current = grouped.get(publicGrade.course);
            if (current) {
                current.push(publicGrade);
            }
            else {
                grouped.set(publicGrade.course, [publicGrade]);
            }
        }
        return Array.from(grouped.entries()).map(([course, gradeList]) => ({
            course,
            grades: gradeList,
        }));
    }
    async getGradeAnalytics(authenticatedUserId, filter) {
        await this.assertProfessor(authenticatedUserId);
        const normalizedFilter = (0, grade_validator_1.validateGradeAnalyticsFilter)(filter);
        const grades = await this.gradeRepository.findByFilters(normalizedFilter);
        const publicGrades = grades.map((grade) => this.toPublicGrade(grade));
        if (publicGrades.length === 0) {
            return {
                grades: [],
                statistics: {
                    count: 0,
                    averageValue: null,
                    medianValue: null,
                    lowestGrade: null,
                    highestGrade: null,
                },
            };
        }
        const values = publicGrades.map((grade) => grade.value).sort((a, b) => a - b);
        const count = values.length;
        const averageValue = values.reduce((sum, value) => sum + value, 0) / count;
        const middle = Math.floor(count / 2);
        const medianValue = count % 2 === 0 ? (values[middle - 1] + values[middle]) / 2 : values[middle];
        return {
            grades: publicGrades,
            statistics: {
                count,
                averageValue,
                medianValue,
                lowestGrade: values[0],
                highestGrade: values[count - 1],
            },
        };
    }
    async createGrade(input, authenticatedUserId) {
        await this.assertProfessor(authenticatedUserId);
        const payload = (0, grade_validator_1.validateCreateGradeInput)(input);
        const created = await this.gradeRepository.create(payload);
        return this.toPublicGrade(created);
    }
    async updateGrade(id, input, authenticatedUserId) {
        await this.assertProfessor(authenticatedUserId);
        const existing = await this.gradeRepository.findById(id);
        if (!existing) {
            throw new Error("Grade not found");
        }
        const payload = (0, grade_validator_1.validateUpdateGradeInput)(input);
        const updateData = {
            course: payload.course,
            value: payload.value,
            studentId: payload.studentId,
            classId: payload.classId,
        };
        const updated = await this.gradeRepository.updateById(id, updateData);
        return this.toPublicGrade(updated);
    }
    async deleteGrade(id, authenticatedUserId) {
        await this.assertProfessor(authenticatedUserId);
        const existing = await this.gradeRepository.findById(id);
        if (!existing) {
            throw new Error("Grade not found");
        }
        await this.gradeRepository.deleteById(id);
        return true;
    }
}
exports.GradeService = GradeService;
