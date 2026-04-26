"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const users_1 = __importDefault(require("../db/users"));
class UserRepository {
    async create(data) {
        return users_1.default.user.create({ data });
    }
    async findAll() {
        return users_1.default.user.findMany({ orderBy: { id: "asc" } });
    }
    async findById(id) {
        return users_1.default.user.findUnique({ where: { id } });
    }
    async findByEmail(email) {
        return users_1.default.user.findUnique({ where: { email } });
    }
    async updateById(id, data) {
        return users_1.default.user.update({ where: { id }, data });
    }
    async deleteById(id) {
        return users_1.default.user.delete({ where: { id } });
    }
}
exports.UserRepository = UserRepository;
