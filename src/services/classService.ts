import {
	ClassSortOrder,
	CreateClassInput,
	PublicClass,
	UpdateClassInput,
} from "../models/Class";
import { PublicUser, UserRole } from "../models/User";
import {
	ClassRepository,
	CreateClassData,
	UpdateClassData,
} from "../repositories/classRepository";
import { UserRepository } from "../repositories/userRepository";
import {
	validateClassAndStudentIds,
	validateClassSortOrder,
	validateCreateClassInput,
	validateUpdateClassInput,
} from "../validator/class.validator";

export class ClassService {
	constructor(
		private readonly classRepository: ClassRepository,
		private readonly userRepository: UserRepository
	) {}

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

	private toPublicClass(classroom: {
		id: number;
		name: string;
		professorId: number | null;
		createdAt: Date;
		updatedAt: Date;
		students: Array<{
			id: number;
			email: string;
			pseudo: string;
			role: string;
			createdAt: Date;
			updatedAt: Date;
		}>;
	}): PublicClass {
		return {
			id: classroom.id,
			name: classroom.name,
			professorId: classroom.professorId,
			students: classroom.students.map((student) => this.toPublicUser(student)),
			createdAt: classroom.createdAt,
			updatedAt: classroom.updatedAt,
		};
	}

	private async assertProfessor(authenticatedUserId: number | null): Promise<number> {
		if (!authenticatedUserId) {
			throw new Error("Authentication required");
		}

		const authenticatedUser = await this.userRepository.findById(authenticatedUserId);

		if (!authenticatedUser) {
			throw new Error("Authenticated user not found");
		}

		if ((authenticatedUser.role as UserRole) !== "Professor") {
			throw new Error("Only professors can manage classes");
		}

		return authenticatedUser.id;
	}

	async getClasses(sortOrder?: ClassSortOrder): Promise<PublicClass[]> {
		const order = validateClassSortOrder(sortOrder);
		const classes = await this.classRepository.findAllSorted(order);
		return classes.map((classroom) => this.toPublicClass(classroom));
	}

	async getClass(id: number): Promise<PublicClass> {
		const classroom = await this.classRepository.findById(id);

		if (!classroom) {
			throw new Error("Class not found");
		}

		return this.toPublicClass(classroom);
	}

	async createClass(input: CreateClassInput, authenticatedUserId: number | null): Promise<PublicClass> {
		const professorId = await this.assertProfessor(authenticatedUserId);
		const payload = validateCreateClassInput(input);

		const existingWithSameName = await this.classRepository.findByName(payload.name);

		if (existingWithSameName) {
			throw new Error("A class with this name already exists");
		}

		const createData: CreateClassData = {
			name: payload.name,
			professorId: payload.professorId ?? professorId,
		};

		const created = await this.classRepository.create(createData);
		return this.toPublicClass(created);
	}

	async updateClass(
		id: number,
		input: UpdateClassInput,
		authenticatedUserId: number | null
	): Promise<PublicClass> {
		await this.assertProfessor(authenticatedUserId);

		const existing = await this.classRepository.findById(id);

		if (!existing) {
			throw new Error("Class not found");
		}

		const payload = validateUpdateClassInput(input);

		if (payload.name && payload.name !== existing.name) {
			const existingWithSameName = await this.classRepository.findByName(payload.name);

			if (existingWithSameName) {
				throw new Error("A class with this name already exists");
			}
		}

		const updateData: UpdateClassData = {
			name: payload.name,
			professorId: payload.professorId,
		};

		const updated = await this.classRepository.updateById(id, updateData);
		return this.toPublicClass(updated);
	}

	async deleteClass(id: number, authenticatedUserId: number | null): Promise<boolean> {
		await this.assertProfessor(authenticatedUserId);

		const existing = await this.classRepository.findById(id);

		if (!existing) {
			throw new Error("Class not found");
		}

		if (existing.students.length > 0) {
			throw new Error("Cannot delete class: at least one student is assigned to it");
		}

		await this.classRepository.deleteById(id);
		return true;
	}

	async addStudentToClass(
		classId: number,
		studentId: number,
		authenticatedUserId: number | null
	): Promise<PublicClass> {
		await this.assertProfessor(authenticatedUserId);
		validateClassAndStudentIds(classId, studentId);

		const classroom = await this.classRepository.findById(classId);

		if (!classroom) {
			throw new Error("Class not found");
		}

		const student = await this.userRepository.findById(studentId);

		if (!student) {
			throw new Error("Student not found");
		}

		if ((student.role as UserRole) !== "Student") {
			throw new Error("Only users with Student role can be added to a class");
		}

		const updated = await this.classRepository.addStudent(classId, studentId);
		return this.toPublicClass(updated);
	}
}