import { Request, Response } from "express";

import { JwtAccessPayload } from "@api/modules/types/JwtPayload";

export interface RequestContext {
  req: Request;
  res: Response;
  payload?: JwtAccessPayload;
}
