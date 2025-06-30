import { startRecording } from './recorder.js';
import { transcribeAudio } from './transcriber.js';

async function main() {
  try {
    const audioData = await startRecording(); // Now returns audio data directly
    const transcription = await transcribeAudio(audioData);
    if (transcription) {
      console.log('Transcription:', transcription);
    }
    process.exit(0);
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}

main();
