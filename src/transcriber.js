import { pipeline } from '@huggingface/transformers';
import fs from 'fs';
import pkg from 'wavefile';
const { WaveFile } = pkg;

export async function transcribeAudio(audioPath) {
  try {
    console.log('Transcribing audio...');
    const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');

    const wavFileData = fs.readFileSync(audioPath);
    const wav = new WaveFile(wavFileData);
    wav.toBitDepth('32f');
    wav.toSampleRate(16000);
    let audioData = wav.getSamples();
    if (Array.isArray(audioData)) {
      if (audioData.length > 1) {
        const SCALING_FACTOR = Math.sqrt(2);
        let mono = new Float32Array(audioData[0].length);
        for (let i = 0; i < audioData[0].length; ++i) {
          mono[i] = SCALING_FACTOR * (audioData[0][i] + audioData[1][i]) / 2;
        }
        audioData = mono;
      } else {
        audioData = audioData[0];
      }
    }

    const output = await transcriber(audioData);

    if (output && output.text) {
      return output.text;
    } else {
      console.error('Unexpected response:', output);
      return null;
    }
  } catch (err) {
    console.error('Transcription error:', err);
    throw err;
  }
}
