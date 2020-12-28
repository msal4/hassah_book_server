import { GraphQLSchema } from "graphql";
import { PluginDefinition } from "apollo-server-core";
import { getComplexity, fieldExtensionsEstimator, simpleEstimator } from "graphql-query-complexity";

import { MAX_QUERY_COMPLEXITY } from "@api/modules/constants/query";

export const queryComplexityPlugin = (schema: GraphQLSchema): PluginDefinition => ({
  requestDidStart: () => ({
    didResolveOperation({ request, document }) {
      const complexity = getComplexity({
        schema,
        operationName: request.operationName,
        query: document,
        variables: request.variables,
        estimators: [fieldExtensionsEstimator(), simpleEstimator({ defaultComplexity: 1 })],
      });
      if (complexity > MAX_QUERY_COMPLEXITY) {
        throw new Error(
          `Sorry, too complicated query! ${complexity} is over ${MAX_QUERY_COMPLEXITY} that is the max allowed complexity.`
        );
      }
      console.log("Used query complexity points:", complexity);
    },
  }),
});
