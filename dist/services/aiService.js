"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailsContextAndResponse = void 0;
// src/services/aiService.ts
const axios_1 = __importDefault(require("axios"));
const getEmailsContextAndResponse = async (emailContent) => {
    const response = await axios_1.default.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: `Categorize and respond to the following email:\n\n${emailContent}`,
        max_tokens: 100,
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data.choices[0].text.trim();
};
exports.getEmailsContextAndResponse = getEmailsContextAndResponse;
