export type UserRole = "Student" | "Professor";

export interface User {
	id: number;
	email: string;
	pseudo: string;
	password: string;
	role: UserRole;
	createdAt: Date;
	updatedAt: Date;
}

export interface PublicUser {
	id: number;
	email: string;
	pseudo: string;
	role: UserRole;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateUserInput {
	email: string;
	pseudo: string;
	password: string;
	role: UserRole;
}

export interface UpdateUserInput {
	email?: string;
	pseudo?: string;
	password?: string;
	role?: UserRole;
}

export interface LoginInput {
	email: string;
	password: string;
}

export interface AuthPayload {
	token: string;
	user: PublicUser;
}
