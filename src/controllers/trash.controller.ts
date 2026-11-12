import type { RequestHandler } from 'express';
import { z } from 'zod';
import { pathParam } from '../validators/common.validator.js';
import { trashEntityTypes } from '../models/trash.model.js';
import * as trash from '../services/trash.service.js';

const trashEntitySchema = z.enum(trashEntityTypes);

export const listTrash: RequestHandler = async (_req, res) => {
  res.json(await trash.listTrash());
};

export const restoreTrashItem: RequestHandler = async (req, res) => {
  const type = trashEntitySchema.parse(pathParam(req.params.type));
  const id = pathParam(req.params.id);
  await trash.restoreTrashItem(type, id);
  res.status(204).end();
};

export const permanentlyDeleteTrashItem: RequestHandler = async (req, res) => {
  const type = trashEntitySchema.parse(pathParam(req.params.type));
  const id = pathParam(req.params.id);
  await trash.permanentlyDeleteTrashItem(type, id);
  res.status(204).end();
};
