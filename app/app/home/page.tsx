'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import API from '@/lib/api'
export default function Home() {
  const [events, setEvents] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  const categories = ['all', 'concert', 'festival', 'art', 'food', 'sport', 'nightlife', 'film', 'tech', 'fashion', 'community', 'religious']

  useEffect(() => {
    async function fetchEvents() {
      const res = await fetch(`${API}/api/events`)
      const data = await res.json()
      setEvents(data)
      setFiltered(data)
      setLoading(false)
    }
    fetchEvents()
  }, [])

  function filterCategory(cat: string) {
    setActiveCategory(cat)
    if (cat === 'all') return setFiltered(events)
    setFiltered(events.filter((e: any) => e.category === cat))
  }

  if (loading) return (
    <div className="bg-[#F5F5F5] min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  return (
    <div className="bg-[#F5F5F5]">
    <div className="bg-[#F5F5F5] min-h-screen pb-24 w-full max-w-[1000px] m-auto">

      {/* Header */}
      <div className="px-5 pt-10 pb-4 bg-white">
        <h1 className="text-2xl font-bold text-[#FF6B35]">Nu</h1>
        <p className="text-gray-400 text-sm">📍 Addis Ababa</p>
      </div>

      {/* Search Bar */}
      <div className="px-5 py-4 bg-white">
        <div className="bg-[#F5F5F5] rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search events, ideas..."
            className="bg-transparent outline-none text-sm text-gray-600 w-full"
            onChange={(e) => {
              const q = e.target.value.toLowerCase()
              setFiltered(events.filter((ev: any) =>
                ev.title.toLowerCase().includes(q)
              ))
            }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-5 py-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4">
          <p className="text-xl font-bold text-gray-800">{events.length}</p>
          <p className="text-xs text-gray-400">Events</p>
        </div>
        <div className="bg-white rounded-2xl p-4">
          <p className="text-xl font-bold text-gray-800">0</p>
          <p className="text-xs text-gray-400">Ideas</p>
        </div>
        <div className="bg-white rounded-2xl p-4">
          <p className="text-xl font-bold text-gray-800">0</p>
          <p className="text-xs text-gray-400">Votes</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-5 pb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => filterCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium transition-all ${
              activeCategory === cat
                ? 'bg-[#1a1a1a] text-white'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Events */}
      <div className="px-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Upcoming Events</h2>
          <span className="text-[#FF6B35] text-sm">See all</span>
        </div>

        {filtered.length === 0
          ? <p className="text-gray-400 text-center mt-10">No events found</p>
          : filtered.map((event: any) => (
            <Link href={`/event/${event._id}`} key={event._id}>
              <div className="bg-white rounded-2xl overflow-hidden mb-4 shadow-sm">

                {/* Image */}
                {event.coverImage
                  ? <div className="w-full h-[200px] overflow-hidden relative">
                      <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-white text-xs font-semibold px-3 py-1 rounded-full text-gray-700">
                        {event.category}
                      </span>
                    </div>
                  : <div className="w-full h-[120px] bg-[#F5F5F5] flex items-center justify-center">
                      <span className="text-gray-300 text-4xl">🎟️</span>
                    </div>
                }

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-gray-800 font-bold text-base">{event.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-gray-400 text-xs">📅 {new Date(event.date).toLocaleDateString()}</p>
                    <p className="text-gray-400 text-xs">📍 {event.location.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex gap-2">
                      <span className="text-xs text-gray-500">👍 {event.votes.interested}</span>
                      <span className="text-xs text-gray-500">🔥 {event.votes.veryInterested}</span>
                      <span className="text-xs text-gray-500">🎟️ {event.votes.wouldAttend}</span>
                    </div>
                    {event.isTrending && (
                      <span className="bg-[#FF6B35] text-white text-xs px-3 py-1 rounded-full">Trending</span>
                    )}
                  </div>
                </div>

              </div>
            </Link>
          ))
        }
      </div>

      <BottomNav />
    </div>
    </div>
  )
}