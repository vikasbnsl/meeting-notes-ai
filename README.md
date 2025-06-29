# Gemma Audio Transcriber

This Node.js app records audio from your microphone, saves it as `recording.wav` on your Desktop, sends it to a local transcription API, and writes the transcription to `transcript.txt` on your Desktop.

## Features
- Records from the default microphone (macOS & Linux supported)
- Stops after 1 second of silence or on Ctrl+C
- Saves raw audio as WAV
- Sends the audio to `http://localhost:11434/transcribe` with `model=gemma3n`
- Writes the transcription result to your Desktop

## Usage

1. Install dependencies:

    ```sh
    npm install
    ```

2. Run the app:

    ```sh
    node record_and_transcribe.js
    ```

3. Speak into your microphone. Recording stops after 1 second of silence or when you press Ctrl+C.

4. The files `recording.wav` and `transcript.txt` will appear on your Desktop.

---

**Dependencies:**
- node-record-lpcm16
- wav
- axios
- form-data

**Note:** Requires a transcription server running at `http://localhost:11434/transcribe` that accepts `multipart/form-data` with a `file` and `model` field.
