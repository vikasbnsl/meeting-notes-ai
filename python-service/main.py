from flask import Flask, request, jsonify
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import torch
import os
import soundfile as sf
import numpy as np # Keep numpy for potential future use, though less critical now

app = Flask(__name__)

# --- Model Loading ---
# Important: You need to download the Gemma model to a local directory.
# For example, you can clone it from Hugging Face:
# git lfs install
# git clone https://huggingface.co/google/gemma-3n-e4b-it path/to/your/local/model

# Update this path to where you've stored the model
MODEL_PATH = "openai/whisper-small"

# Load the processor and model
processor = WhisperProcessor.from_pretrained(MODEL_PATH)
model = WhisperForConditionalGeneration.from_pretrained(MODEL_PATH).to("cuda" if torch.cuda.is_available() else "cpu")

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']

    # Save the audio file to a temporary location
    import tempfile
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
        audio_file.save(tmp_file.name)
        temp_audio_path = tmp_file.name

    # Load audio using soundfile and process with WhisperProcessor
    try:
        audio_input, sample_rate = sf.read(temp_audio_path)
        # Whisper expects 16kHz mono audio, processor handles resampling if needed
        input_features = processor(audio_input, sampling_rate=sample_rate, return_tensors="pt").input_features

    except Exception as e:
        os.remove(temp_audio_path)
        return jsonify({'error': f'Error processing audio: {e}'}), 500

    # --- Generate Transcription ---
    with torch.inference_mode():
        predicted_ids = model.generate(input_features.to(model.device), language='en', task='transcribe')

    # Decode the output
    transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

    # Clean up the temporary audio file
    os.remove(temp_audio_path)

    return jsonify({'transcription': transcription})

if __name__ == '__main__':
    # Note: For production, use a proper WSGI server like Gunicorn or uWSGI
    app.run(host='0.0.0.0', port=5001, debug=True)
