"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassService = void 0;
const class_validator_1 = require("../validator/class.validator");
class ClassService {
    constructor(classRepository, userRepository) {
        this.classRepository = classRepository;
        this.userRepository = userRepository;
    }
    toPublicUser(user) {
        return {
            id: user.id,
            email: user.email,
            pseudo: user.pseudo,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    toPublicClass(classroom) {
        return {
            id: classroom.id,
            name: classroom.name,
            professorId: classroom.professorId,
            students: classroom.students.map((student) => this.toPublicUser(student)),
            createdAt: classroom.createdAt,
            updatedAt: classroom.updatedAt,
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
            throw new Error("Only professors can manage classes");
        }
        return authenticatedUser.id;
    }
    async getClasses(sortOrder) {
        const order = (0, class_validator_1.validateClassSortOrder)(sortOrder);
        const classes = await this.classRepository.findAllSorted(order);
        return classes.map((classroom) => this.toPublicClass(classroom));
    }
    async getClass(id) {
        const classroom = await this.classRepository.findById(id);
        if (!classroom) {
            throw new Error("Class not found");
        }
        return this.toPublicClass(classroom);
    }
    async createClass(input, authenticatedUserId) {
        const professorId = await this.assertProfessor(authenticatedUserId);
        const payload = (0, class_validator_1.validateCreateClassInput)(input);
        const existingWithSameName = await this.classRepository.findByName(payload.name);
        if (existingWithSameName) {
            throw new Error("A class with this name already exists");
        }
        const createData = {
            name: payload.name,
            professorId: payload.professorId ?? professorId,
        };
        const created = await this.classRepository.create(createData);
        return this.toPublicClass(created);
    }
    async updateClass(id, input, authenticatedUserId) {
        await this.assertProfessor(authenticatedUserId);
        const existing = await this.classRepository.findById(id);
        if (!existing) {
            throw new Error("Class not found");
        }
        const payload = (0, class_validator_1.validateUpdateClassInput)(input);
        if (payload.name && payload.name !== existing.name) {
            const existingWithSameName = await this.classRepository.findByName(payload.name);
            if (existingWithSameName) {
                throw new Error("A class with this name already exists");
            }
        }
        const updateData = {
            name: payload.name,
            professorId: payload.professorId,
        };
        const updated = await this.classRepository.updateById(id, updateData);
        return this.toPublicClass(updated);
    }
    async deleteClass(id, authenticatedUserId) {
        await this.assertProfessor(authenticatedUserId);
        const existing = await this.classRepository.findById(id);
        if (!existing) {
            throw new Error("Class not found");
        }
        if (existing.students.length > 0) {
            throw new Error("Cannot delete class: at least one student is assigned to it");
        }
        await this.classRepository.deleteById(id);
        return true;
    }
    async addStudentToClass(classId, studentId, authenticatedUserId) {
        await this.assertProfessor(authenticatedUserId);
        (0, class_validator_1.validateClassAndStudentIds)(classId, studentId);
        const classroom = await this.classRepository.findById(classId);
        if (!classroom) {
            throw new Error("Class not found");
        }
        const student = await this.userRepository.findById(studentId);
        if (!student) {
            throw new Error("Student not found");
        }
        if (student.role !== "Student") {
            throw new Error("Only users with Student role can be added to a class");
        }
        const updated = await this.classRepository.addStudent(classId, studentId);
        return this.toPublicClass(updated);
    }
}
exports.ClassService = ClassService;
