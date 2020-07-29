import { Request, Response } from "express";

import { JwtAccessPayload } from "@api/modules/types/JwtPayload";

export interface ApiContext {
  req: Request;
  res: Response;
  payload?: JwtAccessPayload;
}
