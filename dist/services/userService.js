"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_validator_1 = require("../validator/user.validator");
const jwt_1 = require("../auth/jwt");
class UserService {
    constructor(userRepository) {
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
    async createUser(input) {
        const payload = (0, user_validator_1.validateCreateUserInput)(input);
        const existing = await this.userRepository.findByEmail(payload.email);
        if (existing) {
            throw new Error("A user with this email already exists");
        }
        const hashedPassword = await bcryptjs_1.default.hash(payload.password, 10);
        const created = await this.userRepository.create({
            email: payload.email,
            pseudo: payload.pseudo,
            password: hashedPassword,
            role: payload.role,
        });
        return this.toPublicUser(created);
    }
    async login(input) {
        const payload = (0, user_validator_1.validateLoginInput)(input);
        const existing = await this.userRepository.findByEmail(payload.email);
        if (!existing) {
            throw new Error("Invalid email or password");
        }
        const passwordMatches = await bcryptjs_1.default.compare(payload.password, existing.password);
        if (!passwordMatches) {
            throw new Error("Invalid email or password");
        }
        const user = this.toPublicUser(existing);
        const token = (0, jwt_1.generateAccessToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        return { token, user };
    }
    async getUsers() {
        const users = await this.userRepository.findAll();
        return users.map((user) => this.toPublicUser(user));
    }
    async getUser(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return this.toPublicUser(user);
    }
    async updateUser(targetUserId, input, authenticatedUserId) {
        if (!authenticatedUserId) {
            throw new Error("Authentication required");
        }
        if (targetUserId !== authenticatedUserId) {
            throw new Error("You can only update yourself");
        }
        const existing = await this.userRepository.findById(targetUserId);
        if (!existing) {
            throw new Error("User not found");
        }
        const payload = (0, user_validator_1.validateUpdateUserInput)(input);
        if (payload.email && payload.email !== existing.email) {
            const withSameEmail = await this.userRepository.findByEmail(payload.email);
            if (withSameEmail) {
                throw new Error("A user with this email already exists");
            }
        }
        const updateData = {
            email: payload.email,
            pseudo: payload.pseudo,
            role: payload.role,
        };
        if (payload.password) {
            updateData.password = await bcryptjs_1.default.hash(payload.password, 10);
        }
        const updated = await this.userRepository.updateById(targetUserId, updateData);
        return this.toPublicUser(updated);
    }
    async deleteUser(targetUserId, authenticatedUserId) {
        if (!authenticatedUserId) {
            throw new Error("Authentication required");
        }
        if (targetUserId !== authenticatedUserId) {
            throw new Error("You can only delete yourself");
        }
        const existing = await this.userRepository.findById(targetUserId);
        if (!existing) {
            throw new Error("User not found");
        }
        await this.userRepository.deleteById(targetUserId);
        return true;
    }
}
exports.UserService = UserService;
