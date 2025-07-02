from flask import Flask, request, jsonify
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import torch
import os
import soundfile as sf
from gemma_processor import GemmaProcessor

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

# --- Whisper Model Loading ---
WHISPER_MODEL_PATH = "openai/whisper-large-v3"
whisper_processor = WhisperProcessor.from_pretrained(WHISPER_MODEL_PATH)
whisper_model = WhisperForConditionalGeneration.from_pretrained(WHISPER_MODEL_PATH).to(DEVICE)

# --- Gemma Processor ---
gemma_processor = GemmaProcessor()

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']

    import tempfile
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
        audio_file.save(tmp_file.name)
        temp_audio_path = tmp_file.name

    try:
        audio_input, sample_rate = sf.read(temp_audio_path)
        input_features = whisper_processor(audio_input, sampling_rate=sample_rate, return_tensors="pt").input_features

    except Exception as e:
        os.remove(temp_audio_path)
        return jsonify({'error': f'Error processing audio: {e}'}), 500

    with torch.inference_mode():
        predicted_ids = whisper_model.generate(input_features.to(whisper_model.device), task='transcribe')

    transcription = whisper_processor.batch_decode(predicted_ids, skip_special_tokens=True)[0].strip()

    os.remove(temp_audio_path)

    return jsonify({'transcription': transcription})

@app.route('/process-transcription', methods=['POST'])
def process_transcription():
    data = request.get_json()
    if not data or 'transcription' not in data:
        return jsonify({'error': 'No transcription provided'}), 400

    transcription = data['transcription']
    
    processed_text = gemma_processor.process_transcription(transcription)

    return jsonify({'processed_text': processed_text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True, use_reloader=False)