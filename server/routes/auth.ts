import { Router } from "express";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "../db.js";
import { requireAuth, signToken } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({
    user: { id: req.user!.sub, email: req.user!.email },
  });
});

authRouter.post("/register", async (req, res) => {
  const email = String(req.body?.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(req.body?.password ?? "");

  if (!email || !password) {
    res.status(400).json({ error: "이메일과 비밀번호를 입력해 주세요." });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: "비밀번호는 6자 이상이어야 합니다." });
    return;
  }

  if (findUserByEmail(email)) {
    res.status(409).json({ error: "이미 가입된 이메일입니다. 로그인해 주세요." });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = createUser(email, passwordHash);
  const token = signToken(user.id, user.email);

  res.json({ token, user: { id: user.id, email: user.email } });
});

authRouter.post("/login", async (req, res) => {
  const email = String(req.body?.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(req.body?.password ?? "");

  if (!email || !password) {
    res.status(400).json({ error: "이메일과 비밀번호를 입력해 주세요." });
    return;
  }

  const user = findUserByEmail(email);
  if (!user) {
    res.status(401).json({ error: "가입되지 않은 이메일입니다. 먼저 회원가입해 주세요." });
    return;
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    res.status(401).json({ error: "비밀번호가 올바르지 않습니다." });
    return;
  }

  const token = signToken(user.id, user.email);
  res.json({ token, user: { id: user.id, email: user.email } });
});

authRouter.get("/check-email", (req, res) => {
  const email = String(req.query.email ?? "")
    .trim()
    .toLowerCase();
  if (!email) {
    res.status(400).json({ error: "이메일을 입력해 주세요." });
    return;
  }
  res.json({ registered: Boolean(findUserByEmail(email)) });
});
