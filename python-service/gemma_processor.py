import torch
from transformers import pipeline

class GemmaProcessor:
    def __init__(self):
        """Initialize the Gemma 3n pipeline for text processing."""
        self.pipeline = pipeline(
            task="text-generation",
            model="google/gemma-3n-e4b",
            device=0 if torch.cuda.is_available() else -1,
            torch_dtype=torch.bfloat16 if torch.cuda.is_available() else torch.float32
        )
    
    def process_transcription(self, transcription):
        """
        Process transcription using Gemma 3n model.
        
        Args:
            transcription (str): The transcription text to process
            
        Returns:
            str: Processed text with summary, key points, and action items
        """
        prompt = f"""Summarize the following transcription, listing the key points and any action items.

Transcription: "{transcription}"

Summary:
"""

        try:
            # Generate response using the pipeline
            response = self.pipeline(
                prompt,
                max_new_tokens=300,
                temperature=0.7,
                do_sample=True,
                pad_token_id=self.pipeline.tokenizer.eos_token_id,
                return_full_text=False
            )
            
            # Extract the generated text
            processed_text = response[0]['generated_text'].strip()
            
            return processed_text
            
        except Exception as e:
            return f"Error processing transcription with Gemma: {str(e)}"
