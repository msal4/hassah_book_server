import { Request, Response } from "express";

import { JwtAccessPayload } from "@api/modules/shared/types/JwtPayload";

export interface RequestContext {
  req: Request;
  res: Response;
  payload?: JwtAccessPayload;
}
