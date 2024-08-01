"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOutlookToken = exports.getOutlookAuthUrl = exports.getGoogleClient = exports.getGoogleToken = exports.getGoogleAuthUrl = void 0;
// src/services/oauthService.ts
const googleapis_1 = require("googleapis");
const msal = __importStar(require("@azure/msal-node"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Google OAuth
const googleOAuth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'http://localhost:3000/auth/google/callback');
const getGoogleAuthUrl = () => {
    const authUrl = googleOAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.readonly'],
    });
    return authUrl;
};
exports.getGoogleAuthUrl = getGoogleAuthUrl;
const getGoogleToken = async (code) => {
    const { tokens } = await googleOAuth2Client.getToken(code);
    googleOAuth2Client.setCredentials(tokens);
    return tokens;
};
exports.getGoogleToken = getGoogleToken;
const getGoogleClient = () => {
    return googleOAuth2Client;
};
exports.getGoogleClient = getGoogleClient;
// Outlook OAuth
const msalConfig = {
    auth: {
        clientId: process.env.OUTLOOK_CLIENT_ID,
        authority: 'https://login.microsoftonline.com/common',
        clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
    },
};
const pca = new msal.ConfidentialClientApplication(msalConfig);
const getOutlookAuthUrl = async () => {
    const authCodeUrlParameters = {
        scopes: ['https://graph.microsoft.com/.default'],
        redirectUri: 'http://localhost:3000/auth/outlook/callback',
    };
    const response = await pca.getAuthCodeUrl(authCodeUrlParameters);
    return response;
};
exports.getOutlookAuthUrl = getOutlookAuthUrl;
const getOutlookToken = async (code) => {
    const tokenRequest = {
        code,
        scopes: ['https://graph.microsoft.com/.default'],
        redirectUri: 'http://localhost:3000/auth/outlook/callback',
    };
    const response = await pca.acquireTokenByCode(tokenRequest);
    return response.accessToken;
};
exports.getOutlookToken = getOutlookToken;
