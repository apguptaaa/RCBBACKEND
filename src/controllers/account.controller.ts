import type { RequestHandler } from 'express';
import * as account from '../services/account.service.js';
import { cartSchema, favoritesSchema } from '../validators/account.validator.js';

export const getCart: RequestHandler = async (req, res) => {
  res.json(await account.getCart(req.authUser!.id));
};

export const saveCart: RequestHandler = async (req, res) => {
  res.json(await account.saveCart(req.authUser!.id, cartSchema.parse(req.body)));
};

export const getFavorites: RequestHandler = async (req, res) => {
  res.json(await account.getFavorites(req.authUser!.id));
};

export const saveFavorites: RequestHandler = async (req, res) => {
  const { product_ids } = favoritesSchema.parse(req.body);
  res.json(await account.saveFavorites(req.authUser!.id, product_ids));
};
