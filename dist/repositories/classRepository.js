"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassRepository = void 0;
const users_1 = __importDefault(require("../db/users"));
const CLASS_PUBLIC_INCLUDE = {
    students: true,
};
class ClassRepository {
    async create(data) {
        return users_1.default.class.create({
            data,
            include: CLASS_PUBLIC_INCLUDE,
        });
    }
    async findAllSorted(order) {
        return users_1.default.class.findMany({
            orderBy: { name: order },
            include: CLASS_PUBLIC_INCLUDE,
        });
    }
    async findById(id) {
        return users_1.default.class.findUnique({
            where: { id },
            include: CLASS_PUBLIC_INCLUDE,
        });
    }
    async findByName(name) {
        return users_1.default.class.findUnique({
            where: { name },
            include: CLASS_PUBLIC_INCLUDE,
        });
    }
    async updateById(id, data) {
        return users_1.default.class.update({
            where: { id },
            data,
            include: CLASS_PUBLIC_INCLUDE,
        });
    }
    async deleteById(id) {
        await users_1.default.class.delete({ where: { id } });
    }
    async addStudent(id, studentId) {
        return users_1.default.class.update({
            where: { id },
            data: {
                students: {
                    connect: { id: studentId },
                },
            },
            include: CLASS_PUBLIC_INCLUDE,
        });
    }
}
exports.ClassRepository = ClassRepository;
