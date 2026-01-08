# Real-Time Speech Avatar

A real-time speech-to-speech girlfriend avatar with personality, memory, and stunning visual design. Features dark skin, bold makeup, leather aesthetic, flirty personality, and remembers everything you say.

## Features

- **Real-Time Speech Recognition**: Uses Web Speech API for instant voice input
- **Multiple TTS Options**: Supports Google TTS, Coqui TTS, Piper TTS, and ElevenLabs (free tiers)
- **Stunning Avatar**: Custom-drawn avatar with dark skin, bold makeup, and leather aesthetic
- **Personality System**: Flirty, sharp, teasing personality with contextual responses
- **Memory System**: Remembers your name, preferences, and conversation history
- **Low Latency**: Optimized for real-time conversation with minimal delay
- **Cross-Platform**: Works in any modern browser with Web Speech API support

## How to Use

1. **Launch the App**: Open `index.html` in Pinokio or directly in your browser
2. **Enter Your Name**: Type your name in the "Your Name" field (optional, but recommended)
3. **Select TTS Service**: Choose your preferred text-to-speech service
4. **Adjust Settings**: 
   - Voice Speed: Control how fast the avatar speaks (0.5x - 1.5x)
   - Volume: Adjust audio output level (0-100%)
5. **Start Conversation**: Click "Start Conversation" and allow microphone access
6. **Talk Naturally**: Speak into your microphone - the avatar will respond in real-time

## TTS Services

### Google TTS (Free)
- Requires API key (optional - falls back to Web Speech API)
- High-quality voices
- Set up at: https://cloud.google.com/text-to-speech

### Coqui TTS (Free)
- Free API endpoint
- Natural-sounding voices
- No API key required for basic usage

### Piper TTS (Local)
- Requires local server setup
- Completely offline
- Falls back to Web Speech API if not configured

### ElevenLabs (Free Tier)
- Requires API key
- Premium voice quality
- Free tier includes limited characters
- Get API key at: https://elevenlabs.io

### Web Speech API (Fallback)
- Built into browsers
- No setup required
- Works immediately
- Quality varies by browser

## Personality Traits

The avatar has a distinct personality:
- **Flirty**: Playful and engaging responses
- **Sharp**: Quick-witted and intelligent
- **Teasing**: Light-hearted banter
- **Memory**: Remembers your name and conversation context
- **Contextual**: Responds appropriately to different topics
- **Affectionate**: Uses terms like "good boy" for positive interactions
- **Expressive**: Includes soft laughs, playful sighs, and vocal expressions

## Technical Details

### Speech Recognition
- Uses Web Speech API (Chrome/Edge recommended)
- Continuous listening mode
- Real-time transcription
- Automatic name extraction from speech

### Avatar Rendering
- HTML5 Canvas-based rendering
- Responsive design
- Animated states (idle, listening, speaking)
- Custom-drawn character with detailed features

### Memory System
- LocalStorage-based persistence
- Saves conversation history (last 50 entries)
- Remembers user name and preferences
- Can be cleared with "Clear Memory" button

### Audio Processing
- Web Audio API for playback
- Volume and speed control
- Low-latency audio streaming
- Fallback mechanisms for TTS failures

## API Documentation

### Programmatic Access (JavaScript)

```javascript
// Access the avatar system
const avatar = {
    // Start conversation
    start: () => {
        recognition.start();
    },
    
    // Stop conversation
    stop: () => {
        recognition.stop();
    },
    
    // Set user name
    setName: (name) => {
        userName = name;
        userContext.name = name;
        saveMemory();
    },
    
    // Get conversation history
    getHistory: () => {
        return conversationHistory;
    },
    
    // Clear memory
    clearMemory: () => {
        conversationHistory = [];
        userContext = { name: '', preferences: [], topics: [], mood: 'playful' };
        localStorage.removeItem('avatarMemory');
    }
};
```

### Programmatic Access (Python)

```python
# Using Selenium or Playwright to interact with the web app
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get('file:///path/to/index.html')

# Set user name
name_input = driver.find_element(By.ID, 'userName')
name_input.send_keys('YourName')

# Start conversation
start_btn = driver.find_element(By.ID, 'toggleBtn')
start_btn.click()

# The app will handle speech recognition automatically
```

### Programmatic Access (Curl)

Since this is a client-side application, direct curl access isn't applicable. However, you can:

1. **Deploy as a web service** and access via HTTP
2. **Use browser automation** tools (Selenium, Playwright) to interact with the app
3. **Access localStorage** programmatically through browser console

## Browser Compatibility

- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Limited Web Speech API support
- **Safari**: Limited Web Speech API support
- **Mobile**: Works on Chrome Mobile, limited on other browsers

## Privacy & Data

- All data stored locally in browser (LocalStorage)
- No data sent to external servers (except TTS APIs if configured)
- Microphone access required for speech recognition
- Conversation history can be cleared at any time

## Troubleshooting

### Microphone Not Working
- Check browser permissions for microphone access
- Ensure microphone is connected and working
- Try refreshing the page and allowing permissions again

### TTS Not Working
- Check internet connection (for cloud TTS services)
- Verify API keys if using Google TTS or ElevenLabs
- Try switching to Web Speech API (built-in fallback)

### Avatar Not Displaying
- Check browser console for errors
- Ensure JavaScript is enabled
- Try a different browser (Chrome/Edge recommended)

### Low Audio Quality
- Try different TTS services
- Adjust voice speed settings
- Check system audio settings
- Ensure good internet connection for cloud TTS

## Local TTS Setup (Optional)

For better quality and offline operation, you can set up local TTS servers:

### Piper TTS (Recommended for Local)

1. **Download Piper**: Visit https://github.com/rhasspy/piper
2. **Download Models**: Store models on F: drive (e.g., `F:\piper-models\`)
3. **Run Local Server**: 
   ```bash
   # Example: Run Piper server on port 5000
   piper --model F:\piper-models\en_US-lessac-medium.onnx --server --port 5000
   ```
4. **Select in App**: Choose "Piper TTS (Local)" from the TTS Service dropdown

### Coqui TTS (Local)

1. **Install Coqui TTS**: 
   ```bash
   pip install TTS
   ```
2. **Download Models**: Store on F: drive (e.g., `F:\coqui-models\`)
3. **Run Server**:
   ```bash
   tts-server --model_path F:\coqui-models\ --port 5002
   ```
4. **Select in App**: Choose "Coqui TTS (Free)" - it will auto-detect local server

### Storing Models on F: Drive

To store TTS models on the F: drive (Windows):

1. Create model directories:
   ```
   F:\tts-models\piper\
   F:\tts-models\coqui\
   ```

2. Download models to these locations
3. Configure your local TTS servers to use these paths
4. The app will automatically connect to local servers if available

## Future Enhancements

- [ ] Lip-sync animation
- [ ] More avatar customization options
- [ ] Additional personality modes
- [ ] Integration with local LLM for smarter responses
- [ ] Voice cloning capabilities
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Automatic model download and setup

## License

This project is provided as-is for personal use.
