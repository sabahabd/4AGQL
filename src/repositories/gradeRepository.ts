import { Grade } from "@prisma/client";
import prisma from "../db/users";

export interface CreateGradeData {
	course: string;
	value: number;
	studentId: number;
	classId: number;
}

export interface UpdateGradeData {
	course?: string;
	value?: number;
	studentId?: number;
	classId?: number;
}

export interface GradeFilters {
	studentId?: number;
	course?: string;
	classId?: number;
}

export class GradeRepository {
	async create(data: CreateGradeData): Promise<Grade> {
		return prisma.grade.create({ data });
	}

	async findById(id: number): Promise<Grade | null> {
		return prisma.grade.findUnique({ where: { id } });
	}

	async updateById(id: number, data: UpdateGradeData): Promise<Grade> {
		return prisma.grade.update({ where: { id }, data });
	}

	async deleteById(id: number): Promise<Grade> {
		return prisma.grade.delete({ where: { id } });
	}

	async findByStudentIdAndCourses(studentId: number, courses?: string[]): Promise<Grade[]> {
		return prisma.grade.findMany({
			where: {
				studentId,
				...(courses && courses.length > 0 ? { course: { in: courses } } : {}),
			},
			orderBy: [{ course: "asc" }, { id: "asc" }],
		});
	}

	async findByFilters(filters: GradeFilters): Promise<Grade[]> {
		return prisma.grade.findMany({
			where: {
				...(filters.studentId !== undefined ? { studentId: filters.studentId } : {}),
				...(filters.course !== undefined ? { course: filters.course } : {}),
				...(filters.classId !== undefined ? { classId: filters.classId } : {}),
			},
			orderBy: [{ course: "asc" }, { id: "asc" }],
		});
	}
}