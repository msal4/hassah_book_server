import { mockRequest, mockResponse } from "mock-req-res";

import { RequestContext } from "@api/modules/shared/types/RequestContext";
import { createLoaders } from "@api/utils/loaders";

export const mockRequestContext = (ctx: Partial<RequestContext> = {}): RequestContext => ({
  loaders: createLoaders(),
  req: mockRequest(),
  res: mockResponse(),
  ...ctx,
});
