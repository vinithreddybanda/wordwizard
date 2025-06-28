import { useState } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`)
      if (!res.ok) throw new Error('Word not found')
      const data = await res.json()
      setResult(data[0])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ww-container">
      <h1>Word Wizard</h1>
      <form className="ww-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Type a word..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search for a word"
        />
        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <div className="ww-error">{error}</div>}
      {result && (
        <div className="ww-result">
          <h2>{result.word}</h2>
          {result.phonetic && <div className="ww-phonetic">/{result.phonetic}/</div>}
          {result.meanings.map((meaning, i) => (
            <div key={i} className="ww-meaning">
              <div className="ww-partofspeech">{meaning.partOfSpeech}</div>
              <ul>
                {meaning.definitions.map((def, j) => (
                  <li key={j}>
                    <span>{def.definition}</span>
                    {def.example && <div className="ww-example">"{def.example}"</div>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
