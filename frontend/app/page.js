'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const count = 10
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [filteredBooks, setFilteredBooks] = useState([])

  const fetchBooks = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books?count=${count}`)
      const data = await res.json()
      const booksWithId = data.books.map((b, i) => ({
        id: Date.now() + i,
        ...b
      }))
      setBooks(booksWithId)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      if (isRefresh) setRefreshing(false)
      else setLoading(false)
    }
  }

  useEffect(() => { fetchBooks() }, [])

  useEffect(() => {
    const filtered = books.filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredBooks(filtered)
  }, [books, search])


  const getStarCount = (rating) => {
    const ratingMap = {
      'Five': 5,
      'Four': 4,
      'Three': 3,
      'Two': 2,
      'One': 1,
      'None': 0
    }
    return ratingMap[rating] || 0
  }

  return (
    <div className="bg-neutral-900 text-neutral-100 min-h-screen relative">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-neutral-900/75 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-100">Book Store</h1>
            <p className="mt-1 text-sm text-neutral-400">Curated picks & bestsellers — quick, simple, beautiful.</p>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <div className="relative w-full sm:w-[420px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <input
                type="text"
                placeholder="Search books by title..."
                className="pl-10 pr-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 placeholder-neutral-500 focus:ring-2 focus:ring-indigo-500 outline-none w-full text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              onClick={() => fetchBooks(true)}
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
              onClick={() => router.push('/quotes')}
              className="cursor-pointer px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium hover:opacity-95 active:scale-95 transition flex items-center gap-2 text-sm shadow-md"
            ><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
  <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h7m-7 4h5M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16l-3-2-3 2-3-2-3 2z" />
</svg>

              Quotes</button>
          </div>
        </div>
      </header>

      {/* Full-screen modern loader when no data */}
      {loading && books.length === 0 && (
        <div className="mt-5 absolute inset-0 z-40 flex items-center justify-center px-4">
          <div className="bg-neutral-800/95 backdrop-blur-sm rounded-2xl p-6 max-w-5xl w-full">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 via-pink-500 to-rose-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                📚
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-100">Loading the latest books</h2>
                <p className="text-sm text-neutral-400 mt-1">Hang tight — gathering recommendations and cover images.</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 rounded-xl bg-gradient-to-r from-neutral-700 to-neutral-800 overflow-hidden relative">
                  <div className="h-36 bg-neutral-700 rounded-md mb-3 animate-pulse"></div>
                  <div className="h-3 bg-neutral-600 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-neutral-600 rounded w-1/2 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="mt-6 max-w-6xl mx-auto px-5 pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="p-5 rounded-2xl bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transform hover:-translate-y-1 shadow-lg hover:shadow-xl transition-all duration-200 group"
          >
            <div className="relative">
              <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-neutral-700 flex items-center justify-center">
                {book.image_url ? (
                  <img
                    src={book.image_url}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-pink-500">
                    <span className="text-4xl">📚</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-2 gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-neutral-100 leading-tight truncate">{book.title}</h3>
                  <p className="text-sm text-neutral-400 mt-1 truncate">{book.author || 'Unknown author'}</p>
                </div>
                <div className="ml-3 inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-xs font-semibold text-white shadow-sm">
                  {book.price || '—'}
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-[2px]">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={`star-${book.id}-${i}`}
                      className={`text-sm transition-all ${i < getStarCount(book.rating)
                        ? 'text-yellow-400'
                        : 'text-neutral-500/30'
                        }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-2 text-xs text-neutral-400">({getStarCount(book.rating) || '—'})</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={book.detail_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm px-3 py-1 rounded-md bg-neutral-900/60 border border-neutral-700 text-indigo-300 hover:bg-neutral-900/70 transition"
                  >
                    View
                  </a>

                  <a
                    href={book.buy_url || book.detail_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-sm"
                  >
                    Buy
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBooks.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="max-w-xl mx-auto">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-neutral-100 mb-2">No matching books</h3>
            <p className="text-sm text-neutral-400 mb-4">Try a different search or refresh to load new recommendations.</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => fetchBooks(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium hover:opacity-95 transition"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}