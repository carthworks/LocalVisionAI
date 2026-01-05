# LocalVision AI

**Real-time computer vision AI that runs 100% locally on your device.**

[![Privacy First](https://img.shields.io/badge/Privacy-First-green)](https://github.com)
[![No Cloud](https://img.shields.io/badge/Cloud-Free-blue)](https://github.com)
[![Open Source](https://img.shields.io/badge/Open-Source-orange)](https://github.com)

## 🎯 Overview

LocalVision AI analyzes live webcam video in real-time and explains what it sees—all without ever sending your data to the cloud. Your privacy is absolute.

### Key Features

- ✅ **100% Local Processing** - All AI inference runs on your device
- 🔒 **Privacy by Design** - Your video never leaves your computer
- 🚀 **Dual Pipeline Architecture** - Ollama (fast) or in-browser (no install)
- 📹 **Real-Time Analysis** - Live webcam analysis with natural language descriptions
- ⚡ **Memory Optimized** - Efficient frame processing and automatic cleanup
- 🎨 **Modern UI** - Beautiful, accessible interface built with Next.js + Tailwind
- 🌐 **Offline First** - Works completely offline after initial setup

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Next.js Frontend                │
├─────────────────────────────────────────┤
│  Dual Inference Pipeline                │
│  ├─ Primary: Ollama (localhost)         │
│  └─ Fallback: WebGPU/WASM (in-browser)  │
├─────────────────────────────────────────┤
│  Video Processing                       │
│  ├─ Frame capture & reduction           │
│  ├─ Memory-efficient buffering          │
│  └─ Automatic cleanup                   │
└─────────────────────────────────────────┘
```

## 🚀 Quick Start

### Option 1: With Ollama (Recommended)

**Best performance, requires installation**

1. **Install Ollama**
   ```bash
   # Visit https://ollama.ai and download for your OS
   # Or use package manager:
   
   # macOS
   brew install ollama
   
   # Linux
   curl -fsSL https://ollama.com/install.sh | sh
   ```

2. **Pull a vision model**
   ```bash
   ollama pull llava
   ```

3. **Start Ollama**
   ```bash
   ollama serve
   ```

4. **Run LocalVision AI**
   ```bash
   npm install
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Option 2: In-Browser Mode

**No installation needed, slower performance**

1. **Run LocalVision AI**
   ```bash
   npm install
   npm run dev
   ```

2. **Open in browser**
   ```
   http://localhost:3000
   ```

3. **Choose "In-Browser Mode"** during onboarding
   - Models download automatically (~1GB)
   - Cached for offline use

## 📋 Requirements

### Minimum Requirements
- **Browser**: Chrome 113+ or Edge 113+ (WebGPU support)
- **RAM**: 8GB
- **Storage**: 1-4GB for models
- **Camera**: Any webcam

### Recommended Requirements
- **Browser**: Latest Chrome/Edge
- **RAM**: 16GB
- **GPU**: Modern GPU with WebGPU support
- **Storage**: 5GB free space
- **Ollama**: Installed and running

## 🎮 Usage

### Basic Usage

1. **Grant Camera Permission**
   - Click "Enable Camera"
   - Allow browser camera access

2. **Start Analysis**
   - **Manual Mode**: Click "Analyze" for one-time analysis
   - **Auto Mode**: Toggle "Auto Mode" for continuous monitoring

3. **View Results**
   - Caption: Brief description of the scene
   - Reasoning: Detailed explanation
   - Confidence: AI confidence score
   - Timing: Processing time

### Settings

Access settings (⚙️) to configure:

- **Inference Pipeline**: Ollama or In-Browser
- **Model Selection**: Choose vision model (Ollama only)
- **Video Resolution**: 320x240 to 1280x720
- **Capture Interval**: 1-10 seconds (auto mode)
- **Frame Buffer Size**: 1-5 frames
- **Memory Limit**: 1.5-4GB
- **Privacy**: History storage, auto-clear

## 🔒 Privacy Guarantees

### What We Guarantee

✅ **Your video never leaves your device**
- All processing happens locally
- No external API calls (except localhost for Ollama)
- No data sent to servers

✅ **No tracking or analytics**
- No cookies (except preferences)
- No user accounts
- No telemetry

✅ **Open source and auditable**
- All code is public
- No hidden functionality
- Community reviewed

### What We Cannot Guarantee

❌ **Protection against local threats**
- Malware on your device
- Browser extensions
- Physical access to your computer

❌ **Data you choose to export**
- If you export analysis results and share them

### Privacy Indicators

- 🔴 **Red dot**: Camera is active
- 🔒 **Processing Locally**: All inference on-device
- 📡 **No Network Activity**: No external calls

## ⚡ Performance

### Expected Latency

| Hardware | Ollama | In-Browser |
|----------|--------|------------|
| High-end GPU | <1s | <2s |
| Mid-range GPU | <2s | <4s |
| CPU only | <5s | <8s |

### Memory Usage

- **Target**: <1.5GB
- **Maximum**: <2.5GB
- **Automatic cleanup** when approaching limits

### Optimization Tips

1. **Use Ollama** for best performance
2. **Enable GPU acceleration** in settings
3. **Reduce video resolution** if slow
4. **Close other browser tabs**
5. **Use quantized models** (Q4_K_M)

## 🛠️ Development

### Project Structure

```
app/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── lib/                   # Core libraries
│   ├── types.ts           # TypeScript types
│   ├── capabilities.ts    # System detection
│   ├── ollama-client.ts   # Ollama integration
│   ├── browser-inference.ts # WebGPU/WASM inference
│   ├── video-capture.ts   # Camera & frame processing
│   ├── performance.ts     # Performance monitoring
│   └── inference-manager.ts # Pipeline coordination
├── components/            # React components
│   ├── VideoFeed.tsx      # Camera display
│   ├── AnalysisDisplay.tsx # Results display
│   ├── PrivacyIndicator.tsx # Privacy status
│   └── ...
└── public/               # Static assets
```

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

### Environment Variables

Create `.env.local`:

```env
# Ollama configuration
NEXT_PUBLIC_OLLAMA_URL=http://localhost:11434

# Performance settings
NEXT_PUBLIC_DEFAULT_RESOLUTION=640x480
NEXT_PUBLIC_DEFAULT_INTERVAL=2
NEXT_PUBLIC_MEMORY_LIMIT=2.5
```

## 📚 Documentation

- [Product Requirements Document](../PRD.md)
- [UX Specification](../UX_SPEC.md)
- [API Documentation](./docs/API.md) *(coming soon)*
- [Contributing Guide](./CONTRIBUTING.md) *(coming soon)*

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature`
5. Make changes and test
6. Commit: `git commit -m "Add your feature"`
7. Push: `git push origin feature/your-feature`
8. Create a Pull Request

## 🐛 Troubleshooting

### Camera Not Working

**Issue**: Camera permission denied or not found

**Solutions**:
1. Check browser permissions (Settings → Privacy → Camera)
2. Ensure no other app is using the camera
3. Try a different browser
4. Restart your computer

### Ollama Not Connecting

**Issue**: "Ollama not responding" error

**Solutions**:
1. Ensure Ollama is running: `ollama serve`
2. Check Ollama is on port 11434
3. Restart Ollama service
4. Switch to in-browser mode as fallback

### Slow Performance

**Issue**: Analysis takes >5 seconds

**Solutions**:
1. Reduce video resolution (Settings → Video → Resolution)
2. Enable GPU acceleration (Settings → Performance)
3. Use Ollama instead of in-browser mode
4. Close other browser tabs
5. Check system resources (Task Manager)

### Out of Memory

**Issue**: Browser crashes or freezes

**Solutions**:
1. Reduce frame buffer size (Settings → Performance)
2. Lower video resolution
3. Close other tabs and applications
4. Restart browser
5. Use a device with more RAM

## 📊 Benchmarking

Run performance benchmarks:

```bash
# In browser console
import { Benchmark } from './lib/performance';

// Run benchmark suite
const results = await Benchmark.runSuite(
  async () => {
    // Your inference function
  },
  10, // iterations
  2   // warmup runs
);

console.log('Benchmark Results:', results);
```

## 🔐 Security

### Reporting Security Issues

If you discover a security vulnerability, please email: security@localvision.ai

**Do not** open a public issue for security vulnerabilities.

### Security Best Practices

1. Keep your browser updated
2. Use HTTPS in production
3. Review open source code
4. Run on trusted devices
5. Don't install untrusted browser extensions

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

## 🙏 Acknowledgments

- **Ollama** - Local AI model execution
- **SmolVLM** - Compact vision-language model
- **llama.cpp** - Efficient LLM inference
- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS

## 📞 Support

- **Documentation**: [docs.localvision.ai](https://docs.localvision.ai)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@localvision.ai

## 🗺️ Roadmap

### Phase 1: MVP ✅
- [x] Dual inference pipeline
- [x] Real-time webcam analysis
- [x] Memory management
- [x] Privacy indicators
- [x] Basic UI

### Phase 2: Polish (In Progress)
- [ ] Advanced settings
- [ ] Performance benchmarking
- [ ] History management
- [ ] Export functionality
- [ ] Accessibility improvements

### Phase 3: Advanced Features
- [ ] Object detection overlays
- [ ] Scene change detection
- [ ] Custom prompts
- [ ] Multi-language support
- [ ] PWA support

### Phase 4: Ecosystem
- [ ] Plugin system
- [ ] Community models
- [ ] Integration guides
- [ ] Video tutorials

## ⭐ Star History

If you find LocalVision AI useful, please consider starring the repository!

---

**Made with ❤️ for privacy-conscious users**

*LocalVision AI - Your vision, your device, your control.*
