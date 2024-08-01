"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleEmailJobs = void 0;
// src/jobs/emailJobs.ts
const bullmq_1 = require("bullmq");
const emailUtils_1 = require("../utils/emailUtils");
const oauthService_1 = require("../services/oauthService");
const aiService_1 = require("../services/aiService");
const emailQueue = new bullmq_1.Queue('emailQueue');
// Type guard for GmailEmail
function isGmailEmail(email) {
    return email.payload !== undefined;
}
// Type guard for OutlookEmail
function isOutlookEmail(email) {
    return email.body !== undefined;
}
// Create a worker to process jobs from the queue
const worker = new bullmq_1.Worker('emailQueue', async (job) => {
    const googleAuth = (0, oauthService_1.getGoogleClient)();
    const outlookAuth = await (0, oauthService_1.getOutlookToken)('<YOUR_OUTLOOK_REFRESH_TOKEN>');
    const gmailEmails = await (0, emailUtils_1.fetchGmailEmails)(googleAuth);
    const outlookEmails = await (0, emailUtils_1.fetchOutlookEmails)(outlookAuth);
    const allEmails = [...(gmailEmails || []), ...(outlookEmails || [])];
    for (const email of allEmails) {
        let emailBody = '';
        if (isGmailEmail(email)) {
            // Extract body from Gmail email
            if (email.payload?.parts && email.payload.parts.length > 0) {
                emailBody = Buffer.from(email.payload.parts[0].body.data, 'base64').toString('utf-8');
            }
        }
        else if (isOutlookEmail(email)) {
            // Use body content directly from Outlook email
            emailBody = email.body.content;
        }
        const response = await (0, aiService_1.getEmailsContextAndResponse)(emailBody);
        if (isGmailEmail(email)) {
            await (0, emailUtils_1.sendGmailResponse)(googleAuth, {
                to: email.id, // Adjust according to your needs
                subject: 'Re: Subject', // Placeholder
                body: response
            });
        }
        else if (isOutlookEmail(email)) {
            await (0, emailUtils_1.sendOutlookResponse)(outlookAuth, {
                to: email.from.emailAddress.address,
                subject: email.subject,
                body: response
            });
        }
    }
});
const scheduleEmailJobs = () => {
    emailQueue.add('checkEmails', {}, { repeat: { every: 300000 } }); // every 5 minutes
};
exports.scheduleEmailJobs = scheduleEmailJobs;
