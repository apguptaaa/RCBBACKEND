import type { RequestHandler } from 'express';
import * as auth from '../services/auth.service.js';
import { createToken } from '../middleware/auth.js';
import { AppError } from '../utils/appError.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

export const register: RequestHandler = async (req, res) => {
  const user = await auth.register(registerSchema.parse(req.body));
  const token = createToken({ id: user.id, email: user.email, role: user.role });
  res.status(201).json({ token, user });
};

export const login: RequestHandler = async (req, res) => {
  const user = await auth.login(loginSchema.parse(req.body));
  const token = createToken({ id: user.id, email: user.email, role: user.role });
  res.json({ token, user });
};

export const getCurrentUser: RequestHandler = async (req, res) => {
  if (!req.authUser) throw new AppError('Authentication required.', 401);
  res.json({ user: await auth.getUser(req.authUser.id) });
};
