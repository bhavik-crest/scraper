'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const count = 10
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [filteredQuotes, setFilteredQuotes] = useState([])

  // fetchQuotes now supports isRefresh to show compact button loader vs full overlay
  const fetchQuotes = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const res = await fetch(`http://localhost:8000/api/quotes?count=${count}`)
      const data = await res.json()
      const quotesWithId = data.quotes.map((q, i) => ({
        id: Date.now() + i,
        ...q
      }))
      setQuotes(quotesWithId)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      if (isRefresh) setRefreshing(false)
      else setLoading(false)
    }
  }

  useEffect(() => { fetchQuotes() }, [])

  useEffect(() => {
    const filtered = quotes.filter(q =>
      q.text.toLowerCase().includes(search.toLowerCase()) ||
      q.author.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredQuotes(filtered)
  }, [quotes, search])

  return (
    <div className="bg-neutral-900 text-neutral-100 min-h-screen relative">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-100">Quote Garden</h1>
            <p className="mt-1 text-sm text-neutral-400">Daily inspiration — quick, simple, beautiful.</p>
          </div>

          {/* Search */}
          <div className="w-full sm:w-auto flex items-center gap-3">
            <div className="relative w-full sm:w-[420px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <input
                type="text"
                placeholder="Search quotes or authors..."
                className="pl-10 pr-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 placeholder-neutral-500 focus:ring-2 focus:ring-indigo-500 outline-none w-full text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              onClick={() => fetchQuotes(true)}
              className="cursor-pointer px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium hover:opacity-95 active:scale-95 transition flex items-center gap-2 text-sm shadow-md"
            >
              {refreshing ? (
                <>
                  <svg className="w-4 h-4 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>Refreshing</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-white opacity-90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 20v-6h-6" />
                  </svg>
                  <span>Refresh</span>
                </>
              )}
            </button>

            <button
              onClick={() => router.push('/')}
              className="cursor-pointer px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium hover:opacity-95 active:scale-95 transition flex items-center gap-2 text-sm shadow-md"
            ><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Books</button>
          </div>
        </div>
      </header>

      {/* Full-screen attractive loader overlay (used for initial load / heavy load) */}
      {loading && quotes.length === 0 && (
        <div className="absolute inset-0 z-40 flex items-center justify-center">
          <div className="bg-neutral-800/95 backdrop-blur-sm rounded-2xl p-8 max-w-4xl w-full mx-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-pink-500 to-yellow-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg animate-bounce">
                “
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Loading fresh quotes</h2>
                <p className="text-sm text-neutral-400 mt-1">Fetching thoughtful and inspiring quotes for you…</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Simple pulsing skeleton cards */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-5 rounded-xl bg-neutral-700 animate-pulse space-y-3">
                  <div className="h-4 w-3/4 bg-neutral-600 rounded"></div>
                  <div className="h-3 w-5/6 bg-neutral-600 rounded"></div>
                  <div className="mt-4 h-3 w-1/3 bg-neutral-600 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quotes Grid */}
      <div className="mt-6 max-w-6xl mx-auto px-5 pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredQuotes.map((quote) => (
          <div
            key={quote.id}
            className="p-6 rounded-xl bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transform hover:-translate-y-1 transition-shadow duration-150 shadow-sm hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                {quote.author ? quote.author.trim().charAt(0).toUpperCase() : 'Q'}
              </div>
              <div className="flex-1">
                <p className="text-lg leading-relaxed mt-2 text-neutral-200">
                  “{quote.text}”
                </p>

                <p className="mt-4 text-sm font-medium text-neutral-400">
                  — {quote.author || 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredQuotes.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="max-w-xl mx-auto">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-neutral-100 mb-2">No matching quotes</h3>
            <p className="text-sm text-neutral-400 mb-4">Try a different search or refresh to load new quotes.</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => fetchQuotes(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium hover:opacity-95 transition"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline lightweight loading handled by button spinner when refreshing */}
      {/* ...existing code... */}

    </div>
  )
}