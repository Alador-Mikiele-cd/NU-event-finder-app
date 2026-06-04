'use client'
import BottomNav from "@/components/BottomNav"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Propose() {
  const router = useRouter()
  const [from , setForm] = useState<'event' | 'idea'>('event')
  async function handleEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const description = (form.elements.namedItem('description') as HTMLInputElement).value
    const date = (form.elements.namedItem('date') as HTMLInputElement).value
    const category = (form.elements.namedItem('category') as HTMLSelectElement).value
    const locationdescription = (form.elements.namedItem('locationdescription') as HTMLInputElement).value
    const isOrganizer = (form.elements.namedItem('isOrganizer') as HTMLInputElement).checked
    const token = localStorage.getItem('token')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('date', date)
    formData.append('isOrganizer', String(isOrganizer))
    formData.append('location[description]', locationdescription)

    const coverImageFile = (form.elements.namedItem('coverImage') as HTMLInputElement).files?.[0]
    if (coverImageFile) formData.append('coverImage', coverImageFile)

    const event = await fetch('http://localhost:5000/api/event', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })

    const data = await event.json()
    if (!event.ok) return console.log(data.message)
    form.reset()
    router.push('/')
  }
async function handleIdea(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const form = e.currentTarget
  const title = (form.elements.namedItem('title') as HTMLInputElement).value
  const description = (form.elements.namedItem('description') as HTMLInputElement).value
  const category = (form.elements.namedItem('category') as HTMLSelectElement).value
  const token = localStorage.getItem('token')

  const res = await fetch('http://localhost:5000/api/idea', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, description, category })
  })

  const data = await res.json()
  if (!res.ok) return console.log(data.message)
  form.reset()
  router.push('/explore')
}

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-24">
      <BottomNav />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-10 pb-4 bg-white">
        <button onClick={() => router.back()} className="text-gray-400 text-lg">←</button>
        <h1 className="text-gray-800 font-semibold">Submit an Event</h1>
      </div>

      <div className="px-5 py-6 w-full max-w-[600px] m-auto">

        {/* Icon and title */}
        <div className="text-center mb-8">
          <div className="bg-[#FFF0EA] w-16 h-16 rounded-2xl flex items-center justify-center m-auto mb-4">
            <span className="text-2xl">💡</span>
          </div>
          <h2 className="text-gray-800 text-xl font-bold">What event should exist?</h2>
          <p className="text-gray-400 text-sm mt-1">Submit your idea and let the community vote on it.</p>
        </div>
        <div className="flex mx-5 my-4 bg-white rounded-2xl p-1">
        <button
          onClick={() => setForm('event')}
         className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
  from === 'event' ? 'bg-[#1a1a1a] text-white' : 'text-gray-400'
}`}
        >
          Events
        </button>
        <button
          onClick={() => setForm('idea')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
  from === 'event' ? 'bg-[#1a1a1a] text-white' : 'text-gray-400'
}`}


        >
          Ideas
        </button>
      </div>
{from == 'event' && 
<form onSubmit={handleEvent} className="flex flex-col gap-4">

          {/* Title */}
          <div>
            <label className="text-gray-700 text-sm font-semibold mb-1 block">Event Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Monthly Startup Mixer"
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#FF6B35] transition-all text-gray-700"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-700 text-sm font-semibold mb-1 block">Description</label>
            <textarea
              name="description"
              placeholder="Describe the event you'd love to see happen..."
              rows={4}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#FF6B35] transition-all text-gray-700 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-gray-700 text-sm font-semibold mb-1 block">Category *</label>
            <select
              name="category"
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#FF6B35] transition-all text-gray-700"
            >
              <option value="">Select category</option>
              <option value="concert">Concert</option>
              <option value="festival">Festival</option>
              <option value="art">Art</option>
              <option value="food">Food</option>
              <option value="sport">Sport</option>
              <option value="nightlife">Nightlife</option>
              <option value="film">Film</option>
              <option value="tech">Tech</option>
              <option value="fashion">Fashion</option>
              <option value="community">Community</option>
              <option value="religious">Religious</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="text-gray-700 text-sm font-semibold mb-1 block">Location *</label>
            <input
              type="text"
              name="locationdescription"
              placeholder="e.g., Bole, Addis Ababa"
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#FF6B35] transition-all text-gray-700"
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-gray-700 text-sm font-semibold mb-1 block">Date *</label>
            <input
              type="date"
              name="date"
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#FF6B35] transition-all text-gray-700"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="text-gray-700 text-sm font-semibold mb-1 block">Cover Image</label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none text-gray-500"
            />
          </div>

          {/* Is Organizer */}
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3">
            <input type="checkbox" name="isOrganizer" id="isOrganizer" className="accent-[#FF6B35] w-4 h-4" />
            <label htmlFor="isOrganizer" className="text-gray-700 text-sm">I am the event organizer</label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#FF6B35] text-white font-semibold rounded-2xl py-4 mt-2 hover:bg-[#e55a25] transition-all"
          >
            ✨ Submit Event
          </button>

        </form>

}
    {from == 'idea' && 
        <form onSubmit={handleIdea} className="flex flex-col gap-4">

          {/* Title */}
          <div>
            <label className="text-gray-700 text-sm font-semibold mb-1 block">Event Idea Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Monthly Startup Mixer"
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#FF6B35] transition-all text-gray-700"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-700 text-sm font-semibold mb-1 block">Description</label>
            <textarea
              name="description"
              placeholder="Describe the event you'd love to see happen..."
              rows={4}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#FF6B35] transition-all text-gray-700 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-gray-700 text-sm font-semibold mb-1 block">Category *</label>
            <select
              name="category"
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#FF6B35] transition-all text-gray-700"
            >
              <option value="">Select category</option>
              <option value="concert">Concert</option>
              <option value="festival">Festival</option>
              <option value="art">Art</option>
              <option value="food">Food</option>
              <option value="sport">Sport</option>
              <option value="nightlife">Nightlife</option>
              <option value="film">Film</option>
              <option value="tech">Tech</option>
              <option value="fashion">Fashion</option>
              <option value="community">Community</option>
              <option value="religious">Religious</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#FF6B35] text-white font-semibold rounded-2xl py-4 mt-2 hover:bg-[#e55a25] transition-all"
          >
            ✨ Submit Event
          </button>

        </form> }    
        
      </div>
    </div>
  )
}