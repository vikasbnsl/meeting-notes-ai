import { pipeline } from '@huggingface/transformers';
import record from 'node-record-lpcm16';
import fs from 'fs';
import path from 'path';
import os from 'os';
import wav from 'wav';
import readline from 'readline';
import pkg from 'wavefile';
const { WaveFile } = pkg;

const desktopPath = path.join(os.homedir(), 'Desktop');
const wavPath = path.join(desktopPath, 'recording.wav');
const transcriptPath = path.join(desktopPath, 'transcript.txt');

// Silence detection config
const SILENCE_DURATION_MS = 2000; // 2 seconds
let silenceTimeout;
let recordingStopped = false;

console.log('Recording... Speak into your microphone.');
console.log('Press Enter to stop recording.');

// Setup readline for Enter key
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.on('line', () => {
  console.log('Enter pressed. Stopping recording.');
  stopRecording();
  rl.close();
});

const fileWriter = new wav.FileWriter(wavPath, {
  channels: 1,
  sampleRate: 16000,
  bitDepth: 16,
});

const recordingProcess = record.record({
  sampleRate: 16000,
  threshold: 0,
  silence: '1.0', // Not used by node-record-lpcm16, so we implement our own
  verbose: false,
});

let fileWriterEnded = false;

function handleMicData(chunk) {
  if (!fileWriterEnded) {
    fileWriter.write(chunk);
    resetSilenceTimeout();
  }
}

const mic = recordingProcess.stream()
  .on('data', handleMicData)
  .on('error', (err) => {
    // Only log errors if we haven't intentionally stopped recording
    if (!recordingStopped) {
      console.error('Recording error:', err);
      cleanupAndExit(1);
    }
    // Otherwise, ignore error (e.g., sox killed by user)
  });

function resetSilenceTimeout() {
  if (silenceTimeout) clearTimeout(silenceTimeout);
  silenceTimeout = setTimeout(() => {
    console.log('Silence detected. Stopping recording.');
    stopRecording();
  }, SILENCE_DURATION_MS);
}

function stopRecording() {
  if (recordingStopped) return;
  recordingStopped = true;

  mic.removeListener('data', handleMicData);
  mic.destroy && mic.destroy();
  fileWriterEnded = true;
  fileWriter.end(() => {
    console.log('Saved recording to', wavPath);
    sendForTranscription();
  });
  recordingProcess.stop();
  if (silenceTimeout) clearTimeout(silenceTimeout);
}

function cleanupAndExit(code = 0) {
  try { fileWriter.end(); } catch (e) {}
  process.exit(code);
}

process.on('SIGINT', () => {
  console.log('\nCtrl+C detected. Stopping recording.');
  stopRecording();
});

// Start silence timeout
resetSilenceTimeout();

async function sendForTranscription() {
  try {
    console.log('Transcribing audio...');
    const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
    
    const wavFileData = fs.readFileSync(wavPath);
    const wav = new WaveFile(wavFileData);
    wav.toBitDepth('32f'); // convert to 32-bit float
    wav.toSampleRate(16000); // convert to 16kHz
    let audioData = wav.getSamples();
    if (Array.isArray(audioData)) {
      if (audioData.length > 1) {
        const SCALING_FACTOR = Math.sqrt(2);

        // Merge channels into a single channel (mono)
        let mono = new Float32Array(audioData[0].length);
        for (let i = 0; i < audioData[0].length; ++i) {
          mono[i] = SCALING_FACTOR * (audioData[0][i] + audioData[1][i]) / 2;
        }
        audioData = mono;
      }
      else {
        audioData = audioData[0];
      }
    }

    const output = await transcriber(audioData);

    if (output && output.text) {
      fs.writeFileSync(transcriptPath, output.text, 'utf8');
      console.log('Transcription saved to', transcriptPath);
    } else {
      console.error('Unexpected response:', output);
    }
  } catch (err) {
    console.error('Transcription error:', err);
  }
}


// Graceful exit
process.on('exit', (code) => {
  console.log(`Exiting with code ${code}`);
});
