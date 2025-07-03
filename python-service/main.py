from flask import Flask, request, jsonify
import torch
import os
import soundfile as sf
from gemma_processor import GemmaProcessor
from gemma_transcriber import GemmaTranscriber

app = Flask(__name__)

# --- Device Selection ---
def get_device():
    if torch.cuda.is_available():
        return "cuda"
    if torch.backends.mps.is_available():
        return "mps"
    return "cpu"

DEVICE = get_device()
print(f"Using device: {DEVICE}")

# --- Gemma Processor and Transcriber ---
gemma_processor = GemmaProcessor()
gemma_transcriber = GemmaTranscriber()

@app.route('/transcribe-and-process', methods=['POST'])
def transcribe_and_process():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']

    import tempfile
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
        audio_file.save(tmp_file.name)
        temp_audio_path = tmp_file.name

    try:
        # Transcribe the audio file
        transcription = gemma_transcriber.transcribe(temp_audio_path)
        print(f"Transcription result: {transcription}") # Added logging
        if "Error" in transcription:
             raise Exception(transcription)

        # Process the transcription
        processed_text = gemma_processor.process_transcription(transcription)
        print(f"Processed text result: {processed_text}") # Added logging

    except Exception as e:
        os.remove(temp_audio_path)
        return jsonify({'error': f'Error processing audio: {e}'}), 500
    finally:
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)

    return jsonify({'processed_text': processed_text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True, use_reloader=False)