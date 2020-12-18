import { Request, Response } from "express";

import { JwtAccessPayload } from "@api/modules/types/JwtPayload";
import { Loaders } from "@api/utils/loaders";

export interface RequestContext {
  req: Request;
  res: Response;
  payload?: JwtAccessPayload; // available when the user is authenticated.
  loaders: Loaders;
}
