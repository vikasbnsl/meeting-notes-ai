import record from 'node-record-lpcm16';
import readline from 'readline';

const SILENCE_DURATION_MS = 2000; // 2 seconds
let silenceTimeout;
let recordingStopped = false;
let audioBufferChunks = [];

export function startRecording() {
  return new Promise((resolve, reject) => {
    console.log('Recording... Speak into your microphone.');
    console.log('Press Enter to stop recording.');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.on('line', () => {
      console.log('Enter pressed. Stopping recording.');
      stopRecording();
      rl.close();
    });

    const recordingProcess = record.record({
      sampleRate: 16000,
      threshold: 0,
      silence: '1.0',
      verbose: false,
    });

    function handleMicData(chunk) {
      audioBufferChunks.push(chunk);
      resetSilenceTimeout();
    }

    const mic = recordingProcess.stream()
      .on('data', handleMicData)
      .on('error', (err) => {
        if (!recordingStopped) {
          console.error('Recording error:', err);
          reject(err);
        }
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
      recordingProcess.stop();
      if (silenceTimeout) clearTimeout(silenceTimeout);

      const fullAudioBuffer = Buffer.concat(audioBufferChunks);
      audioBufferChunks = []; // Clear chunks for next recording
      resolve(fullAudioBuffer);
    }

    process.on('SIGINT', () => {
      console.log('\nCtrl+C detected. Stopping recording.');
      stopRecording();
    });

    resetSilenceTimeout();
  });
}
