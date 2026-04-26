import { buildSchema } from "graphql";

export const UserSchema = buildSchema(`
	type User {
		id: Int!
		email: String!
		pseudo: String!
		role: String!
		createdAt: String!
		updatedAt: String!
	}

	input CreateUserInput {
		email: String!
		pseudo: String!
		password: String!
		role: String!
	}

	input UpdateUserInput {
		email: String
		pseudo: String
		password: String
		role: String
	}

	input LoginInput {
		email: String!
		password: String!
	}

	type AuthPayload {
		token: String!
		user: User!
	}

	type Grade {
		id: Int!
		course: String!
		value: Float!
		studentId: Int!
		classId: Int!
		createdAt: String!
		updatedAt: String!
	}

	type CourseGrades {
		course: String!
		grades: [Grade!]!
	}

	type GradeStatistics {
		count: Int!
		averageValue: Float
		medianValue: Float
		lowestGrade: Float
		highestGrade: Float
	}

	type GradeAnalytics {
		grades: [Grade!]!
		statistics: GradeStatistics!
	}

	enum SortOrder {
		ASC
		DESC
	}

	type Class {
		id: Int!
		name: String!
		professorId: Int
		students: [User!]!
		createdAt: String!
		updatedAt: String!
	}

	input CreateGradeInput {
		course: String!
		value: Float!
		studentId: Int!
		classId: Int!
	}

	input CreateClassInput {
		name: String!
		professorId: Int
	}

	input GradeAnalyticsFilterInput {
		studentId: Int
		course: String
		classId: Int
	}

	input UpdateGradeInput {
		course: String
		value: Float
		studentId: Int
		classId: Int
	}

	input UpdateClassInput {
		name: String
		professorId: Int
	}

	type Query {
		users: [User!]!
		user(id: Int!): User!
		myGrades(courses: [String!]): [CourseGrades!]!
		gradeAnalytics(filter: GradeAnalyticsFilterInput): GradeAnalytics!
		classes(sortOrder: SortOrder): [Class!]!
		class(id: Int!): Class!
	}

	type Mutation {
		createUser(input: CreateUserInput!): User!
		login(input: LoginInput!): AuthPayload!
		updateUser(id: Int!, input: UpdateUserInput!): User!
		deleteUser(id: Int!): Boolean!
		createGrade(input: CreateGradeInput!): Grade!
		updateGrade(id: Int!, input: UpdateGradeInput!): Grade!
		deleteGrade(id: Int!): Boolean!
		createClass(input: CreateClassInput!): Class!
		updateClass(id: Int!, input: UpdateClassInput!): Class!
		deleteClass(id: Int!): Boolean!
		addStudentToClass(classId: Int!, studentId: Int!): Class!
	}
`);
