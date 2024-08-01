// src/utils/emailUtils.ts
import { google } from 'googleapis';
import { GmailEmail, OutlookEmail } from '../types/emailTypes'; // Correct path

export const fetchGmailEmails = async (auth: any): Promise<GmailEmail[]> => {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.list({ userId: 'me' });
  
  return res.data.messages ? res.data.messages.map(message => ({
    id: message.id || '',
    threadId: message.threadId || '',
    snippet: '', // Gmail API does not provide snippet in this call, you'll need another API call to get this
    payload: {} // Add this if you need payload information
  })) : [];
};

export const fetchOutlookEmails = async (accessToken: string): Promise<OutlookEmail[]> => {
  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });

  const res = await client.api('/me/messages').get();
  return res.value;
};

export const sendGmailResponse = async (auth: any, message: { to: string; subject: string; body: string }) => {
  const gmail = google.gmail({ version: 'v1', auth });
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

export const sendOutlookResponse = async (accessToken: string, message: { to: string; subject: string; body: string }) => {
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
