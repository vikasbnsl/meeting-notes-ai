
import fetch from 'node-fetch';

export async function processTranscription(transcription) {
  try {
    console.log('Sending transcription to local LLM for processing...');

    const response = await fetch('http://localhost:5001/process-transcription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transcription }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.processed_text) {
      return data.processed_text;
    } else {
      console.error('Unexpected response from local LLM service:', data);
      return null;
    }
  } catch (err) {
    console.error('Error communicating with local LLM service:', err);
    throw err;
  }
}
