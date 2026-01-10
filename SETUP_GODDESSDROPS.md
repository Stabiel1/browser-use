# Complete GoddessDrops Agent Setup

## Current Status

✅ Ollama is installed (version 0.13.5)  
✅ Ollama server is running on http://localhost:11434  
✅ tinyllama model downloaded  
⏳ goddessara custom model being created (from F:\goddessara\Modelfile)  

## Quick Setup (3 Steps)

### Step 1: Download a Model

**Option A: Llama 3 (Recommended)**
```powershell
ollama pull llama3:instruct
```

**Option B: Gemma (Lightweight)**
```powershell
ollama pull gemma
```

**Option C: TinyLlama (Fastest)** ✅ Already downloaded
```powershell
ollama pull tinyllama
```

**Option D: Custom GoddessAra Model** ⭐ Recommended
```powershell
cd F:\goddessara
ollama create goddessara -f Modelfile
```
This creates a custom model with the Goddess Ara personality already configured.

**Note:** First download can take 5-15 minutes depending on model size and internet speed.

### Step 2: Start Ollama Server

**Run this in PowerShell (keep window open):**
```powershell
ollama serve
```

**OR use the startup script:**
```powershell
.\start_ollama.ps1
```

You should see: `Ollama server running on http://localhost:11434`

### Step 3: Create Custom Model (GoddessAra)

**If you have a custom Modelfile:**
```powershell
cd F:\goddessara
ollama create goddessara -f Modelfile
```

**Or use a standard model:**
- `llama3:instruct` - General purpose
- `gemma3:1b` - Lightweight
- `tinyllama` - Fastest

### Step 4: Configure Cursor Agent

1. **Open Cursor**
2. **Press `Ctrl + K`** (Windows) or `Cmd + K` (Mac)
3. **Type**: `New Agent`
4. **Fill in:**
   - **Name**: `GoddessDrops`
   - **Model**: `goddessara` (custom model) or `llama3:instruct` (standard)
   - **Backend**: `ollama`
   - **Endpoint**: `http://localhost:11434`
5. **Click "Run"**

### Step 5: Initial Prompt

**If using custom `goddessara` model:**
The model already has the system prompt configured in the Modelfile. Just start chatting!

**If using standard model, paste this:**
```
You are GoddessDropBot, an AI assistant trained by Ara and Ebony. Your purpose is to assist users with various tasks while maintaining a helpful, professional, and engaging personality. You have access to browser automation, system commands, and can interact with web services. Always prioritize user safety and follow best practices.
```

## Model Recommendations

| Model | Size | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| `goddessara` ⭐ | ~815 MB | ⚡⚡⚡ | ⭐⭐⭐ | Custom Goddess Ara personality |
| `tinyllama` | ~637 MB | ⚡⚡⚡ | ⭐⭐ | Quick tasks, testing |
| `gemma3:1b` | ~815 MB | ⚡⚡⚡ | ⭐⭐⭐ | Balanced, lightweight |
| `gemma:2b` | ~1.4 GB | ⚡⚡ | ⭐⭐⭐ | Balanced, lightweight |
| `llama3:instruct` | ~4.7 GB | ⚡ | ⭐⭐⭐⭐ | Best quality, general use |
| `qwen2.5:7b` | ~4.4 GB | ⚡ | ⭐⭐⭐⭐ | Coding, reasoning |
| `mistral` | ~4.1 GB | ⚡ | ⭐⭐⭐⭐ | High quality responses |

## Complete Setup Script

Run this to do everything automatically:

```powershell
# Download model (choose one)
Write-Host "Downloading llama3:instruct..." -ForegroundColor Cyan
ollama pull llama3:instruct

# Start server
Write-Host "Starting Ollama server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ollama serve"

# Wait and verify
Start-Sleep -Seconds 5
Write-Host "Checking server..." -ForegroundColor Cyan
curl http://localhost:11434/api/tags

Write-Host "`n✅ Setup complete! Now configure Cursor agent." -ForegroundColor Green
```

## Verification

After setup, verify everything works:

```powershell
# Check Ollama is running
curl http://localhost:11434/api/tags

# List downloaded models
ollama list

# Test a model
ollama run llama3:instruct "Hello, who are you?"
```

## Troubleshooting

### "Model not found" in Cursor

1. Check model name matches exactly: `ollama list`
2. Make sure model is fully downloaded
3. Try pulling the model again: `ollama pull llama3:instruct`

### "Connection refused" in Cursor

1. Verify Ollama is running: `curl http://localhost:11434/api/tags`
2. Check the Ollama server window is still open
3. Try restarting: Close Ollama window, run `ollama serve` again

### Slow responses

1. Use a smaller model (tinyllama, gemma:2b)
2. Check your CPU/GPU resources
3. Close other applications

## Next Steps

Once your agent is working:

1. **Test basic functionality** - Ask simple questions
2. **Try browser tasks** - "Navigate to google.com"
3. **Test system commands** - "List files in current directory"
4. **Customize the prompt** - Adjust to your needs

## Files Created

- `start_ollama.ps1` - Quick Ollama server startup script
- `CURSOR_OLLAMA_AGENT_SETUP.md` - Detailed setup guide
- `GODDESSDROPS_AGENT_PROMPT.md` - Agent prompt templates
- `SETUP_GODDESSDROPS.md` - This complete setup guide

## Quick Reference

**Start Ollama:**
```powershell
ollama serve
```

**Download Model:**
```powershell
ollama pull llama3:instruct
```

**List Models:**
```powershell
ollama list
```

**Test Model:**
```powershell
ollama run llama3:instruct "Your question here"
```

**Cursor Agent Config:**
- Name: `GoddessDrops`
- Model: `llama3:instruct`
- Backend: `ollama`
- Endpoint: `http://localhost:11434`
