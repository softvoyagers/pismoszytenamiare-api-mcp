# PismoSzyteNaMiare MCP Server

> Integrate [PismoSzyteNaMiare](https://pismoszytenamiare.pl) into Claude, Cursor, VS Code, and any MCP-compatible AI assistant.

**No API key required. Free forever.**

## Quick Start

### Claude Desktop (stdio)

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pismoszytenamiare": {
      "command": "npx",
      "args": ["pismoszytenamiare-mcp"]
    }
  }
}
```

### Claude.ai / Remote MCP (HTTP)

Connect via the Glama connector or directly:

```
https://softvoyagers-pismoszytenamiare-mcp.azurewebsites.net/mcp
```

## Available Tools

<!-- TODO: Document tools after implementing src/tools.ts -->

| Tool | Description |
|------|-------------|
| `example_get` | Get example data from PismoSzyteNaMiare |
| `example_post` | Post data to PismoSzyteNaMiare |

## Architecture

This MCP server is a thin client over the [PismoSzyteNaMiare REST API](https://pismoszytenamiare.pl/docs).
All requests are forwarded to `https://pismoszytenamiare.pl` — no data is processed or stored here.

| Transport | Usage |
|-----------|-------|
| **stdio** | `npx pismoszytenamiare-mcp` — for local Claude Desktop |
| **HTTP** | `https://softvoyagers-pismoszytenamiare-mcp.azurewebsites.net/mcp` — for Glama & remote |

## Part of SoftVoyagers

Part of the [SoftVoyagers](https://github.com/softvoyagers) free API portfolio.

| Product | Domain |
|---------|--------|
| LinkMeta | [linkmeta.dev](https://linkmeta.dev) |
| PageShot | [pageshot.site](https://pageshot.site) |
| PDFSpark | [pdfspark.dev](https://pdfspark.dev) |
| OGForge | [ogforge.dev](https://ogforge.dev) |
| LinkShrink | [linkshrink.dev](https://linkshrink.dev) |
| Faktuj | [faktuj.pl](https://faktuj.pl) |
| QRMint | [qrmint.dev](https://qrmint.dev) |
| PageDrop | [pagedrop.dev](https://pagedrop.dev) |
