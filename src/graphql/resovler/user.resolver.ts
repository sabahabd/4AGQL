import { UserService } from "../../services/userService";
import { ClassService } from "../../services/classService";
import { CreateUserInput, LoginInput, UpdateUserInput } from "../../models/User";
import { ClassSortOrder, CreateClassInput, UpdateClassInput } from "../../models/Class";
import { CreateGradeInput, GradeAnalyticsFilter, UpdateGradeInput } from "../../models/Grade";
import { GradeService } from "../../services/gradeService";
import { getAuthenticatedUserId, RequestHeaders } from "../../auth/jwt";

interface GraphQLContext {
	headers?: RequestHeaders;
}

interface IdArgs {
	id: number;
}

interface ClassIdAndStudentIdArgs {
	classId: number;
	studentId: number;
}

interface CreateUserArgs {
	input: CreateUserInput;
}

interface UpdateUserArgs {
	id: number;
	input: UpdateUserInput;
}

interface LoginArgs {
	input: LoginInput;
}

interface MyGradesArgs {
	courses?: string[];
}

interface GradeAnalyticsArgs {
	filter?: GradeAnalyticsFilter;
}

interface CreateGradeArgs {
	input: CreateGradeInput;
}

interface UpdateGradeArgs {
	id: number;
	input: UpdateGradeInput;
}

interface ClassesArgs {
	sortOrder?: ClassSortOrder;
}

interface CreateClassArgs {
	input: CreateClassInput;
}

interface UpdateClassArgs {
	id: number;
	input: UpdateClassInput;
}

export class UserResolver {
	constructor(
		private readonly userService: UserService,
		private readonly gradeService: GradeService,
		private readonly classService: ClassService
	) {}

	users = async (): Promise<unknown> => {
		return this.userService.getUsers();
	};

	user = async (args: IdArgs): Promise<unknown> => {
		return this.userService.getUser(Number(args.id));
	};

	myGrades = async (args: MyGradesArgs, context: GraphQLContext): Promise<unknown> => {
		const authenticatedUserId = getAuthenticatedUserId(context.headers);
		return this.gradeService.getMyGradesByCourse(authenticatedUserId, args.courses);
	};

	gradeAnalytics = async (args: GradeAnalyticsArgs, context: GraphQLContext): Promise<unknown> => {
		const authenticatedUserId = getAuthenticatedUserId(context.headers);
		return this.gradeService.getGradeAnalytics(authenticatedUserId, args.filter);
	};

	classes = async (args: ClassesArgs): Promise<unknown> => {
		return this.classService.getClasses(args.sortOrder);
	};

	class = async (args: IdArgs): Promise<unknown> => {
		return this.classService.getClass(Number(args.id));
	};

	createUser = async (args: CreateUserArgs): Promise<unknown> => {
		return this.userService.createUser(args.input);
	};

	login = async (args: LoginArgs): Promise<unknown> => {
		return this.userService.login(args.input);
	};

	updateUser = async (args: UpdateUserArgs, context: GraphQLContext): Promise<unknown> => {
		const authenticatedUserId = getAuthenticatedUserId(context.headers);
		return this.userService.updateUser(Number(args.id), args.input, authenticatedUserId);
	};

	deleteUser = async (args: IdArgs, context: GraphQLContext): Promise<boolean> => {
		const authenticatedUserId = getAuthenticatedUserId(context.headers);
		return this.userService.deleteUser(Number(args.id), authenticatedUserId);
	};

	createGrade = async (args: CreateGradeArgs, context: GraphQLContext): Promise<unknown> => {
		const authenticatedUserId = getAuthenticatedUserId(context.headers);
		return this.gradeService.createGrade(args.input, authenticatedUserId);
	};

	updateGrade = async (args: UpdateGradeArgs, context: GraphQLContext): Promise<unknown> => {
		const authenticatedUserId = getAuthenticatedUserId(context.headers);
		return this.gradeService.updateGrade(Number(args.id), args.input, authenticatedUserId);
	};

	deleteGrade = async (args: IdArgs, context: GraphQLContext): Promise<boolean> => {
		const authenticatedUserId = getAuthenticatedUserId(context.headers);
		return this.gradeService.deleteGrade(Number(args.id), authenticatedUserId);
	};

	createClass = async (args: CreateClassArgs, context: GraphQLContext): Promise<unknown> => {
		const authenticatedUserId = getAuthenticatedUserId(context.headers);
		return this.classService.createClass(args.input, authenticatedUserId);
	};

	updateClass = async (args: UpdateClassArgs, context: GraphQLContext): Promise<unknown> => {
		const authenticatedUserId = getAuthenticatedUserId(context.headers);
		return this.classService.updateClass(Number(args.id), args.input, authenticatedUserId);
	};

	deleteClass = async (args: IdArgs, context: GraphQLContext): Promise<boolean> => {
		const authenticatedUserId = getAuthenticatedUserId(context.headers);
		return this.classService.deleteClass(Number(args.id), authenticatedUserId);
	};

	addStudentToClass = async (
		args: ClassIdAndStudentIdArgs,
		context: GraphQLContext
	): Promise<unknown> => {
		const authenticatedUserId = getAuthenticatedUserId(context.headers);
		return this.classService.addStudentToClass(
			Number(args.classId),
			Number(args.studentId),
			authenticatedUserId
		);
	};
}
