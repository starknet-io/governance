import { Request, Response } from "express";
import { inferAsyncReturnType } from "@trpc/server";

export function createContext({ req, res }: { req: Request; res: Response }) {
  return { req, res, user: req.user, file: req.file }
}

export type Context = inferAsyncReturnType<typeof createContext>;