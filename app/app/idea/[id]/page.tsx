'use client'
import { useEffect, useState, use } from "react"
import BottomNav from "@/components/BottomNav"

export default function IdeaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getideas() {
      const res = await fetch(`http://localhost:5000/api/idea/${id}`)
      const data = await res.json()
      setEvent(data)
      setLoading(false)
    }
    getideas()
  }, [id])

  async function handleComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const comment = (form.elements.namedItem('comment') as HTMLInputElement).value
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:5000/api/idea/${id}/comment`, {
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
      comments: [...(prev.comments || []), { text: comment, user: { name: 'You' } }]
    }))
    form.reset()
  }

async function handleVote(type: 'vote' | 'interested' | 'wouldPay') {
  const token = localStorage.getItem('token')
  const reactedKey = `reacted_${id}`
  const reacted = JSON.parse(localStorage.getItem(reactedKey) || '[]')

  if (type !== 'vote' && reacted.includes(type)) {
    return alert('You already reacted')
  }

  if (type === 'vote') {
    const res = await fetch(`http://localhost:5000/api/idea/${id}/vote`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    if (!res.ok) return
    setEvent((prev: any) => ({ ...prev, votes: data.votes }))
  } else {
    const res = await fetch(`http://localhost:5000/api/idea/${id}/react`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ type })
    })
    const data = await res.json()
    if (!res.ok) return

    // Save to localStorage
    localStorage.setItem(reactedKey, JSON.stringify([...reacted, type]))
    setEvent((prev: any) => ({ ...prev, [type]: data[type] }))
  }
}
  if (loading) return (
    <div className="bg-[#F5F5F5] min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  if (!event) return (
    <div className="bg-[#F5F5F5] min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Not found</p>
    </div>
  )

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-24">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-10 pb-4 bg-white">
        <button onClick={() => window.history.back()} className="text-gray-400 text-lg">←</button>
        <h1 className="text-gray-800 font-semibold">Idea</h1>
      </div>

      <div className="w-full max-w-[600px] m-auto px-5 py-6">

        {/* Category and Trending */}
        <div className="flex gap-2 mb-3">
          <span className="bg-[#F0F9FF] text-blue-500 text-xs px-3 py-1 rounded-full">{event.category}</span>
          {event.isTrending && (
            <span className="bg-[#FFF0EA] text-[#FF6B35] text-xs px-3 py-1 rounded-full">🔥 Trending</span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-gray-800 text-2xl font-bold">{event.title}</h1>

        {/* Posted by */}
        <p className="text-gray-400 text-sm mt-2">
          Posted by <span className="text-[#FF6B35]">{event.postedBy?.name}</span>
        </p>

        {/* Description */}
        <div className="bg-white rounded-2xl p-4 mt-4">
          <h2 className="text-gray-800 font-bold mb-2">About this idea</h2>
          <p className="text-gray-500 text-sm leading-relaxed">{event.description}</p>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl p-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-700 text-sm font-semibold">Community Demand</p>
            <p className="text-[#FF6B35] text-sm font-bold">{event.votes}/20</p>
          </div>
          <div className="bg-gray-100 rounded-full h-2">
            <div
              className="bg-[#FF6B35] h-2 rounded-full transition-all"
              style={{ width: `${Math.min((event.votes / 20) * 100, 100)}%` }}
            />
          </div>
          <p className="text-gray-400 text-xs mt-2">
            {event.votes >= 20 ? '🔥 This idea is trending!' : `${20 - event.votes} more votes to trending`}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white rounded-2xl p-4 text-center">
            <p className="text-[#FF6B35] font-bold text-lg">{event.votes}</p>
            <p className="text-gray-400 text-xs">Votes</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <p className="text-gray-800 font-bold text-lg">{event.interested}</p>
            <p className="text-gray-400 text-xs">Interested</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <p className="text-gray-800 font-bold text-lg">{event.wouldPay}</p>
            <p className="text-gray-400 text-xs">Would Pay</p>
          </div>
        </div>

        {/* Vote Buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={() => handleVote('vote')}
            className="w-full bg-[#FF6B35] text-white font-semibold rounded-2xl py-4 hover:bg-[#e55a25] transition-all"
          >
            ↑ Vote for this idea
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleVote('interested')}
              className="bg-white border border-gray-200 rounded-2xl py-3 text-sm text-gray-600 font-semibold hover:border-[#FF6B35] transition-all"
            >
              👍 Interested
            </button>
            <button
              onClick={() => handleVote('wouldPay')}
              className="bg-white border border-gray-200 rounded-2xl py-3 text-sm text-gray-600 font-semibold hover:border-[#FF6B35] transition-all"
            >
              💰 Would Pay
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-2xl p-4 mt-4">
          <h2 className="text-gray-800 font-bold mb-4">Comments</h2>

          <form onSubmit={handleComment} className="flex gap-3 mb-4">
            <input
              type="text"
              name="comment"
              placeholder="Share your thoughts..."
              className="flex-1 bg-[#F5F5F5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF6B35] transition-all text-gray-700"
            />
            <button
              type="submit"
              className="bg-[#FF6B35] text-white font-semibold px-4 py-3 rounded-xl"
            >
              Post
            </button>
          </form>

          {(event.comments || []).length === 0
            ? <p className="text-gray-400 text-sm">No comments yet. Be the first.</p>
            : (event.comments || []).map((comment: any, index: number) => (
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