"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOutlookResponse = exports.sendGmailResponse = exports.fetchOutlookEmails = exports.fetchGmailEmails = void 0;
// src/utils/emailUtils.ts
const googleapis_1 = require("googleapis");
const fetchGmailEmails = async (auth) => {
    const gmail = googleapis_1.google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.list({ userId: 'me' });
    return res.data.messages ? res.data.messages.map(message => ({
        id: message.id || '',
        threadId: message.threadId || '',
        snippet: '', // Gmail API does not provide snippet in this call, you'll need another API call to get this
        payload: {} // Add this if you need payload information
    })) : [];
};
exports.fetchGmailEmails = fetchGmailEmails;
const fetchOutlookEmails = async (accessToken) => {
    const client = Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        },
    });
    const res = await client.api('/me/messages').get();
    return res.value;
};
exports.fetchOutlookEmails = fetchOutlookEmails;
const sendGmailResponse = async (auth, message) => {
    const gmail = googleapis_1.google.gmail({ version: 'v1', auth });
    const email = [
        `To: ${message.to}`,
        'Content-Type: text/html; charset=UTF-8',
        'MIME-Version: 1.0',
        `Subject: ${message.subject}`,
        '',
        message.body,
    ].join('\n');
    const base64EncodedEmail = Buffer.from(email).toString('base64');
    await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: base64EncodedEmail,
        },
    });
};
exports.sendGmailResponse = sendGmailResponse;
const sendOutlookResponse = async (accessToken, message) => {
    const client = Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        },
    });
    await client.api('/me/sendMail').post({
        message: {
            subject: message.subject,
            body: {
                contentType: 'HTML',
                content: message.body,
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: message.to,
                    },
                },
            ],
        },
    });
};
exports.sendOutlookResponse = sendOutlookResponse;
