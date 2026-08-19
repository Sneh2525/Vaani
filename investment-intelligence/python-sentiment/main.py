from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import uvicorn
from typing import List

app = FastAPI(title="Vaani FinBERT Sentiment Analyzer Sidecar")

# Load model and tokenizer
# Use CPU to optimize system resource consumption in local environment
try:
    tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
    model = AutoModelForSequenceClassification.from_pretrained("ProsusAI/finbert")
except Exception as e:
    print(f"Error loading local FinBERT model. Make sure internet connection is active on first run: {e}")
    raise e

class SentimentRequest(BaseModel):
    texts: List[str]

@app.post("/analyze")
def analyze_sentiment(request: SentimentRequest):
    if not request.texts:
        return {"results": []}
    
    try:
        inputs = tokenizer(request.texts, padding=True, truncation=True, return_tensors="pt")
        with torch.no_grad():
            outputs = model(**inputs)
            predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
            
        labels = ["positive", "negative", "neutral"]
        results = []
        for i, text in enumerate(request.texts):
            probs = predictions[i].tolist()
            max_idx = probs.index(max(probs))
            results.append({
                "text": text,
                "label": labels[max_idx],
                "probability": float(probs[max_idx]),
                "breakdown": {labels[j]: float(probs[j]) for j in range(3)}
            })
            
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=False)
