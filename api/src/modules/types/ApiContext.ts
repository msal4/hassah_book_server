import { Request, Response } from "express";

import { JwtAccessPayload } from "src/modules/types/JwtPayload";

export interface ApiContext {
  req: Request;
  res: Response;
  payload?: JwtAccessPayload;
}
