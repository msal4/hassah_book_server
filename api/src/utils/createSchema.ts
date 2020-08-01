import { buildSchema } from "type-graphql";
import { join } from "path";
import { Container } from "typedi";

export const createSchema = () => {
  return buildSchema({
    resolvers: [join(__dirname, "../modules/**/*.resolver.ts")],
    container: Container,
  });
};
