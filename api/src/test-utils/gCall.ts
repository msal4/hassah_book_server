import { graphql, GraphQLSchema } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";

import { createSchema } from "@api/utils/createSchema";
import { RequestContext } from "@api/modules/types/RequestContext";

interface Options {
  source: string;
  variableValues?: Maybe<{ [key: string]: any }>;
  contextValue?: RequestContext;
}

let schema: GraphQLSchema;

export const gCall = async ({ source, variableValues, contextValue }: Options) => {
  if (!schema) {
    schema = await createSchema();
  }
  return await graphql({
    schema,
    source,
    variableValues,
    contextValue,
  });
};
