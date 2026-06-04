'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import BottomNav from "@/components/BottomNav"

export default function Explore() {
  const [events, setEvents] = useState<any[]>([])
  const [ideas, setIdeas] = useState<any[]>([])
  const [filteredEvents, setFilteredEvents] = useState<any[]>([])
  const [filteredIdeas, setFilteredIdeas] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'events' | 'ideas'>('events')
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

  const categories = ['all', 'concert', 'festival', 'art', 'food', 'sport', 'nightlife', 'film', 'tech', 'fashion', 'community', 'religious']

  useEffect(() => {
    async function getevents() {
      const res = await fetch('http://localhost:5000/api/events')
      const data = await res.json()
      setEvents(data)
      setFilteredEvents(data)
    }
    async function getideas() {
      const res = await fetch('http://localhost:5000/api/ideas')
      const data = await res.json()
      setIdeas(data)
      setFilteredIdeas(data)
    }
    getevents()
    getideas()
  }, [])

  function handleSearch(q: string) {
    setSearch(q)
    const lower = q.toLowerCase()
    setFilteredEvents(events.filter(e => e.title.toLowerCase().includes(lower)))
    setFilteredIdeas(ideas.filter(i => i.title.toLowerCase().includes(lower)))
  }

  function handleCategory(cat: string) {
    setActiveCategory(cat)
    if (cat === 'all') {
      setFilteredEvents(events)
      setFilteredIdeas(ideas)
    } else {
      setFilteredEvents(events.filter(e => e.category === cat))
      setFilteredIdeas(ideas.filter(i => i.category === cat))
    }
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-24">

      {/* Header */}
      <div className="px-5 pt-10 pb-4 bg-white">
        <h1 className="text-gray-800 text-2xl font-bold">Explore</h1>
      </div>

      {/* Search */}
      <div className="px-5 py-3 bg-white">
        <div className="bg-[#F5F5F5] rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search everything..."
            className="bg-transparent outline-none text-sm text-gray-600 w-full"
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-5 py-3 bg-white flex gap-2 overflow-x-auto scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium transition-all ${
              activeCategory === cat
                ? 'bg-[#1a1a1a] text-white'
                : 'bg-[#F5F5F5] text-gray-500'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex mx-5 my-4 bg-white rounded-2xl p-1">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'events' ? 'bg-[#1a1a1a] text-white' : 'text-gray-400'
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveTab('ideas')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'ideas' ? 'bg-[#1a1a1a] text-white' : 'text-gray-400'
          }`}
        >
          Ideas
        </button>
      </div>

      {/* Content */}
      <div className="px-5">

        {activeTab === 'events' ? (
          filteredEvents.length === 0
            ? <p className="text-gray-400 text-center mt-10">No events found</p>
            : filteredEvents.map((event: any) => (
              <Link href={`/event/${event._id}`} key={event._id}>
                <div className="bg-white rounded-2xl overflow-hidden mb-4 shadow-sm">
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
                  <div className="p-4">
                    <h3 className="text-gray-800 font-bold">{event.title}</h3>
                    <div className="flex gap-4 mt-2">
                      <p className="text-gray-400 text-xs">📅 {new Date(event.date).toLocaleDateString()}</p>
                      <p className="text-gray-400 text-xs">📍 {event.location.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-500">
                        🔥 {event.votes.interested + event.votes.veryInterested + event.votes.wouldAttend + event.votes.wouldPay} interested
                      </span>
                      {event.isTrending && (
                        <span className="bg-[#FF6B35] text-white text-xs px-3 py-1 rounded-full">Trending</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
        ) : (
          filteredIdeas.length === 0
            ? <p className="text-gray-400 text-center mt-10">No ideas found</p>
            : filteredIdeas.map((idea: any) => (
               <Link href={`/idea/${idea._id}`} key={idea._id}>
              <div key={idea._id} className="bg-white rounded-2xl p-4 mb-4 shadow-sm flex gap-4">
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <span className="bg-[#F0F9FF] text-blue-500 text-xs px-2 py-1 rounded-full">{idea.category}</span>
                    {idea.isTrending && <span className="bg-[#FFF0EA] text-[#FF6B35] text-xs px-2 py-1 rounded-full">🔥 Trending</span>}
                  </div>
                  <h3 className="text-gray-800 font-bold text-sm">{idea.title}</h3>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-2">{idea.description}</p>
                  <div className="flex gap-3 mt-3">
                    <span className="text-xs text-gray-400">👍 {idea.interested} interested</span>
                    <span className="text-xs text-gray-400">💰 {idea.wouldPay} would pay</span>
                    <span className="text-xs text-gray-400">💬 {idea.comments.length}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center bg-[#FFF0EA] rounded-xl px-3 py-2 min-w-[50px]">
                  <span className="text-[#FF6B35] text-lg">↑</span>
                  <span className="text-[#FF6B35] font-bold text-lg">{idea.votes}</span>
                </div>
              </div>
              </Link>
            ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}