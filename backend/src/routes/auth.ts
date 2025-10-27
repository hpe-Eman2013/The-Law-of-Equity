import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
const r = Router();

r.post("/register", async (req, res) => {
  const { email, name, password } = req.body;
  if(!email || !password) return res.status(400).json({ ok:false, error:"Email and password required" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, name, passwordHash });
  res.json({ ok:true, id:user._id });
});

r.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u) return res.status(401).json({ ok:false, error:"Invalid credentials" });
  if (!u.passwordHash) return res.status(401).json({ ok:false, error:"Invalid credentials" });
  const ok = await bcrypt.compare(password, u.passwordHash);
  if (!ok) return res.status(401).json({ ok:false, error:"Invalid credentials" });
  const token = signToken({ uid: u._id, role: u.role });
  res.json({ ok:true, token, profile:{ id:u._id, email:u.email, name:u.name, role:u.role } });
});

export default r;
