'use client'
import Link from 'next/link'
import { useEffect, useState } from "react"

type Event = {
  _id: string
  title: string
  description: string
  location: { description: string }
  date: string
  category: string
  votes: {
    interested: number
    veryInterested: number
    wouldAttend: number
    wouldPay: number
  }
  coverImage?: string
  postedBy: { name: string }
}

export default function EventCard({ event }: { event: Event }) {
  
   const [votes, setVotes] = useState(event.votes)
    async function handleVote(type:string) {
      const token = localStorage.getItem('token')
      const vote = await fetch("http://localhost:5000/api/vote",{
        method:"POST",
        headers:{'Content-Type':"application/json" ,"Authorization" : `Bearer ${token}`},
        body:JSON.stringify({event:event._id,type})
      })
      const data = await vote.json()
      if (!vote.ok) {
      console.log(data.message) 
      return
    }
     setVotes(prev => ({
      ...prev,
      [type]: prev[type as keyof typeof prev] + 1
    }))

    }
    
  
  return (
    <div className="bg-[#1a1a1a] w-full max-w-[500px] m-auto rounded-2xl overflow-hidden mt-6">
      
      
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="bg-white text-black text-sm font-bold w-9 h-9 rounded-full flex items-center justify-center">
          {event.postedBy?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white text-sm font-semibold">{event.postedBy?.name}</p>
          <p className="text-gray-500 text-xs">{new Date(event.date).toLocaleDateString()}</p>
        </div>
      </div>

      {event.coverImage && (
        <div className="w-full h-[280px] overflow-hidden">
          <img src={event.coverImage} alt="event" className="w-full h-full object-cover" />
        </div>
      )}

      
      <div className="px-4 pt-3">
        <Link href={`/event/${event._id}`}>
  <h3 className="text-white text-lg font-bold cursor-pointer hover:underline">
    {event.title}
  </h3>
</Link>
        <p className="text-gray-400 text-sm mt-1">{event.location.description}</p>
        <p className="text-gray-500 text-xs mt-1">{new Date(event.date).toLocaleDateString()} • {event.category}</p>
      </div>

      {/* Vote Buttons */}
      <div className="flex gap-3 px-4 py-3">
        <button onClick={() => handleVote ('interested')} className="flex items-center gap-2 bg-[#222222] hover:bg-[#2a2a2a] text-white text-sm px-4 py-2 rounded-full transition-all">
          👍 <span>{votes.interested}</span>
        </button>
        <button onClick={() => handleVote ('veryInterested')} className="flex items-center gap-2 bg-[#222222] hover:bg-[#2a2a2a] text-white text-sm px-4 py-2 rounded-full transition-all">
          🔥 <span>{votes.veryInterested}</span>
        </button>
        <button onClick={() => handleVote ('wouldAttend')} className="flex items-center gap-2 bg-[#222222] hover:bg-[#2a2a2a] text-white text-sm px-4 py-2 rounded-full transition-all">
          🎟️ <span>{votes.wouldAttend}</span>
        </button>
        <button onClick={() => handleVote ('wouldPay')} className="flex items-center gap-2 bg-[#222222] hover:bg-[#2a2a2a] text-white text-sm px-4 py-2 rounded-full transition-all">
          💰 <span>{votes.wouldPay}</span>
        </button>
      </div>

      {/* Description */}
      <div className="px-4 pb-4">
        <p className="text-gray-400 text-sm leading-relaxed">{event.description}</p>
      </div>

    </div>
  )
}