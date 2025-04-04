import express, { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const proxyMiddleware = createProxyMiddleware<Request, Response>({
  target: 'https://api.elevenlabs.io/',
  changeOrigin: true,
  secure: false,
  ws: true,
  on: {
    proxyReq: (proxyReq: any, req: any, res: any) => {
      proxyReq.setHeader('Authorization', `Bearer ${process.env.ELEVENLABS_API_KEY}`);
    },
    proxyRes: (proxyRes: any, req: any, res: any) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
    error: (err: any, req: any, res: any) => {
      console.error('Proxy error:', err);
      res.status(500).send('Proxy error');
    },
    proxyReqWs: (proxyReq: any, req: any, res: any) => {
      proxyReq.setHeader('Authorization', `Bearer ${process.env.ELEVENLABS_API_KEY}`);
    },
    open: (connection: any) => {
      console.log('Proxy socket opened');
    }
  }
});

app.use('/v1', proxyMiddleware);

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from TypeScript Express Server!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 