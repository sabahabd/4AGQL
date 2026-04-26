import { User } from "@prisma/client";
import prisma from "../db/users";
import { UserRole } from "../models/User";

export interface CreateUserData {
	email: string;
	pseudo: string;
	password: string;
	role: UserRole;
}

export interface UpdateUserData {
	email?: string;
	pseudo?: string;
	password?: string;
	role?: UserRole;
}

export class UserRepository {
	async create(data: CreateUserData): Promise<User> {
		return prisma.user.create({ data });
	}

	async findAll(): Promise<User[]> {
		return prisma.user.findMany({ orderBy: { id: "asc" } });
	}

	async findById(id: number): Promise<User | null> {
		return prisma.user.findUnique({ where: { id } });
	}

	async findByEmail(email: string): Promise<User | null> {
		return prisma.user.findUnique({ where: { email } });
	}

	async updateById(id: number, data: UpdateUserData): Promise<User> {
		return prisma.user.update({ where: { id }, data });
	}

	async deleteById(id: number): Promise<User> {
		return prisma.user.delete({ where: { id } });
	}
}
