import {
	CourseGrades,
	GradeAnalyticsFilter,
	GradeAnalyticsResult,
	CreateGradeInput,
	PublicGrade,
	UpdateGradeInput,
} from "../models/Grade";
import { UserRole } from "../models/User";
import { GradeRepository, UpdateGradeData } from "../repositories/gradeRepository";
import { UserRepository } from "../repositories/userRepository";
import {
	validateCoursesFilter,
	validateGradeAnalyticsFilter,
	validateCreateGradeInput,
	validateUpdateGradeInput,
} from "../validator/grade.validator";

export class GradeService {
	constructor(
		private readonly gradeRepository: GradeRepository,
		private readonly userRepository: UserRepository
	) {}

	private toPublicGrade(grade: {
		id: number;
		course: string;
		value: number;
		studentId: number;
		classId: number;
		createdAt: Date;
		updatedAt: Date;
	}): PublicGrade {
		return {
			id: grade.id,
			course: grade.course,
			value: grade.value,
			studentId: grade.studentId,
			classId: grade.classId,
			createdAt: grade.createdAt,
			updatedAt: grade.updatedAt,
		};
	}

	private async assertProfessor(authenticatedUserId: number | null): Promise<void> {
		if (!authenticatedUserId) {
			throw new Error("Authentication required");
		}

		const authenticatedUser = await this.userRepository.findById(authenticatedUserId);

		if (!authenticatedUser) {
			throw new Error("Authenticated user not found");
		}

		if ((authenticatedUser.role as UserRole) !== "Professor") {
			throw new Error("Only professors can manage grades");
		}
	}

	async getMyGradesByCourse(
		authenticatedUserId: number | null,
		courses?: string[]
	): Promise<CourseGrades[]> {
		if (!authenticatedUserId) {
			throw new Error("Authentication required");
		}

		const normalizedCourses = validateCoursesFilter(courses);
		const grades = await this.gradeRepository.findByStudentIdAndCourses(
			authenticatedUserId,
			normalizedCourses
		);

		const grouped = new Map<string, PublicGrade[]>();

		for (const grade of grades) {
			const publicGrade = this.toPublicGrade(grade);
			const current = grouped.get(publicGrade.course);

			if (current) {
				current.push(publicGrade);
			} else {
				grouped.set(publicGrade.course, [publicGrade]);
			}
		}

		return Array.from(grouped.entries()).map(([course, gradeList]) => ({
			course,
			grades: gradeList,
		}));
	}

	async getGradeAnalytics(
		authenticatedUserId: number | null,
		filter?: GradeAnalyticsFilter
	): Promise<GradeAnalyticsResult> {
		await this.assertProfessor(authenticatedUserId);
		const normalizedFilter = validateGradeAnalyticsFilter(filter);
		const grades = await this.gradeRepository.findByFilters(normalizedFilter);
		const publicGrades = grades.map((grade) => this.toPublicGrade(grade));

		if (publicGrades.length === 0) {
			return {
				grades: [],
				statistics: {
					count: 0,
					averageValue: null,
					medianValue: null,
					lowestGrade: null,
					highestGrade: null,
				},
			};
		}

		const values = publicGrades.map((grade) => grade.value).sort((a, b) => a - b);
		const count = values.length;
		const averageValue = values.reduce((sum, value) => sum + value, 0) / count;
		const middle = Math.floor(count / 2);
		const medianValue =
			count % 2 === 0 ? (values[middle - 1] + values[middle]) / 2 : values[middle];

		return {
			grades: publicGrades,
			statistics: {
				count,
				averageValue,
				medianValue,
				lowestGrade: values[0],
				highestGrade: values[count - 1],
			},
		};
	}

	async createGrade(input: CreateGradeInput, authenticatedUserId: number | null): Promise<PublicGrade> {
		await this.assertProfessor(authenticatedUserId);
		const payload = validateCreateGradeInput(input);
		const created = await this.gradeRepository.create(payload);
		return this.toPublicGrade(created);
	}

	async updateGrade(
		id: number,
		input: UpdateGradeInput,
		authenticatedUserId: number | null
	): Promise<PublicGrade> {
		await this.assertProfessor(authenticatedUserId);

		const existing = await this.gradeRepository.findById(id);

		if (!existing) {
			throw new Error("Grade not found");
		}

		const payload = validateUpdateGradeInput(input);
		const updateData: UpdateGradeData = {
			course: payload.course,
			value: payload.value,
			studentId: payload.studentId,
			classId: payload.classId,
		};

		const updated = await this.gradeRepository.updateById(id, updateData);
		return this.toPublicGrade(updated);
	}

	async deleteGrade(id: number, authenticatedUserId: number | null): Promise<boolean> {
		await this.assertProfessor(authenticatedUserId);

		const existing = await this.gradeRepository.findById(id);

		if (!existing) {
			throw new Error("Grade not found");
		}

		await this.gradeRepository.deleteById(id);
		return true;
	}
}