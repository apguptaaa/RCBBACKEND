import type { RequestHandler } from 'express';
import * as catalog from '../services/catalog.service.js';

export const getPublicCatalog: RequestHandler = async (_req, res) => {
  res.json(await catalog.getCatalog());
};

export const getAdminCatalog: RequestHandler = async (_req, res) => {
  res.json(await catalog.getCatalog(true));
};
