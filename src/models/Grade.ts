export interface Grade {
	id: number;
	course: string;
	value: number;
	studentId: number;
	classId: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface PublicGrade {
	id: number;
	course: string;
	value: number;
	studentId: number;
	classId: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface CourseGrades {
	course: string;
	grades: PublicGrade[];
}

export interface CreateGradeInput {
	course: string;
	value: number;
	studentId: number;
	classId: number;
}

export interface UpdateGradeInput {
	course?: string;
	value?: number;
	studentId?: number;
	classId?: number;
}

export interface GradeAnalyticsFilter {
	studentId?: number;
	course?: string;
	classId?: number;
}

export interface GradeStatistics {
	count: number;
	averageValue: number | null;
	medianValue: number | null;
	lowestGrade: number | null;
	highestGrade: number | null;
}

export interface GradeAnalyticsResult {
	grades: PublicGrade[];
	statistics: GradeStatistics;
}