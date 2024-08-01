"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    outlookClientId: process.env.OUTLOOK_CLIENT_ID,
    outlookClientSecret: process.env.OUTLOOK_CLIENT_SECRET,
    openAiApiKey: process.env.OPENAI_API_KEY,
    port: process.env.PORT,
};
