import { startRecording } from './recorder.js';
import { transcribeAudio } from './transcriber.js';

async function main() {
  try {
    const audioData = await startRecording(); // Now returns audio data directly

    // Log audio size and approximate duration
    const audioSize = audioData.length; // Size in bytes
    const audioDuration = audioSize / (2 * 16000); // Duration in seconds

    let humanReadableSize;
    if (audioSize >= 1024 * 1024) {
      humanReadableSize = `${(audioSize / (1024 * 1024)).toFixed(2)} MB`;
    } else if (audioSize >= 1024) {
      humanReadableSize = `${(audioSize / 1024).toFixed(2)} KB`;
    } else {
      humanReadableSize = `${audioSize} bytes`;
    }

    console.log(`Audio recorded: Size = ${humanReadableSize}, Duration = ${audioDuration.toFixed(2)} seconds`);

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
