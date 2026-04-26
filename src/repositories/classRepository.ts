import { Prisma } from "@prisma/client";
import prisma from "../db/users";

const CLASS_PUBLIC_INCLUDE = {
	students: true,
} satisfies Prisma.ClassInclude;

export type ClassWithStudents = Prisma.ClassGetPayload<{
	include: typeof CLASS_PUBLIC_INCLUDE;
}>;

export interface CreateClassData {
	name: string;
	professorId?: number;
}

export interface UpdateClassData {
	name?: string;
	professorId?: number;
}

export class ClassRepository {
	async create(data: CreateClassData): Promise<ClassWithStudents> {
		return prisma.class.create({
			data,
			include: CLASS_PUBLIC_INCLUDE,
		});
	}

	async findAllSorted(order: "asc" | "desc"): Promise<ClassWithStudents[]> {
		return prisma.class.findMany({
			orderBy: { name: order },
			include: CLASS_PUBLIC_INCLUDE,
		});
	}

	async findById(id: number): Promise<ClassWithStudents | null> {
		return prisma.class.findUnique({
			where: { id },
			include: CLASS_PUBLIC_INCLUDE,
		});
	}

	async findByName(name: string): Promise<ClassWithStudents | null> {
		return prisma.class.findUnique({
			where: { name },
			include: CLASS_PUBLIC_INCLUDE,
		});
	}

	async updateById(id: number, data: UpdateClassData): Promise<ClassWithStudents> {
		return prisma.class.update({
			where: { id },
			data,
			include: CLASS_PUBLIC_INCLUDE,
		});
	}

	async deleteById(id: number): Promise<void> {
		await prisma.class.delete({ where: { id } });
	}

	async addStudent(id: number, studentId: number): Promise<ClassWithStudents> {
		return prisma.class.update({
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