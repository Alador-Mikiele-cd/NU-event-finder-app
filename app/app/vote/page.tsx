'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import BottomNav from "@/components/BottomNav"
import API from "@/lib/api"
export default function Vote() {
  const [totalIdeas, setTotalIdeas] = useState(0)
  const [trending, setTrending] = useState(0)
  const [ideas, setIdeas] = useState<any[]>([])
  const [topVoted, setTopVoted] = useState<any[]>([])

  useEffect(() => {
    async function getStats() {
      const res = await fetch(`${API}/api/ideas/stats`)
      const data = await res.json()
      setTotalIdeas(data.total)
      setTrending(data.trending)
    }

    async function getIdeas() {
      const res = await fetch(`${API}/api/ideas`)
      const data = await res.json()
      const sorted = [...data].sort((a, b) => b.votes - a.votes)
      setTopVoted(sorted)
      const gaining = data.filter((i: any) => i.votes > 0 && !i.isTrending)
      setIdeas(gaining)
    }

    getStats()
    getIdeas()
  }, [])

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-24">

      {/* Header */}
      <div className="px-5 pt-10 pb-4 bg-white">
        <h1 className="text-gray-800 text-2xl font-bold">Voting</h1>
        <p className="text-gray-400 text-sm">Shape what happens next</p>
      </div>

      <div className="w-full max-w-[600px] m-auto px-5">

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white rounded-2xl p-4 text-center">
            <p className="text-[#FF6B35] font-bold text-2xl">{totalIdeas}</p>
            <p className="text-gray-400 text-xs mt-1">Total Ideas</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <p className="text-yellow-500 font-bold text-2xl">{trending}</p>
            <p className="text-gray-400 text-xs mt-1">Trending</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <p className="text-green-500 font-bold text-2xl">0</p>
            <p className="text-gray-400 text-xs mt-1">Launched</p>
          </div>
        </div>

        {/* Gaining Momentum */}
        {ideas.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-500">↗</span>
              <h2 className="text-gray-800 font-bold">Gaining Momentum</h2>
            </div>
            {ideas.map((idea: any) => (
              <Link href={`/idea/${idea._id}`} key={idea._id}>
                <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <span className="bg-[#F0F9FF] text-blue-500 text-xs px-2 py-1 rounded-full">
                        {idea.category}
                      </span>
                      <h3 className="text-gray-800 font-bold text-sm mt-2">{idea.title}</h3>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">{idea.description}</p>
                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-[#FF6B35] h-1.5 rounded-full"
                            style={{ width: `${Math.min((idea.votes / 20) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-gray-400 text-xs mt-1">{idea.votes}/20 votes to trending</p>
                      </div>
                      <div className="flex gap-3 mt-2">
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
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Top Voted This Week */}
        {topVoted.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500">🏆</span>
              <h2 className="text-gray-800 font-bold">Top Voted This Week</h2>
            </div>
            {topVoted.map((idea: any) => (
              <Link href={`/idea/${idea._id}`} key={idea._id}>
                <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        <span className="bg-[#F0F9FF] text-blue-500 text-xs px-2 py-1 rounded-full">
                          {idea.category}
                        </span>
                        {idea.isTrending && (
                          <span className="bg-[#FFF0EA] text-[#FF6B35] text-xs px-2 py-1 rounded-full">
                            🔥 Trending
                          </span>
                        )}
                      </div>
                      <h3 className="text-gray-800 font-bold text-sm">{idea.title}</h3>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">{idea.description}</p>
                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-yellow-400 h-1.5 rounded-full"
                            style={{ width: `${Math.min((idea.votes / 50) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-gray-400 text-xs mt-1">{idea.votes} total votes</p>
                      </div>
                      <div className="flex gap-3 mt-2">
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