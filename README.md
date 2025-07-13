# Oak Camera v3 Frontend Interface

A modern, responsive web interface for controlling Oak Camera v3 devices over PoE networks.

## Features

- 🎥 **Real-time Video Streaming** - Live video feed with WebSocket communication
- 🎛️ **Complete Camera Controls** - Manual exposure, focus, white balance, and more
- 📹 **Recording & Capture** - Video recording with multiple codecs and image capture
- 📁 **File Management** - Browse, download, and manage recordings
- ⌨️ **Keyboard Shortcuts** - Efficient control with customizable hotkeys
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🌙 **Dark Theme** - Professional dark interface optimized for camera work

## Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Production
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000
VITE_DEFAULT_CAMERA_IP=192.168.1.100
```

## Project Structure

```
src/
├── components/          # React components
│   ├── UI/             # Reusable UI components
│   ├── Layout/         # Layout components
│   ├── Camera/         # Camera-specific components
│   └── Connection/     # Connection management
├── hooks/              # Custom React hooks
├── services/           # API and WebSocket services
├── store/             # State management (Zustand)
├── utils/             # Utility functions
└── App.jsx            # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run clean` - Clean build artifacts

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.