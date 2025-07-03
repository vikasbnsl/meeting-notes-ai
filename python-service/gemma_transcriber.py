import torch
from transformers import pipeline
import soundfile as sf

class GemmaTranscriber:
    def __init__(self):
        """Initialize the audio transcription pipeline using Whisper."""
        # Use Whisper for reliable audio transcription
        device = "mps" if torch.backends.mps.is_available() else "cpu"
        self.pipeline = pipeline(
            "automatic-speech-recognition",
            model="openai/whisper-base",
            device=device
        )

    def transcribe(self, audio_path):
        """
        Transcribe audio using Whisper model.

        Args:
            audio_path (str): The path to the audio file to transcribe.

        Returns:
            str: The transcribed text.
        """
        try:
            # Use Whisper pipeline for transcription
            result = self.pipeline(audio_path)
            return result["text"].strip()

        except Exception as e:
            return f"Error transcribing with Whisper: {str(e)}"