import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'
import JsonNode from '../components/JsonNode'

describe('JsonNode', () => {
  it('renders null correctly', () => {
    render(<JsonNode value={null} />)
    expect(screen.getByText('null')).toBeInTheDocument()
  })

  it('renders string with quotes', () => {
    render(<JsonNode value="hello" />)
    expect(screen.getByText('"hello"')).toBeInTheDocument()
  })

  it('renders number correctly', () => {
    render(<JsonNode value={42} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders boolean correctly', () => {
    render(<JsonNode value={true} />)
    expect(screen.getByText('true')).toBeInTheDocument()
    render(<JsonNode value={false} />)
    expect(screen.getByText('false')).toBeInTheDocument()
  })

  it('renders empty array', () => {
    render(<JsonNode value={[]} />)
    expect(screen.getByText('[]')).toBeInTheDocument()
  })

  it('renders array with items', () => {
    render(<JsonNode value={[1, 2, 3]} />)
    // Check for bracket and array content
    expect(screen.getByText('[')).toBeInTheDocument()
    expect(screen.getByText(']')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('renders empty object', () => {
    render(<JsonNode value={{}} />)
    expect(screen.getByText('{}')).toBeInTheDocument()
  })

  it('renders object with keys', () => {
    render(<JsonNode value={{ name: 'test', count: 5 }} />)
    expect(screen.getByText('"name"')).toBeInTheDocument()
    expect(screen.getByText('"test"')).toBeInTheDocument()
    expect(screen.getByText('"count"')).toBeInTheDocument()
  })

  it('renders nested objects', () => {
    render(<JsonNode value={{ user: { id: 1, name: 'John' } }} />)
    expect(screen.getByText('"user"')).toBeInTheDocument()
    expect(screen.getByText('"id"')).toBeInTheDocument()
    expect(screen.getByText('"name"')).toBeInTheDocument()
  })

  it('renders mixed types in array', () => {
    render(<JsonNode value={[1, 'two', true, null, { key: 'value' }]} />)
    // Check for array brackets
    expect(screen.getByText('[')).toBeInTheDocument()
    expect(screen.getByText(']')).toBeInTheDocument()
    // Check for different value types
    expect(screen.getByText('"two"')).toBeInTheDocument()
    expect(screen.getByText('true')).toBeInTheDocument()
    expect(screen.getByText('null')).toBeInTheDocument()
    expect(screen.getByText('"key"')).toBeInTheDocument()
  })
})

describe('App', () => {
  it('renders app title', () => {
    render(<App />)
    expect(screen.getByText('JSON Prism')).toBeInTheDocument()
  })

  it('renders sample JSON by default', () => {
    render(<App />)
    expect(screen.getByText('"name"')).toBeInTheDocument()
    expect(screen.getByText('"JSON Prism"')).toBeInTheDocument()
  })

  it('shows empty state when cleared', () => {
    render(<App />)
    const clearBtn = screen.getByText('Clear')
    fireEvent.click(clearBtn)
    // Check that the empty state message appears
    const emptyMessage = screen.getByText((content) => 
      content.includes('Enter valid JSON')
    )
    expect(emptyMessage).toBeInTheDocument()
  })

  it('displays stats', () => {
    render(<App />)
    // Stats are shown with emoji prefix
    const keysStat = screen.getByText((content) => content.includes('Keys:'))
    const nodesStat = screen.getByText((content) => content.includes('Nodes:'))
    expect(keysStat).toBeInTheDocument()
    expect(nodesStat).toBeInTheDocument()
  })
})
