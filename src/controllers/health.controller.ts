import type { RequestHandler } from 'express';
import { prisma } from '../db/client.js';

const getHealth: RequestHandler = async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: 'ok', database: 'connected' });
};

export { getHealth };
