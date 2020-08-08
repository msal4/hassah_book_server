import { Request, Response } from "express";

import { JwtAccessPayload } from "@api/modules/shared/types/JwtPayload";
import { Loaders } from "@api/utils/loaders";

export interface RequestContext {
  req: Request;
  res: Response;
  payload?: JwtAccessPayload; // available only when the user is authenticated.
  loaders: Loaders;
}
