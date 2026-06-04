'use client'
import BottomNav from '@/components/BottomNav'
import { useEffect, useState, use } from "react"
import { useRouter } from 'next/navigation'
import API from '@/lib/api'
export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [votes, setVotes] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchEvent() {
      const res = await fetch(`${API}/api/event/${id}`)
      const data = await res.json()
      setEvent(data)
      setVotes(data.votes)
      setLoading(false)
    }
    fetchEvent()
  }, [id])

  async function handleVote(type: string) {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API}/api/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ event: id, type })
    })
    const data = await res.json()
    if (!res.ok) return
    setVotes((prev: any) => ({
      ...prev,
      [type]: prev[type] + 1
    }))
  }

  async function handleComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const comment = (form.elements.namedItem('comment') as HTMLInputElement).value
    const token = localStorage.getItem('token')
    const res = await fetch(`${API}/api/event/${id}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text: comment })
    })
    const data = await res.json()
    if (!res.ok) return
    setEvent((prev: any) => ({
      ...prev,
      comments: [...prev.comments, { text: comment, user: { name: 'You' } }]
    }))
    form.reset()
  }

  if (loading) return (
    <div className="bg-[#F5F5F5] min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  if (!event) return (
    <div className="bg-[#F5F5F5] min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Event not found</p>
    </div>
  )

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-24">

      {/* Cover Image with back button */}
      <div className="relative">
        {event.coverImage
          ? <div className="w-full h-[280px] overflow-hidden">
              <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
            </div>
          : <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center">
              <span className="text-gray-300 text-6xl">🎟️</span>
            </div>
        }

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-10 left-4 bg-white rounded-full p-2 shadow-md"
        >
          ←
        </button>

        {/* Category badge */}
        <span className="absolute bottom-4 left-4 bg-white text-xs font-semibold px-3 py-1 rounded-full text-gray-700">
          {event.category}
        </span>
      </div>

      <div className="w-full max-w-[600px] m-auto">

        {/* Event Info */}
        <div className="bg-white px-5 py-5">
          <h1 className="text-gray-800 text-2xl font-bold">{event.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-400">👤 {event.postedBy?.name}</span>
            {event.isOrganizer && (
              <span className="bg-[#FFF0EA] text-[#FF6B35] text-xs px-2 py-0.5 rounded-full">Organizer</span>
            )}
          </div>
        </div>

        {/* Date and Location */}
        <div className="grid grid-cols-2 gap-3 px-5 py-4">
          <div className="bg-white rounded-2xl p-4">
            <p className="text-[#FF6B35] text-xs mb-1">📅 Date & Time</p>
            <p className="text-gray-800 font-semibold text-sm">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <p className="text-[#FF6B35] text-xs mb-1">📍 Location</p>
            <p className="text-gray-800 font-semibold text-sm">{event.location.description}</p>
          </div>
        </div>

        {/* About */}
        <div className="bg-white mx-5 rounded-2xl p-4 mb-4">
          <h2 className="text-gray-800 font-bold mb-2">About</h2>
          <p className="text-gray-500 text-sm leading-relaxed">{event.description}</p>
        </div>

        {/* Vote Buttons */}
        <div className="bg-white mx-5 rounded-2xl p-4 mb-4">
          <h2 className="text-gray-800 font-bold mb-3">Show your interest</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { type: 'interested', emoji: '👍', label: 'Interested' },
              { type: 'veryInterested', emoji: '🔥', label: 'Very Interested' },
              { type: 'wouldAttend', emoji: '🎟️', label: 'Would Attend' },
              { type: 'wouldPay', emoji: '💰', label: 'Would Pay' },
            ].map(({ type, emoji, label }) => (
              <button
                key={type}
                onClick={() => handleVote(type)}
                className="flex items-center justify-between bg-[#F5F5F5] hover:bg-[#FFF0EA] rounded-xl px-4 py-3 transition-all"
              >
                <span className="text-sm text-gray-600">{emoji} {label}</span>
                <span className="text-[#FF6B35] font-bold text-sm">{votes?.[type] || 0}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white mx-5 rounded-2xl p-4 mb-4">
          <h2 className="text-gray-800 font-bold mb-4">Comments</h2>

          <form onSubmit={handleComment} className="flex gap-3 mb-4">
            <input
              type="text"
              name="comment"
              placeholder="Say something..."
              className="flex-1 bg-[#F5F5F5] rounded-xl px-4 py-3 text-sm outline-none text-gray-700"
            />
            <button
              type="submit"
              className="bg-[#FF6B35] text-white font-semibold px-4 py-2 rounded-xl"
            >
              Post
            </button>
          </form>

          {event.comments.length === 0
            ? <p className="text-gray-400 text-sm">No comments yet. Be the first.</p>
            : event.comments.map((comment: any, index: number) => (
              <div key={index} className="bg-[#F5F5F5] rounded-xl px-4 py-3 mb-2">
                <p className="text-[#FF6B35] text-xs font-semibold mb-1">{comment.user?.name || 'Anonymous'}</p>
                <p className="text-gray-700 text-sm">{comment.text}</p>
              </div>
            ))
          }
        </div>

      </div>

      <BottomNav />
    </div>
  )
}