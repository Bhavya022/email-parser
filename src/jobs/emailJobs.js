"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleEmailJobs = void 0;
const bullmq_1 = require("bullmq");
const emailUtils_1 = require("../utils/emailUtils");
const oauthService_1 = require("../services/oauthService");
const aiService_1 = require("../services/aiService");
const emailQueue = new bullmq_1.Queue('emailQueue');
emailQueue.process('checkEmails', () => __awaiter(void 0, void 0, void 0, function* () {
    const googleClient = (0, oauthService_1.getGoogleClient)();
    const googleAuth = googleClient.credentials;
    // Obtain Outlook access token appropriately here
    const outlookAuth = yield (0, oauthService_1.getOutlookToken)('<YOUR_OUTLOOK_REFRESH_TOKEN>');
    const gmailEmails = yield (0, emailUtils_1.fetchGmailEmails)(googleAuth);
    const outlookEmails = yield (0, emailUtils_1.fetchOutlookEmails)(outlookAuth);
    const allEmails = [...(gmailEmails || []), ...(outlookEmails || [])];
    for (const email of allEmails) {
        const response = yield (0, aiService_1.getEmailsContextAndResponse)(email);
        if (email.provider === 'gmail') {
            yield (0, emailUtils_1.sendGmailResponse)(googleAuth, { to: email.from, subject: email.subject, body: response });
        }
        else {
            yield (0, emailUtils_1.sendOutlookResponse)(outlookAuth, { to: email.from, subject: email.subject, body: response });
        }
    }
}));
const scheduleEmailJobs = () => {
    emailQueue.add('checkEmails', {}, { repeat: { every: 300000 } }); // every 5 minutes
};
exports.scheduleEmailJobs = scheduleEmailJobs;
