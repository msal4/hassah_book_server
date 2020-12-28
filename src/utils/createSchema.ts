import { buildSchema } from "type-graphql";
import { join } from "path";
import { Container } from "typedi";

import { authChecker } from "@api/modules/utils/auth";

export const createSchema = () => {
  return buildSchema({
    resolvers: [join(__dirname, "../modules/**/*.resolver.ts")],
    container: Container,
    authChecker,
  });
};
