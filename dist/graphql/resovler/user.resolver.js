"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const jwt_1 = require("../../auth/jwt");
class UserResolver {
    constructor(userService, gradeService, classService) {
        this.userService = userService;
        this.gradeService = gradeService;
        this.classService = classService;
        this.users = async () => {
            return this.userService.getUsers();
        };
        this.user = async (args) => {
            return this.userService.getUser(Number(args.id));
        };
        this.myGrades = async (args, context) => {
            const authenticatedUserId = (0, jwt_1.getAuthenticatedUserId)(context.headers);
            return this.gradeService.getMyGradesByCourse(authenticatedUserId, args.courses);
        };
        this.gradeAnalytics = async (args, context) => {
            const authenticatedUserId = (0, jwt_1.getAuthenticatedUserId)(context.headers);
            return this.gradeService.getGradeAnalytics(authenticatedUserId, args.filter);
        };
        this.classes = async (args) => {
            return this.classService.getClasses(args.sortOrder);
        };
        this.class = async (args) => {
            return this.classService.getClass(Number(args.id));
        };
        this.createUser = async (args) => {
            return this.userService.createUser(args.input);
        };
        this.login = async (args) => {
            return this.userService.login(args.input);
        };
        this.updateUser = async (args, context) => {
            const authenticatedUserId = (0, jwt_1.getAuthenticatedUserId)(context.headers);
            return this.userService.updateUser(Number(args.id), args.input, authenticatedUserId);
        };
        this.deleteUser = async (args, context) => {
            const authenticatedUserId = (0, jwt_1.getAuthenticatedUserId)(context.headers);
            return this.userService.deleteUser(Number(args.id), authenticatedUserId);
        };
        this.createGrade = async (args, context) => {
            const authenticatedUserId = (0, jwt_1.getAuthenticatedUserId)(context.headers);
            return this.gradeService.createGrade(args.input, authenticatedUserId);
        };
        this.updateGrade = async (args, context) => {
            const authenticatedUserId = (0, jwt_1.getAuthenticatedUserId)(context.headers);
            return this.gradeService.updateGrade(Number(args.id), args.input, authenticatedUserId);
        };
        this.deleteGrade = async (args, context) => {
            const authenticatedUserId = (0, jwt_1.getAuthenticatedUserId)(context.headers);
            return this.gradeService.deleteGrade(Number(args.id), authenticatedUserId);
        };
        this.createClass = async (args, context) => {
            const authenticatedUserId = (0, jwt_1.getAuthenticatedUserId)(context.headers);
            return this.classService.createClass(args.input, authenticatedUserId);
        };
        this.updateClass = async (args, context) => {
            const authenticatedUserId = (0, jwt_1.getAuthenticatedUserId)(context.headers);
            return this.classService.updateClass(Number(args.id), args.input, authenticatedUserId);
        };
        this.deleteClass = async (args, context) => {
            const authenticatedUserId = (0, jwt_1.getAuthenticatedUserId)(context.headers);
            return this.classService.deleteClass(Number(args.id), authenticatedUserId);
        };
        this.addStudentToClass = async (args, context) => {
            const authenticatedUserId = (0, jwt_1.getAuthenticatedUserId)(context.headers);
            return this.classService.addStudentToClass(Number(args.classId), Number(args.studentId), authenticatedUserId);
        };
    }
}
exports.UserResolver = UserResolver;
