# Gemma Audio Transcriber

This project records audio from your microphone, transcribes it using Hugging Face's Transformers.js, and saves the transcription to a text file.

## Project Structure

-   `src/main.js`: The main entry point of the application.
-   `src/recorder.js`: Handles the audio recording functionality.
-   `src/transcriber.js`: Handles the audio transcription functionality.
-   `src/utils.js`: Contains utility functions and constants.
-   `package.json`: Defines the project's dependencies and scripts.

## Installation

1.  Install Node.js: [https://nodejs.org/](https://nodejs.org/)
2.  Clone the repository: `git clone <repository-url>`
3.  Install dependencies: `npm install`

## Usage

To start the application, run the following command:

```bash
npm start
```

The application will start recording audio from your microphone. Speak into your microphone, and the application will automatically detect silence and stop recording. You can also press `Enter` to stop the recording manually.

The recorded audio will be saved as `recording.wav` on your desktop, and the transcription will be saved as `transcript.txt` on your desktop.