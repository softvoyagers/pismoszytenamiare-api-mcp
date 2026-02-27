// @ts-nocheck — MCP SDK zod type inference causes TS2589 in strict mode
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

const API_BASE = process.env.PISMOSZYTENAMIARE_API_URL || 'https://pismoszytenamiare.pl';

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: 'pismoszytenamiare-mcp',
    version: '1.0.0',
  });

  // TODO: Replace these placeholder tools with actual product-specific tools.
  // Each tool should call one or more endpoints on the pismoszytenamiare.pl REST API.
  // Use fetch() to call API_BASE + '/api/v1/...' — no internal API knowledge needed.

  server.tool(
    'example_get',
    'Get example data from the PismoSzyteNaMiare API. Replace with your real tool.',
    {
      query: z.string().optional().describe('Optional query parameter'),
    },
    async ({ query }) => {
      const params = new URLSearchParams();
      if (query) params.set('query', query);
      const qs = params.toString();
      const url = `${API_BASE}/api/v1/example${qs ? '?' + qs : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
        isError: !response.ok,
      };
    }
  );

  server.tool(
    'example_post',
    'Post data to the PismoSzyteNaMiare API. Replace with your real tool.',
    {
      input: z.string().describe('Input data to process'),
    },
    async ({ input }) => {
      const response = await fetch(`${API_BASE}/api/v1/example`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await response.json();
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
        isError: !response.ok,
      };
    }
  );

  return server;
}
