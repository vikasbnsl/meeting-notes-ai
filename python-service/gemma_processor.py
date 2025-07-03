import torch
from transformers import pipeline

class GemmaProcessor:
    def __init__(self):
        """Initialize the Gemma 3n pipeline for text processing."""
        device = "mps" if torch.backends.mps.is_available() else "cpu"
        torch_dtype = torch.float16 if torch.backends.mps.is_available() else torch.float32
        self.pipeline = pipeline(
            task="text-generation",
            model="google/gemma-3n-e4b",
            device=device,
            torch_dtype=torch_dtype
        )
    
    def process_transcription(self, transcription):
        """
        Process transcription using Gemma 3n model.
        
        Args:
            transcription (str): The transcription text to process
            
        Returns:
            str: Processed text with summary, key points, and action items
        """
        prompt = f"""Provide a structured summary of the following transcription. The output should be formatted as follows:

**Title:** A concise title for the meeting.
**Summary:** A brief summary of the discussion.
**Key Points:** A bulleted list of the most important topics.
**Action Items:** A numbered list of any action items.

---
**Transcription:**
{transcription}
"""

        try:
            # Generate response using the pipeline
            response = self.pipeline(
                prompt,
                max_new_tokens=300,
                temperature=0.2,
                do_sample=True,
                pad_token_id=self.pipeline.tokenizer.eos_token_id,
                return_full_text=False
            )
            
            # Extract the generated text
            processed_text = response[0]['generated_text'].strip()
            
            return processed_text
            
        except Exception as e:
            return f"Error processing transcription with Gemma: {str(e)}"
