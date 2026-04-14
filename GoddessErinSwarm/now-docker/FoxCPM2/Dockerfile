# VoxCPM2 (TTS) — CUDA 12.4, Python 3.11. Weights download at runtime into mounted HF cache volume.
FROM pytorch/pytorch:2.5.1-cuda12.4-cudnn9-runtime

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server.py .

ENV PYTHONUNBUFFERED=1
EXPOSE 8890

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8890"]
