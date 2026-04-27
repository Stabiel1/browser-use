# VoxCPM2 (TTS) — CUDA 12.6 runtime; weights download at runtime into mounted HF cache volume.
# Requires host NVIDIA driver new enough for CUDA 12.6 containers (see NVIDIA Container Toolkit docs).
FROM pytorch/pytorch:2.11.0-cuda12.6-cudnn9-runtime

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
