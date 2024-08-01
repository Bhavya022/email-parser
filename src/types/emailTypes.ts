// src/types/emailTypes.ts
export type GmailEmail = {
    id: string;
    threadId: string;
    snippet: string; // Adjust according to Gmail API response
    payload?: {
      parts?: Array<{ body: { data: string } }>;
    };
  };
  
  export type OutlookEmail = {
    id: string;
    subject: string;
    from: { emailAddress: { address: string } };
    body: { content: string; contentType: string };
  };
  
  export type Email = GmailEmail | OutlookEmail;
  