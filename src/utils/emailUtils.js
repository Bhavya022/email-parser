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
exports.sendOutlookResponse = exports.sendGmailResponse = exports.fetchOutlookEmails = exports.fetchGmailEmails = void 0;
const googleapis_1 = require("googleapis");
const microsoft_graph_client_1 = require("@microsoft/microsoft-graph-client");
const fetchGmailEmails = (auth) => __awaiter(void 0, void 0, void 0, function* () {
    const gmail = googleapis_1.google.gmail({ version: 'v1', auth });
    const res = yield gmail.users.messages.list({ userId: 'me' });
    return res.data.messages;
});
exports.fetchGmailEmails = fetchGmailEmails;
const fetchOutlookEmails = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const client = microsoft_graph_client_1.Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        },
    });
    const res = yield client.api('/me/messages').get();
    return res.value;
});
exports.fetchOutlookEmails = fetchOutlookEmails;
const sendGmailResponse = (auth, message) => __awaiter(void 0, void 0, void 0, function* () {
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
    yield gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: base64EncodedEmail,
        },
    });
});
exports.sendGmailResponse = sendGmailResponse;
const sendOutlookResponse = (accessToken, message) => __awaiter(void 0, void 0, void 0, function* () {
    const client = microsoft_graph_client_1.Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        },
    });
    yield client.api('/me/sendMail').post({
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
});
exports.sendOutlookResponse = sendOutlookResponse;
