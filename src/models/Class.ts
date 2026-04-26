import { PublicUser } from "./User";

export type ClassSortOrder = "ASC" | "DESC";

export interface PublicClass {
	id: number;
	name: string;
	professorId: number | null;
	students: PublicUser[];
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateClassInput {
	name: string;
	professorId?: number;
}

export interface UpdateClassInput {
	name?: string;
	professorId?: number;
}