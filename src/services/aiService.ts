// src/services/aiService.ts
import axios from 'axios';

export const getEmailsContextAndResponse = async (emailContent: string): Promise<string> => {
  const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
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
