import { startRecording } from './recorder.js';
import { transcribeAudio } from './transcriber.js';
import { transcriptPath } from './utils.js';
import fs from 'fs';

async function main() {
  try {
    const audioPath = await startRecording();
    const transcription = await transcribeAudio(audioPath);
    if (transcription) {
      fs.writeFileSync(transcriptPath, transcription, 'utf8');
      console.log('Transcription saved to', transcriptPath);
    }
    process.exit(0);
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}

main();
