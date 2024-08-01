// src/jobs/emailJobs.ts
import { Queue, Worker } from 'bullmq';
import { fetchGmailEmails, fetchOutlookEmails, sendGmailResponse, sendOutlookResponse } from '../utils/emailUtils';
import { getGoogleClient, getOutlookToken } from '../services/oauthService';
import { getEmailsContextAndResponse } from '../services/aiService';
import { GmailEmail, OutlookEmail} from '../types/emailTypes'; 

const emailQueue = new Queue('emailQueue');

// Type guard for GmailEmail
function isGmailEmail(email: Email): email is GmailEmail {
  return (email as GmailEmail).payload !== undefined;
}

// Type guard for OutlookEmail
function isOutlookEmail(email: Email): email is OutlookEmail {
  return (email as OutlookEmail).body !== undefined;
}

// Create a worker to process jobs from the queue
const worker = new Worker('emailQueue', async job => {
  const googleAuth = getGoogleClient();
  const outlookAuth = await getOutlookToken('<YOUR_OUTLOOK_REFRESH_TOKEN>');

  const gmailEmails = await fetchGmailEmails(googleAuth);
  const outlookEmails = await fetchOutlookEmails(outlookAuth);

  const allEmails: Email[] = [...(gmailEmails || []), ...(outlookEmails || [])];

  for (const email of allEmails) {
    let emailBody = '';
    
    if (isGmailEmail(email)) {
      // Extract body from Gmail email
      if (email.payload?.parts && email.payload.parts.length > 0) {
        emailBody = Buffer.from(email.payload.parts[0].body.data, 'base64').toString('utf-8');
      }
    } else if (isOutlookEmail(email)) {
      // Use body content directly from Outlook email
      emailBody = email.body.content;
    }

    const response = await getEmailsContextAndResponse(emailBody);

    if (isGmailEmail(email)) {
      await sendGmailResponse(googleAuth, {
        to: email.id, // Adjust according to your needs
        subject: 'Re: Subject', // Placeholder
        body: response
      });
    } else if (isOutlookEmail(email)) {
      await sendOutlookResponse(outlookAuth, {
        to: email.from.emailAddress.address,
        subject: email.subject,
        body: response
      });
    }
  }
});

export const scheduleEmailJobs = () => {
  emailQueue.add('checkEmails', {}, { repeat: { every: 300000 } }); // every 5 minutes
};
