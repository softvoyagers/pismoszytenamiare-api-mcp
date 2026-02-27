#!/usr/bin/env node
/**
 * PismoSzyteNaMiare MCP Server — stdio transport
 * Usage: npx pismoszytenamiare-mcp
 * Add to claude_desktop_config.json under mcpServers.
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './tools';

async function main() {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('Failed to start PismoSzyteNaMiare MCP server:', err);
  process.exit(1);
});
