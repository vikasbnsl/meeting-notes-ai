# LLM Audio Transcriber

This project provides a simple audio transcription service using a local Python Flask server powered by the Hugging Face `transformers` library, and a Node.js client for recording and sending audio.

## Features

- Records audio from your microphone.
- Sends audio to a local Python service for transcription.
- Uses the `openai/whisper-large-v3` model for high-accuracy, multilingual (English and Hindi) speech-to-text transcription.
- Uses a local `mistralai/Mistral-7B-Instruct-v0.2` model to generate a summary, action items, and follow-ups from the transcription.
- Displays transcription and processed text directly in the console.

## Prerequisites

Before you begin, ensure you have the following installed on your system.

### For macOS users (using [Homebrew](https://brew.sh/)):

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install prerequisites
brew install git git-lfs node python
```

### For other operating systems (Linux/Windows):

- **Git:** [Install Git](https://git-scm.com/downloads)
- **Git LFS:** [Install Git LFS](https://git-lfs.github.com/)
- **Node.js:** [Install Node.js](https://nodejs.org/en/download/) (LTS version recommended)
- **Python:** [Install Python](https://www.python.org/downloads/) (version 3.9 or higher recommended)

## Setup and Installation

Follow these steps to set up and run the project:

### 1. Clone the Repository

```bash
git clone https://github.com/vikasbnsl/llm-audio-transcriber.git
cd llm-audio-transcriber
```

### 2. Download the Models

The Python service uses the `openai/whisper-large-v3` and `mistralai/Mistral-7B-Instruct-v0.2` models. You need to download them from Hugging Face. These models are large and require significant RAM/VRAM.

```bash
git lfs install
git clone https://huggingface.co/openai/whisper-large-v3 python-service/models/whisper-large-v3
git clone https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2 python-service/models/Mistral-7B-Instruct-v0.2
```

### 3. Set up the Python Transcription Service

Navigate to the `python-service` directory and set up a virtual environment.

```bash
cd python-service
python3 -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```

**Important:** Ensure the model paths in `python-service/main.py` are correctly set to the paths where you cloned the models.

### 4. Set up the Node.js Client

Navigate back to the root directory of the project and install Node.js dependencies.

```bash
cd ..
npm install
```

## Running the Application

### 1. Start the Python Transcription Service

Open a new terminal, navigate to the `python-service` directory, activate the virtual environment, and start the Python Flask server. This server must be running for the Node.js client to work. The application will automatically detect and use your MacBook's GPU for significantly faster performance.

```bash
cd python-service
source venv/bin/activate # On Windows use `venv\Scripts\activate`
python main.py
```

### 2. Start the Node.js Client

Open another terminal, navigate to the project root, and run the Node.js client.

```bash
npm start
```

Follow the prompts in the Node.js client terminal to record audio. The transcription and processed text will be displayed directly in the console.

## Troubleshooting

- **`ECONNREFUSED` error:** Ensure the Python service is running before starting the Node.js client.
- **Missing Python modules:** Make sure you've activated the virtual environment and installed all dependencies using `pip install -r requirements.txt`.
- **Model loading errors:** Verify that the model paths in `python-service/main.py` point to the correct local paths of the downloaded models.
- **Transcription accuracy:** The `whisper-large-v3` model is highly capable. Ensure clear audio input for best results. For multilingual transcription, the model automatically detects the language.
- **`git-lfs` not found:** Ensure you have installed Git LFS and run `git lfs install` before cloning the model repositories.
