# LLM Audio Transcriber

This project provides a simple audio transcription service using a local Python Flask server powered by the Hugging Face `transformers` library, and a Node.js client for recording and sending audio.

## Features

- Records audio from your microphone.
- Sends audio to a local Python service for transcription.
- Uses the `openai/whisper-large-v3` model for high-accuracy, multilingual (English and Hindi) speech-to-text transcription.
- Displays transcription directly in the console.

## Setup and Installation

Follow these steps to set up and run the project:

### 1. Clone the Repository (if you haven't already)

```bash
git clone <repository_url>
cd gemma-audio
```

### 2. Download the Whisper Model

The Python service uses the `openai/whisper-large-v3` model. You need to download it from Hugging Face. This model is large (around 3GB) and requires significant RAM/VRAM.

```bash
git lfs install
git clone https://huggingface.co/openai/whisper-large-v3 python-service/models/whisper-large-v3
```

### 3. Set up the Python Transcription Service

Navigate to the `python-service` directory and set up a virtual environment.

```bash
cd python-service
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
```

**Important:** Ensure the `MODEL_PATH` in `python-service/main.py` is correctly set to the path where you cloned the Whisper model (e.g., `MODEL_PATH = "./models/whisper-large-v3"`).

### 4. Set up the Node.js Client

Navigate back to the root directory of the project and install Node.js dependencies.

```bash
cd ..
npm install
```

## Running the Application

### 1. Start the Python Transcription Service

Open a new terminal, navigate to the project root, and start the Python Flask server. This server must be running for the Node.js client to work.

```bash
python-service/venv/bin/python3 python-service/main.py
```

### 2. Start the Node.js Client

Open another terminal, navigate to the project root, and run the Node.js client.

```bash
npm start
```

Follow the prompts in the Node.js client terminal to record audio. The transcription will be displayed directly in the console.

## Troubleshooting

- **`ECONNREFUSED` error:** Ensure the Python service is running before starting the Node.js client.
- **Missing Python modules:** Make sure you've activated the virtual environment and installed all dependencies using `pip install -r requirements.txt`.
- **Model loading errors:** Verify that `MODEL_PATH` in `python-service/main.py` points to the correct local path of the downloaded Whisper model.
- **Transcription accuracy:** The `whisper-large-v3` model is highly capable. Ensure clear audio input for best results. For multilingual transcription, the model automatically detects the language.
