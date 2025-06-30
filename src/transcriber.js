import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export async function transcribeAudio(audioPath) {
  try {
    console.log('Sending audio to Python service for transcription...');

    // Create a form and append the audio file
    const form = new FormData();
    form.append('audio', fs.createReadStream(audioPath));

    // Send the request to the Python service
    const response = await fetch('http://localhost:5001/transcribe', {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.transcription) {
      return data.transcription;
    } else {
      console.error('Unexpected response from Python service:', data);
      return null;
    }
  } catch (err) {
    console.error('Error communicating with Python service:', err);
    throw err;
  }
}
