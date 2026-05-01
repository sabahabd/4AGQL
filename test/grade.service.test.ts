import { describe, it, expect, beforeEach } from "vitest";
import { GradeService } from "../src/services/gradeService";

const makeGrade = (overrides = {}) => ({
	id: 1,
	course: "Math",
	value: 12,
	studentId: 2,
	classId: 3,
	createdAt: new Date("2023-01-01"),
	updatedAt: new Date("2023-01-01"),
	...overrides,
});

describe("GradeService", () => {
	let mockGradeRepo: any;
	let mockUserRepo: any;
	let svc: GradeService;

	beforeEach(() => {
		mockGradeRepo = {
			findByStudentIdAndCourses: () => [],
			findByFilters: () => [],
			create: () => null,
			findById: () => null,
			updateById: () => null,
			deleteById: () => null,
		};

		mockUserRepo = {
			findById: () => ({ id: 10, role: "Professor" }),
		};

		svc = new GradeService(mockGradeRepo, mockUserRepo);
	});

	it("getMyGradesByCourse groups grades by course", async () => {
		const grades = [
			makeGrade({ id: 1, course: "Math", value: 10 }),
			makeGrade({ id: 2, course: "Math", value: 14 }),
			makeGrade({ id: 3, course: "Physics", value: 16 }),
		];

		mockGradeRepo.findByStudentIdAndCourses = async () => grades;

		const result = await svc.getMyGradesByCourse(2, ["Math", "Physics"]);

		expect(result).toHaveLength(2);
		const math = result.find((r) => r.course === "Math");
		expect(math?.grades.map(g => g.value)).toEqual([10, 14]);
	});

	it("getGradeAnalytics returns empty statistics when no grades", async () => {
		mockUserRepo.findById = async () => ({ id: 10, role: "Professor" });
		mockGradeRepo.findByFilters = async () => [];

		const res = await svc.getGradeAnalytics(10, {} as any);
		expect(res.grades).toEqual([]);
		expect(res.statistics.count).toBe(0);
		expect(res.statistics.averageValue).toBeNull();
		expect(res.statistics.medianValue).toBeNull();
	});

	it("getGradeAnalytics computes statistics correctly (odd count)", async () => {
		mockUserRepo.findById = async () => ({ id: 10, role: "Professor" });
		mockGradeRepo.findByFilters = async () => [
			makeGrade({ value: 10 }),
			makeGrade({ value: 14 }),
			makeGrade({ value: 16 }),
		];

		const res = await svc.getGradeAnalytics(10, {} as any);
		expect(res.statistics.count).toBe(3);
		expect(res.statistics.averageValue).toBeCloseTo((10 + 14 + 16) / 3);
		expect(res.statistics.medianValue).toBe(14);
		expect(res.statistics.lowestGrade).toBe(10);
		expect(res.statistics.highestGrade).toBe(16);
	});

	it("getGradeAnalytics computes median correctly (even count)", async () => {
		mockUserRepo.findById = async () => ({ id: 10, role: "Professor" });
		mockGradeRepo.findByFilters = async () => [
			makeGrade({ value: 10 }),
			makeGrade({ value: 12 }),
			makeGrade({ value: 14 }),
			makeGrade({ value: 16 }),
		];

		const res = await svc.getGradeAnalytics(10, {} as any);
		expect(res.statistics.count).toBe(4);
		expect(res.statistics.medianValue).toBe((12 + 14) / 2);
	});
});
