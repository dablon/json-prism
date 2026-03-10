# JSON Prism

Beautiful JSON viewer with interactive tree visualization.

![JSON Prism](https://img.shields.io/badge/JSON-Prism-6366f1?style=flat&logo=json)

## Features

- 🎨 **Syntax highlighting** - Colors for strings, numbers, booleans, null, keys
- 🌳 **Interactive tree** - Collapsible nodes with expand/collapse
- 📁 **File upload** - Load JSON from local files
- 📋 **Copy & Format** - One-click copy and auto-format
- 🌙 **Dark theme** - Modern dark UI
- 📊 **Stats** - Shows key count and total nodes

## Demo

Try pasting this JSON:

```json
{
  "name": "JSON Prism",
  "version": "1.0.0",
  "features": ["syntax highlighting", "collapsible nodes"],
  "stats": { "downloads": 12500, "stars": 342 }
}
```

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Docker

```bash
# Build
docker build -t json-prism .

# Run
docker run -p 80:80 json-prism
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Vitest

## License

MIT
