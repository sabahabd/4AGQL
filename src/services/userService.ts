import bcrypt from "bcryptjs";
import {
	AuthPayload,
	CreateUserInput,
	LoginInput,
	PublicUser,
	UpdateUserInput,
	UserRole,
} from "../models/User";
import {
	UserRepository,
	UpdateUserData,
} from "../repositories/userRepository";
import {
	validateCreateUserInput,
	validateLoginInput,
	validateUpdateUserInput,
} from "../validator/user.validator";
import { generateAccessToken } from "../auth/jwt";

export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	private toPublicUser(user: {
		id: number;
		email: string;
		pseudo: string;
		role: string;
		createdAt: Date;
		updatedAt: Date;
	}): PublicUser {
		return {
			id: user.id,
			email: user.email,
			pseudo: user.pseudo,
			role: user.role as UserRole,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}

	async createUser(input: CreateUserInput): Promise<PublicUser> {
		const payload = validateCreateUserInput(input);
		const existing = await this.userRepository.findByEmail(payload.email);

		if (existing) {
			throw new Error("A user with this email already exists");
		}

		const hashedPassword = await bcrypt.hash(payload.password, 10);
		const created = await this.userRepository.create({
			email: payload.email,
			pseudo: payload.pseudo,
			password: hashedPassword,
			role: payload.role,
		});

		return this.toPublicUser(created);
	}

	async login(input: LoginInput): Promise<AuthPayload> {
		const payload = validateLoginInput(input);
		const existing = await this.userRepository.findByEmail(payload.email);

		if (!existing) {
			throw new Error("Invalid email or password");
		}

		const passwordMatches = await bcrypt.compare(payload.password, existing.password);

		if (!passwordMatches) {
			throw new Error("Invalid email or password");
		}

		const user = this.toPublicUser(existing);
		const token = generateAccessToken({
			userId: user.id,
			email: user.email,
			role: user.role,
		});

		return { token, user };
	}

	async getUsers(): Promise<PublicUser[]> {
		const users = await this.userRepository.findAll();
		return users.map((user) => this.toPublicUser(user));
	}

	async getUser(id: number): Promise<PublicUser> {
		const user = await this.userRepository.findById(id);

		if (!user) {
			throw new Error("User not found");
		}

		return this.toPublicUser(user);
	}

	async updateUser(
		targetUserId: number,
		input: UpdateUserInput,
		authenticatedUserId: number | null
	): Promise<PublicUser> {
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

		const payload = validateUpdateUserInput(input);

		if (payload.email && payload.email !== existing.email) {
			const withSameEmail = await this.userRepository.findByEmail(payload.email);

			if (withSameEmail) {
				throw new Error("A user with this email already exists");
			}
		}

		const updateData: UpdateUserData = {
			email: payload.email,
			pseudo: payload.pseudo,
			role: payload.role,
		};

		if (payload.password) {
			updateData.password = await bcrypt.hash(payload.password, 10);
		}

		const updated = await this.userRepository.updateById(targetUserId, updateData);
		return this.toPublicUser(updated);
	}

	async deleteUser(targetUserId: number, authenticatedUserId: number | null): Promise<boolean> {
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
