// src/controllers/emailController.ts
import { Request, Response } from 'express';
import { getGoogleAuthUrl, getGoogleToken, getOutlookAuthUrl, getOutlookToken } from '../services/oauthService';

export const googleAuth = (req: Request, res: Response) => {
  const url = getGoogleAuthUrl();
  res.redirect(url);
};

export const googleCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  const tokens = await getGoogleToken(code as string);
  res.json(tokens);
};

export const outlookAuth = async (req: Request, res: Response) => {
  const url = await getOutlookAuthUrl();
  res.redirect(url);
};

export const outlookCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  const token = await getOutlookToken(code as string);
  res.json(token);
};
