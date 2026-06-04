'use client'
import { useRouter } from "next/navigation"
import { useState } from "react"
import useGuest from '@/hooks/useGuest'
export default function Logim(){
  useGuest()
    const[err , setErr] = useState('')
    const router = useRouter()
    async function  handle(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try{
        const form = e.currentTarget
        
        const email = (form.elements.namedItem('email') as HTMLInputElement).value
        const password = (form.elements.namedItem('password') as HTMLInputElement).value

        const user = await fetch('http://localhost:5000/api/user/login',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({email,password})
            
        })
      const data = await user.json()

        
        if (!user.ok) {

  setErr(data.message)
  return
}
router.push('/')
localStorage.setItem('token',data.token)
      }catch(err:any){
          setErr(err.message)
        } 
    }
    return(
        <>
        <div className="min-h-screen bg-[#111111] flex items-center justify-center">
  <div className="w-full max-w-[400px] bg-[#1a1a1a] text-white text-center py-[40px] px-[30px] rounded-2xl">
    <h1 className="text-3xl font-bold mb-2">Nu</h1>
    <p className="text-gray-400 text-sm mb-8">Join your city</p>
    
    {err && <p className="text-red-400 text-sm mb-4">{err}</p>}
    
    <form onSubmit={handle} className="flex flex-col gap-4">
     
      <input 
        type="email" 
        name="email" 
        className="bg-[#222222] border border-[#333333] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-white transition-all" 
        placeholder="Email address"
      />
      <input 
        type="password" 
        name="password" 
        className="bg-[#222222] border border-[#333333] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-white transition-all" 
        placeholder="Password"
      />
      <button 
        type="submit"
        className="bg-white text-black font-semibold rounded-xl py-3 mt-2 hover:bg-gray-200 transition-all"
      >
        Login
      </button>
    </form>
    
    <p className="text-gray-500 text-sm mt-6">
      DON'T have an account? 
      <a href="/register" className="text-white ml-1 hover:underline">Create Account</a>
    </p>
  </div>
</div>
        </>
    )
}