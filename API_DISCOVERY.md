# API Discovery Report - Browser Use WebUI

## Server Information

**URL**: http://127.0.0.1:42003/?__theme=dark  
**Process ID**: 13188  
**Status**: Running and listening  
**Application**: Browser Use WebUI (Gradio-based)

## API Endpoints

### Gradio API
- **Base URL**: `http://127.0.0.1:42003/gradio_api`
- **API Prefix**: `/gradio_api`
- **Framework**: Gradio 5.27.0
- **App ID**: 1184556586710393051

### Available LLM Providers

The WebUI supports the following LLM providers:

1. **OpenAI** - Models: gpt-4o, gpt-4, gpt-3.5-turbo, o3-mini
2. **Anthropic** - Models: claude-3-5-sonnet-20241022, claude-3-5-sonnet-20240620, claude-3-opus-20240229
3. **DeepSeek** - Models: deepseek-chat, deepseek-reasoner
4. **Google** - Models: gemini-2.0-flash, gemini-1.5-flash-latest, etc.
5. **Ollama** - Models: **tinyllama**, qwen2.5:7b, qwen2.5:14b, qwen2.5:32b, llama2:7b, deepseek-r1:14b, deepseek-r1:32b
6. **Azure OpenAI** - Models: gpt-4o, gpt-4, gpt-3.5-turbo
7. **Mistral** - Models: pixtral-large-latest, mistral-large-latest, mistral-small-latest
8. **Alibaba** - Models: qwen-plus, qwen-max, qwen-vl-max, etc.
9. **MoonShot** - Models: moonshot-v1-32k-vision-preview, moonshot-v1-8k-vision-preview
10. **Unbound AI** - Models: gemini-2.0-flash, gpt-4o-mini, gpt-4o, gpt-4.5-preview
11. **Grok** - Models: grok-3, grok-3-fast, grok-3-mini, etc.
12. **SiliconFlow** - Multiple DeepSeek and Qwen models
13. **IBM** - Models: ibm/granite-vision-3.1-2b-preview, meta-llama models
14. **ModelScope** - Multiple Qwen and DeepSeek models

## TinyLlama Configuration

**TinyLlama** is available as an Ollama model option:
- **Model Name**: `tinyllama`
- **Provider**: Ollama
- **Default Ollama Endpoint**: `http://localhost:11434`
- **Configurable via**: `OLLAMA_ENDPOINT` environment variable

### Using TinyLlama

1. **Start Ollama** (if not running):
   ```bash
   ollama serve
   ```

2. **Pull TinyLlama model**:
   ```bash
   ollama pull tinyllama
   ```

3. **Configure in WebUI**:
   - Select "ollama" as LLM Provider
   - Select "tinyllama" as LLM Model Name
   - Set Base URL to `http://localhost:11434` (or custom endpoint)
   - Adjust Ollama Context Length if needed (default: 16000)

## API Configuration

### Environment Variables

The application supports the following environment variables for API configuration:

- `OLLAMA_ENDPOINT` - Default: `http://localhost:11434`
- `OPENAI_ENDPOINT` - Default: `https://api.openai.com/v1`
- `ANTHROPIC_ENDPOINT` - Default: `https://api.anthropic.com`
- `DEEPSEEK_ENDPOINT` - Default: `https://api.deepseek.com`
- `GOOGLE_API_KEY` - For Google models
- `MISTRAL_ENDPOINT` - Default: `https://api.mistral.ai/v1`
- `ALIBABA_ENDPOINT` - Default: `https://dashscope.aliyuncs.com/compatible-mode/v1`
- And more...

### API Settings in UI

The WebUI provides UI controls for:
- LLM Provider selection
- Model name selection
- Temperature control (0.0 - 2.0)
- Base URL override
- API Key input (can use .env or UI input)
- Ollama Context Length (256 - 65536, default: 16000)
- Vision mode toggle

## Local Network Discovery

### Network Interfaces

**Local IP Addresses Found**:
- `10.2.0.2` - Likely VPN or virtual network interface
- `192.168.178.21` - Local network interface (accessible on LAN)

### Listening Services

**Services listening on all interfaces (0.0.0.0)**:
- Port `135` - RPC Endpoint Mapper
- Port `445` - SMB (Windows File Sharing)
- Port `5040` - Unknown service
- Port `7680` - Unknown service
- Port `42000` - Likely Pinokio service
- Ports `49664-49669` - Windows RPC dynamic ports

**Services on local network interfaces**:
- Port `139` on `10.2.0.2` - NetBIOS Session Service
- Port `139` on `192.168.178.21` - NetBIOS Session Service

### Browser Use WebUI Access

- **Localhost**: http://127.0.0.1:42003
- **Network Access**: http://192.168.178.21:42003 (if firewall allows)
- **Network Access**: http://10.2.0.2:42003 (if firewall allows)

### Ollama Status

**Default Ollama Endpoint**: `http://localhost:11434`

**Current Status**: Ollama is NOT currently running on port 11434

To use TinyLlama, you need to:

1. **Start Ollama** (if installed):
   ```bash
   ollama serve
   ```
   Or on Windows:
   ```powershell
   ollama serve
   ```

2. **Pull TinyLlama model**:
   ```bash
   ollama pull tinyllama
   ```

3. **Verify Ollama is running**:
   ```bash
   curl http://localhost:11434/api/tags
   ```
   Should return a JSON list of available models.

4. **Alternative Ollama Endpoints**:
   - If Ollama is running on a different machine, use that IP: `http://192.168.178.21:11434`
   - If on a different port, configure in WebUI Base URL field
   - Can also set `OLLAMA_ENDPOINT` environment variable

## Gradio API Usage

### Example: Making API Calls

The Gradio API uses a specific format. You can interact with it programmatically:

```python
import requests

# Get API info
response = requests.get('http://127.0.0.1:42003/gradio_api/')
```

### Available Components

Based on the Gradio config, the UI includes:
- Text inputs for system prompts
- LLM provider dropdowns
- Model selection dropdowns
- Temperature sliders
- API key inputs
- Browser settings
- Agent execution interface

## Integration Points

### For Browser Automation
- The WebUI can control browsers via Playwright
- Supports custom browser paths and user data directories
- Can run in headless or visible mode
- Supports screen recording

### For LLM Integration
- Supports multiple LLM providers simultaneously
- Can switch between providers without restart
- Supports vision models for screenshot analysis
- Configurable context lengths for Ollama models

## Next Steps

1. **Check if Ollama is running**:
   - Default port: 11434
   - Test: `curl http://localhost:11434/api/tags`

2. **Pull TinyLlama if needed**:
   ```bash
   ollama pull tinyllama
   ```

3. **Configure in WebUI**:
   - Navigate to Agent Settings tab
   - Select Ollama provider
   - Select tinyllama model
   - Set base URL if Ollama is on different host/port

4. **Test the connection**:
   - Use the "Run Agent" tab to test browser automation
   - The agent will use the configured LLM (TinyLlama) for decision making

## Notes

- The WebUI is running on port 42003 (likely assigned dynamically by Pinokio)
- Ollama must be running separately on port 11434 (default) for TinyLlama to work
- The application supports both local and remote Ollama instances
- All API keys can be set via environment variables or UI input
