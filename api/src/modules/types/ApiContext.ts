import { Request, Response } from "express";
import { JwtAccessPayload } from "./JwtPayload";

export interface ApiContext {
  req: Request;
  res: Response;
  payload?: JwtAccessPayload;
}
