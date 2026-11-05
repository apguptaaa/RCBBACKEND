import { createHmac, timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  role: 'customer' | 'admin' | 'super_admin';
}

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
    }
  }
}

const secret = process.env.JWT_SECRET ?? '';
if (secret.length < 32) {
  throw new Error('JWT_SECRET must be configured with at least 32 characters.');
}

export function createToken(user: AuthUser): string {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ ...user, iat: now, exp: now + 60 * 60 * 12 })).toString('base64url');
  const unsigned = `${header}.${payload}`;
  const signature = createHmac('sha256', secret).update(unsigned).digest('base64url');
  return `${unsigned}.${signature}`;
}

function readToken(token: string): AuthUser | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const unsigned = `${parts[0]}.${parts[1]}`;
  const expected = createHmac('sha256', secret).update(unsigned).digest();
  const actual = Buffer.from(parts[2], 'base64url');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')) as AuthUser & { exp?: number };
    if (!payload.id || !payload.email || !payload.role || !payload.exp || payload.exp <= Date.now() / 1000) {
      return null;
    }
    return { id: payload.id, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export const authenticate: RequestHandler = (req, res, next) => {
  const authorization = req.header('authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
  const user = token ? readToken(token) : null;
  if (!user) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }
  req.authUser = user;
  next();
};

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (req.authUser?.role !== 'admin' && req.authUser?.role !== 'super_admin') {
    res.status(403).json({ error: 'Administrator access required.' });
    return;
  }
  next();
};
