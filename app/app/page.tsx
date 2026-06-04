'use client'
import useAuth from '@/hooks/useAuth'
import Home from "./home/page"

export default function App() {
  useAuth()
  
  return (
    <>
      <div className="bg-black">
        <Home/>
      </div>
    </>
  )
}