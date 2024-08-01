// src/services/oauthService.ts
import { google } from 'googleapis';
import * as msal from '@azure/msal-node';
import dotenv from 'dotenv';

dotenv.config();

// Google OAuth
const googleOAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/auth/google/callback'
);

export const getGoogleAuthUrl = (): string => {
  const authUrl = googleOAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  });
  return authUrl;
};

export const getGoogleToken = async (code: string): Promise<any> => {
  const { tokens } = await googleOAuth2Client.getToken(code);
  googleOAuth2Client.setCredentials(tokens);
  return tokens;
};

export const getGoogleClient = (): any => {
  return googleOAuth2Client;
};

// Outlook OAuth
const msalConfig = {
  auth: {
    clientId: process.env.OUTLOOK_CLIENT_ID!,
    authority: 'https://login.microsoftonline.com/common',
    clientSecret: process.env.OUTLOOK_CLIENT_SECRET!,
  },
};

const pca = new msal.ConfidentialClientApplication(msalConfig);

export const getOutlookAuthUrl = async (): Promise<string> => {
  const authCodeUrlParameters = {
    scopes: ['https://graph.microsoft.com/.default'],
    redirectUri: 'http://localhost:3000/auth/outlook/callback',
  };
  const response = await pca.getAuthCodeUrl(authCodeUrlParameters);
  return response;
};

export const getOutlookToken = async (code: string): Promise<string> => {
  const tokenRequest = {
    code,
    scopes: ['https://graph.microsoft.com/.default'],
    redirectUri: 'http://localhost:3000/auth/outlook/callback',
  };
  const response = await pca.acquireTokenByCode(tokenRequest);
  return response.accessToken!;
};
