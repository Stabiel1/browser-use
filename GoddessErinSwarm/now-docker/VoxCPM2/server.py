"""HTTP API for VoxCPM2 TTS (informal alias: FoxCPM2 = VoxCPM2)."""

from __future__ import annotations

import io
import os
import threading
from typing import Annotated

import numpy as np
import soundfile as sf
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import Response
from pydantic import BaseModel, Field

app = FastAPI(title="GoddessErin VoxCPM2 TTS", version="1.0.0")

_model = None
_model_lock = threading.Lock()
_load_lock = threading.Lock()


def _default_voice_prefix() -> str:
    raw = os.environ.get("GODDESS_AURA_VOICE", "").strip()
    if raw:
        return raw if raw.startswith("(") else f"({raw})"
    return "(Adult female voice, warm, confident, smooth pacing)"


def _get_model():
    global _model
    if _model is not None:
        return _model
    with _load_lock:
        if _model is not None:
            return _model
        from voxcpm import VoxCPM

        model_id = os.environ.get("VOXCPM_MODEL_ID", "openbmb/VoxCPM2")
        _model = VoxCPM.from_pretrained(model_id, load_denoiser=False)
        return _model


class TtsRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    voice_description: str | None = Field(
        default=None,
        description="Optional voice-design prefix; merged as (description) + text per VoxCPM2.",
    )
    cfg_value: float = Field(default=2.0, ge=0.5, le=4.0)
    inference_timesteps: int = Field(default=10, ge=1, le=50)
    streaming: bool = Field(default=False)


@app.get("/health")
def health():
    return {"status": "ok", "model": "VoxCPM2", "model_loaded": _model is not None}


@app.post("/v1/tts")
def synthesize(req: TtsRequest):
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is empty")

    prefix = req.voice_description.strip() if req.voice_description else _default_voice_prefix()
    if prefix and not prefix.startswith("("):
        prefix = f"({prefix})"
    full_text = f"{prefix}{text}"

    try:
        with _model_lock:
            model = _get_model()
            if req.streaming:
                chunks: list[np.ndarray] = []
                for chunk in model.generate_streaming(
                    text=full_text,
                ):
                    chunks.append(chunk)
                wav = np.concatenate(chunks) if chunks else np.array([], dtype=np.float32)
            else:
                wav = model.generate(
                    text=full_text,
                    cfg_value=req.cfg_value,
                    inference_timesteps=req.inference_timesteps,
                )
            sr = int(model.tts_model.sample_rate)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

    buf = io.BytesIO()
    sf.write(buf, wav, sr, format="WAV", subtype="PCM_16")
    return Response(content=buf.getvalue(), media_type="audio/wav")


@app.get("/v1/tts")
def synthesize_get(
    text: Annotated[str, Query(min_length=1, max_length=5000)],
    cfg_value: float = 2.0,
    inference_timesteps: int = 10,
):
    return synthesize(
        TtsRequest(
            text=text,
            cfg_value=cfg_value,
            inference_timesteps=inference_timesteps,
        )
    )
