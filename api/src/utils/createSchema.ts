import { buildSchema } from "type-graphql";
import { join } from "path";

export const createSchema = () => {
  return buildSchema({
    resolvers: [join(__dirname, "../modules/**/*.resolver.ts")],
  });
};
