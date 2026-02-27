// @ts-nocheck — MCP SDK types cause TS2589 in strict mode
/**
 * PismoSzyteNaMiare MCP Server — HTTP transport (for Glama.ai and remote MCP clients)
 * Deployed to Azure: https://softvoyagers-pismoszytenamiare-mcp.azurewebsites.net
 */
import express from 'express';
import cors from 'cors';
import path from 'path';
import * as appInsights from 'applicationinsights';
import { randomUUID } from 'node:crypto';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpServer } from './tools';

if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
  appInsights.setup().setAutoCollectRequests(true).setAutoCollectExceptions(true).start();
  appInsights.defaultClient.context.tags[
    appInsights.defaultClient.context.keys.cloudRole
  ] = 'pismoszytenamiare-mcp';
}

const app = express();
app.use(cors());
app.use(express.json());

// Serve .well-known for Glama auto-discovery (Express ignores dotfiles by default)
app.use('/.well-known', express.static(path.join(__dirname, 'public', '.well-known')));
// Serve robots.txt
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'pismoszytenamiare-mcp',
    version: '1.0.0',
    api: 'https://pismoszytenamiare.pl',
  });
});

// MCP HTTP endpoint — StreamableHTTP transport
const transports: Record<string, StreamableHTTPServerTransport> = {};

app.post('/mcp', async (req, res) => {
  try {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (sessionId && transports[sessionId]) {
      await transports[sessionId].handleRequest(req, res, req.body);
      return;
    }
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sid: string) => { transports[sid] = transport; },
    });
    transport.onclose = () => { if (transport.sessionId) delete transports[transport.sessionId]; };
    const server = createMcpServer();
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal error' }, id: null });
    }
  }
});

app.get('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).json({ jsonrpc: '2.0', error: { code: -32000, message: 'No valid session' }, id: null });
    return;
  }
  await transports[sessionId].handleRequest(req, res);
});

app.delete('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).json({ jsonrpc: '2.0', error: { code: -32000, message: 'No valid session' }, id: null });
    return;
  }
  await transports[sessionId].handleRequest(req, res);
});

const PORT = parseInt(process.env.PORT || '8080', 10);
const server = app.listen(PORT, () => {
  console.log(`PismoSzyteNaMiare MCP HTTP server → http://localhost:${PORT}/mcp`);
  console.log(`API base: https://pismoszytenamiare.pl`);
});

function shutdown(signal: string) {
  console.log(`${signal} received, shutting down...`);
  if (appInsights.defaultClient) appInsights.defaultClient.flush();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000);
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
