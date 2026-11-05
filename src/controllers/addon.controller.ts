import type { RequestHandler } from 'express';
import * as catalog from '../services/catalog.service.js';
import { pathParam, uuid } from '../validators/common.validator.js';
import { addonSchema } from '../validators/addon.validator.js';

export const createAddon: RequestHandler = async (req, res) => {
  res.status(201).json(await catalog.saveAddon(addonSchema.parse(req.body)));
};

export const updateAddon: RequestHandler = async (req, res) => {
  const id = uuid.parse(pathParam(req.params.id));
  res.json(await catalog.saveAddon(addonSchema.parse(req.body), id));
};

export const deleteAddon: RequestHandler = async (req, res) => {
  await catalog.deleteAddon(uuid.parse(pathParam(req.params.id)));
  res.status(204).end();
};
