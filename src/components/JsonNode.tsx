import { useState, useCallback } from 'react'

interface JsonNodeProps {
  value: unknown
  depth?: number
}

function JsonNode({ value, depth = 0 }: JsonNodeProps) {
  const [expanded, setExpanded] = useState(depth < 3)

  const toggle = useCallback(() => {
    setExpanded(prev => !prev)
  }, [])

  if (value === null) {
    return <span className="json-value-null">null</span>
  }

  if (typeof value === 'boolean') {
    return <span className="json-value-boolean">{value.toString()}</span>
  }

  if (typeof value === 'number') {
    return <span className="json-value-number">{value}</span>
  }

  if (typeof value === 'string') {
    return <span className="json-value-string">"{value}"</span>
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="json-bracket">[]</span>
    }

    return (
      <>
        <button className={`toggle-btn ${expanded ? 'expanded' : ''}`} onClick={toggle}>
          ▶
        </button>
        <span className="json-bracket">[</span>
        {!expanded && <span className="json-text-muted"> {value.length} items </span>}
        {expanded && (
          <div className="children">
            {value.map((item, index) => (
              <div key={index} className="json-row">
                <span className="json-value-number">{index}</span>
                <span className="json-colon">:</span>
                <JsonNode value={item} depth={depth + 1} />
                {index < value.length - 1 && ','}
              </div>
            ))}
          </div>
        )}
        <span className="json-bracket">]</span>
      </>
    )
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) {
      return <span className="json-bracket">{'{}'}</span>
    }

    return (
      <>
        <button className={`toggle-btn ${expanded ? 'expanded' : ''}`} onClick={toggle}>
          ▶
        </button>
        <span className="json-bracket">{'{'}</span>
        {!expanded && <span className="json-text-muted"> {entries.length} keys </span>}
        {expanded && (
          <div className="children">
            {entries.map(([key, val], index) => (
              <div key={key} className="json-row">
                <span className="json-key">"{key}"</span>
                <span className="json-colon">:</span>
                <JsonNode value={val} depth={depth + 1} />
                {index < entries.length - 1 && ','}
              </div>
            ))}
          </div>
        )}
        <span className="json-bracket">{'}'}</span>
      </>
    )
  }

  return <span>{String(value)}</span>
}

export default JsonNode
