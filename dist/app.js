"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_2 = require("graphql-http/lib/use/express");
const userRepository_1 = require("./repositories/userRepository");
const gradeRepository_1 = require("./repositories/gradeRepository");
const classRepository_1 = require("./repositories/classRepository");
const userService_1 = require("./services/userService");
const gradeService_1 = require("./services/gradeService");
const classService_1 = require("./services/classService");
const user_resolver_1 = require("./graphql/resovler/user.resolver");
const user_schema_1 = require("./graphql/schema/user.schema");
const app = (0, express_1.default)();
const PORT = 3000;
const userRepository = new userRepository_1.UserRepository();
const gradeRepository = new gradeRepository_1.GradeRepository();
const classRepository = new classRepository_1.ClassRepository();
const userService = new userService_1.UserService(userRepository);
const gradeService = new gradeService_1.GradeService(gradeRepository, userRepository);
const classService = new classService_1.ClassService(classRepository, userRepository);
const userResolver = new user_resolver_1.UserResolver(userService, gradeService, classService);
const distPublicDirectory = path_1.default.join(__dirname, "public");
const srcPublicDirectory = path_1.default.join(process.cwd(), "src/public");
const publicDirectory = fs_1.default.existsSync(distPublicDirectory) ? distPublicDirectory : srcPublicDirectory;
app.use(express_1.default.json());
app.use(express_1.default.static(publicDirectory));
app.all("/graphql", (0, express_2.createHandler)({
    schema: user_schema_1.UserSchema,
    rootValue: {
        ...userResolver,
    },
    context: (request) => ({
        headers: request.headers,
    }),
}));
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
