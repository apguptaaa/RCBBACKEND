import type { RequestHandler } from 'express';
import * as catalog from '../services/catalog.service.js';
import { pathParam, uuid } from '../validators/common.validator.js';
import { bannerSchema } from '../validators/banner.validator.js';

export const createBanner: RequestHandler = async (req, res) => {
  res.status(201).json(await catalog.saveBanner(bannerSchema.parse(req.body)));
};

export const updateBanner: RequestHandler = async (req, res) => {
  const id = uuid.parse(pathParam(req.params.id));
  res.json(await catalog.saveBanner(bannerSchema.parse(req.body), id));
};

export const deleteBanner: RequestHandler = async (req, res) => {
  await catalog.deleteBanner(uuid.parse(pathParam(req.params.id)));
  res.status(204).end();
};
