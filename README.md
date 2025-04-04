# TypeScript Express Server

A simple TypeScript Node.js project with a single Express endpoint.

## Setup

1. Install dependencies:
```
npm install
```

2. Start development server:
```
npm run dev
```

3. Build for production:
```
npm run build
```

4. Run production server:
```
npm start
```

## Debugging

### Using VS Code

1. Make sure you have the required dependencies installed.
2. Update the `.env` file with your ElevenLabs API key.
3. Open the Debug panel in VS Code (Ctrl+Shift+D or Cmd+Shift+D).
4. Select "Debug Server" from the dropdown menu.
5. Press the green play button or F5 to start debugging.

### Using Command Line

Run the debug script:
```
npm run debug
```

Then connect your debugger to the Node.js inspector at the default port 9229.

## API Endpoints

- GET `/api/hello` - Returns a hello message in JSON format
- Any ElevenLabs API endpoint can be accessed via `/v1/...` and will be proxied to the ElevenLabs API

## Environment Variables

- `PORT` - The port on which the server runs (default: 3000)
- `ELEVENLABS_API_KEY` - Your ElevenLabs API key 