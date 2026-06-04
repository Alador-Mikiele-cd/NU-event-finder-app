'use client'
import BottomNav from '@/components/BottomNav'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '@/lib/api'
export default function Profile() {
  const [events, setEvents] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [ideasCount, setIdeasCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    async function getData() {
      const token = localStorage.getItem('token')

      const [eventsRes, userRes , ideasRes] = await Promise.all([
        fetch(`${API}/api/events/user`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
         fetch(`${API}/api/ideas/user`, {
  headers: { Authorization: `Bearer ${token}` }
})

      ])

      const eventsData = await eventsRes.json()
      const userData = await userRes.json()
       const ideasData = await ideasRes.json()
if (Array.isArray(ideasData)) setIdeasCount(ideasData.length)
      if (Array.isArray(eventsData)) setEvents(eventsData)
      setUser(userData)
    }
    getData()
  }, [])

  function logout() {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-24">

      {/* Header */}
      <div className="flex justify-between items-center px-5 pt-10 pb-4 bg-white">
        <h1 className="text-gray-800 font-bold text-lg">Profile</h1>
        <button className="text-gray-400">⚙️</button>
      </div>

      <div className="w-full max-w-[600px] m-auto px-5">

        {/* User Card */}
        {user && (
          <div className="bg-white rounded-2xl p-6 mt-4 text-center">
            <div className="bg-[#FFF0EA] text-[#FF6B35] text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center m-auto mb-3">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-gray-800 font-bold text-lg">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="bg-white rounded-2xl p-3 text-center">
            <p className="text-gray-800 font-bold text-lg">{events.length}</p>
            <p className="text-gray-400 text-xs">Events</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center">
            <p className="text-gray-800 font-bold text-lg">{ideasCount}</p>
            <p className="text-gray-400 text-xs">Ideas</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center">
            <p className="text-gray-800 font-bold text-lg">0</p>
            <p className="text-gray-400 text-xs">Votes</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center">
            <p className="text-[#FF6B35] font-bold text-lg">100%</p>
            <p className="text-gray-400 text-xs">Score</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 mt-4 w-full text-red-400 text-sm font-semibold"
        >
          → Log Out
        </button>

        {/* Events Posted */}
        {events.length > 0 && (
          <div className="mt-6">
            <h2 className="text-gray-800 font-bold mb-4">My Events</h2>
            {events.map((event: any) => (
              <Link href={`/event/${event._id}`} key={event._id}>
                <div className="bg-white rounded-2xl overflow-hidden mb-4 shadow-sm">
                  {event.coverImage
                    ? <div className="w-full h-[150px] overflow-hidden">
                        <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                    : <div className="w-full h-[80px] bg-[#F5F5F5] flex items-center justify-center">
                        <span className="text-gray-300 text-3xl">🎟️</span>
                      </div>
                  }
                  <div className="p-4">
                    <h3 className="text-gray-800 font-bold text-sm">{event.title}</h3>
                    <p className="text-gray-400 text-xs mt-1">📅 {new Date(event.date).toLocaleDateString()} • 📍 {event.location.description}</p>
                    <div className="flex gap-3 mt-2">
                      <span className="text-xs text-gray-500">👍 {event.votes.interested}</span>
                      <span className="text-xs text-gray-500">🔥 {event.votes.veryInterested}</span>
                      <span className="text-xs text-gray-500">🎟️ {event.votes.wouldAttend}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>

      <BottomNav />
    </div>
  )
}