import express, { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import http from 'http';
import { Socket } from 'net';
import { Duplex } from 'stream';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const AUTH_API_HEADER = 'xi-api-key';
const proxyMiddleware = createProxyMiddleware<Request, Response>({
  target: 'https://api.elevenlabs.io/',
  changeOrigin: true,
  secure: false,
  ws: true,
  followRedirects: true,
  on: {
    proxyReq: (proxyReq: any, req: any, res: any) => {
      proxyReq.setHeader(AUTH_API_HEADER, `${process.env.ELEVENLABS_API_KEY}`);
    },
    proxyRes: (proxyRes: any, req: any, res: any) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
    error: (err: any, req: any, res: any) => {
      console.error('Proxy error:', err);
      if (res.writeHead) {
        res.status(500).send('Proxy error');
      }
    },
    proxyReqWs: (proxyReq: any, req: any, socket: any) => {
      proxyReq.setHeader(AUTH_API_HEADER, `${process.env.ELEVENLABS_API_KEY}`);
      
      if (req.headers['sec-websocket-protocol']) {
        proxyReq.setHeader('Sec-WebSocket-Protocol', req.headers['sec-websocket-protocol']);
      }
      
      console.log('WebSocket request headers:', req.headers);
    },
    open: (proxySocket: any) => {
      console.log('Proxy socket opened');
      
      proxySocket.on('error', (err: any) => {
        console.error('WebSocket proxy socket error:', err);
      });
    },
    close: (proxySocket: any) => {
      console.log('Proxy socket closed');
      console.log('Socket state:', JSON.stringify({
        destroyed: proxySocket.destroyed,
        readyState: proxySocket.readyState,
        connecting: proxySocket.connecting
      }));
    },
    start: (proxySocket: any, req: any, socket: any) => {
      console.log('Proxy socket started');
      
      socket.on('error', (err: any) => {
        console.error('Client socket error:', err);
      });
    },
    end: (proxySocket: any, req: any, res: any) => {
      console.log('Proxy socket ended');
    },
    econnreset: (err: any, proxySocket: any, req: any, res: any) => {
      console.log('Proxy socket econnreset', err);
    }
  }
});

app.use('/v1', proxyMiddleware);

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from TypeScript Express Server!' });
});

// Create HTTP server
const server = http.createServer(app);

// Get the proxy object to handle WebSocket upgrades
const wsProxy = proxyMiddleware.upgrade;

// Mount the WebSocket upgrade handler
if (wsProxy) {
  server.on('upgrade', (req, socket, head) => {
    console.log('Upgrade request received for:', req.url);
    wsProxy(req, socket as Socket, head);
  });
}

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 