
import fetch from 'node-fetch';

export async function processTranscription(audioData) {
  try {
    console.log('Sending audio to local LLM for transcription and processing...');

    const formData = new FormData();
    formData.append('audio', new Blob([audioData], { type: 'audio/wav' }), 'audio.wav');

    const response = await fetch('http://localhost:5001/transcribe-and-process', {
      method: 'POST',
      body: formData,
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
