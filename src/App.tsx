import { useState, useRef, useCallback } from 'react'
import JsonNode from './components/JsonNode'

const SAMPLE_JSON = `{
  "name": "JSON Prism",
  "version": "1.0.0",
  "description": "A beautiful JSON viewer with interactive tree visualization",
  "features": [
    "Syntax highlighting",
    "Collapsible nodes",
    "Copy to clipboard",
    "Dark theme"
  ],
  "stats": {
    "downloads": 12500,
    "stars": 342,
    "license": "MIT"
  },
  "isAwesome": true,
  "dependencies": null
}`

function App() {
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON)
  const [parsedJson, setParsedJson] = useState<unknown>(JSON.parse(SAMPLE_JSON))
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleParse = useCallback((value: string) => {
    setJsonInput(value)
    if (!value.trim()) {
      setParsedJson(null)
      setError(null)
      return
    }
    try {
      const parsed = JSON.parse(value)
      setParsedJson(parsed)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setParsedJson(null)
    }
  }, [])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      handleParse(content)
    }
    reader.readAsText(file)
  }, [handleParse])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(jsonInput)
  }, [jsonInput])

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput)
      setJsonInput(JSON.stringify(parsed, null, 2))
      setParsedJson(parsed)
      setError(null)
    } catch (e) {
      // Already showing error
    }
  }, [jsonInput])

  const handleClear = useCallback(() => {
    setJsonInput('')
    setParsedJson(null)
    setError(null)
    setFileName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleLoadSample = useCallback(() => {
    setJsonInput(SAMPLE_JSON)
    setParsedJson(JSON.parse(SAMPLE_JSON))
    setError(null)
    setFileName('')
  }, [])

  const countNodes = useCallback((obj: unknown): { keys: number; total: number } => {
    if (obj === null || typeof obj !== 'object') {
      return { keys: 0, total: 1 }
    }
    let keys = 0
    let total = 1
    if (Array.isArray(obj)) {
      for (const item of obj) {
        const counts = countNodes(item)
        keys += counts.keys
        total += counts.total
      }
    } else {
      for (const key of Object.keys(obj)) {
        keys++
        const counts = countNodes((obj as Record<string, unknown>)[key])
        keys += counts.keys
        total += counts.total
      }
    }
    return { keys, total }
  }, [])

  const stats = parsedJson ? countNodes(parsedJson) : { keys: 0, total: 0 }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <svg className="logo-icon" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#6366f1' }} />
                <stop offset="100%" style={{ stopColor: '#8b5cf6' }} />
              </linearGradient>
            </defs>
            <rect x="10" y="10" width="80" height="80" rx="12" fill="url(#logoGrad)" />
            <text x="50" y="62" fontFamily="monospace" fontSize="28" fontWeight="bold" fill="white" textAnchor="middle">{}</text>
          </svg>
          <span className="logo-text">JSON Prism</span>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleLoadSample}>
            Load Sample
          </button>
          <button className="btn btn-secondary" onClick={handleClear}>
            Clear
          </button>
          <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>
            📁 Open File
          </button>
        </div>
      </header>

      <main className="main">
        <div className="input-section">
          <label className="input-label">
            {fileName ? `📄 ${fileName}` : 'Paste JSON or upload a file:'}
          </label>
          <textarea
            className="json-input"
            value={jsonInput}
            onChange={(e) => handleParse(e.target.value)}
            placeholder='{"key": "value"}'
            spellCheck={false}
          />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden-input"
            accept=".json,.txt"
            onChange={handleFileUpload}
          />
          {error && <div className="error-message">⚠️ {error}</div>}
        </div>

        <div className="viewer-section">
          <div className="viewer-header">
            <span className="input-label">Visual Tree View</span>
            <div className="viewer-stats">
              <span className="stat">
                🔑 Keys: <span className="stat-value">{stats.keys}</span>
              </span>
              <span className="stat">
                📊 Nodes: <span className="stat-value">{stats.total}</span>
              </span>
              <button className="btn btn-secondary" onClick={handleCopy} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                📋 Copy
              </button>
              <button className="btn btn-secondary" onClick={handleFormat} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                🔧 Format
              </button>
            </div>
          </div>

          <div className="json-viewer">
            {parsedJson !== null && parsedJson !== undefined ? (
              <div className="json-node">
                <JsonNode value={parsedJson} />
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">{}</div>
                <div className="empty-text">Enter valid JSON to see the visualization</div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        JSON Prism — Built with React + TypeScript
      </footer>
    </div>
  )
}

export default App
