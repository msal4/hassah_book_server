import { mockRequest, mockResponse } from "mock-req-res";

import { RequestContext } from "@api/modules/types/RequestContext";

export const mockRequestContext = (): RequestContext => ({ req: mockRequest(), res: mockResponse() });
