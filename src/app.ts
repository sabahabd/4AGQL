import express from "express";
import fs from "fs";
import path from "path";
import { createHandler } from "graphql-http/lib/use/express";
import { UserRepository } from "./repositories/userRepository";
import { GradeRepository } from "./repositories/gradeRepository";
import { ClassRepository } from "./repositories/classRepository";
import { UserService } from "./services/userService";
import { GradeService } from "./services/gradeService";
import { ClassService } from "./services/classService";
import { UserResolver } from "./graphql/resovler/user.resolver";
import { UserSchema } from "./graphql/schema/user.schema";


const app = express();
const PORT = 3000;

const userRepository = new UserRepository();
const gradeRepository = new GradeRepository();
const classRepository = new ClassRepository();
const userService = new UserService(userRepository);
const gradeService = new GradeService(gradeRepository, userRepository);
const classService = new ClassService(classRepository, userRepository);
const userResolver = new UserResolver(userService, gradeService, classService);
const distPublicDirectory = path.join(__dirname, "public");
const srcPublicDirectory = path.join(process.cwd(), "src/public");
const publicDirectory = fs.existsSync(distPublicDirectory) ? distPublicDirectory : srcPublicDirectory;

app.use(express.json());
app.use(express.static(publicDirectory));

app.all(
  "/graphql",
  createHandler({
    schema: UserSchema,
    rootValue: {
      ...userResolver,
    },
    context: (request) => ({
      headers: request.headers,
    }),

  })
);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
