import bcrypt from 'bcryptjs';
import { prisma } from '../db/client.js';
import type { UserRecord } from '../models/user.model.js';
import type { LoginInput, RegisterInput } from '../validators/auth.validator.js';
import { AppError } from '../utils/appError.js';

export async function register(input: RegisterInput): Promise<UserRecord> {
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash },
    select: { id: true, name: true, email: true, role: true }
  });
  return mapUser(user);
}

export async function login(input: LoginInput): Promise<UserRecord> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new AppError('Email or password is incorrect.', 401);
  }
  return mapUser(user);
}

export async function getUser(id: string): Promise<UserRecord> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true }
  });
  if (!user) throw new AppError('This account no longer exists.', 401);
  return mapUser(user);
}

function mapUser(user: { id: string; name: string; email: string; role: string }): UserRecord {
  if (user.role !== 'customer' && user.role !== 'admin' && user.role !== 'super_admin') {
    throw new AppError('The account has an unsupported role.', 500);
  }
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
