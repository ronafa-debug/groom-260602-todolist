import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production";

export interface AuthPayload {
  sub: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function signToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email }, JWT_SECRET, { expiresIn: "30d" });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "로그인이 필요합니다." });
    return;
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "세션이 만료되었습니다. 다시 로그인해 주세요." });
  }
}
