'use client'
import { Home, Compass, PlusCircle, BarChart2, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/explore', icon: Compass, label: 'Explore' },
    { href: '/propose', icon: PlusCircle, label: 'Create', special: true },
    { href: '/vote', icon: BarChart2, label: 'Votes' },
    { href: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center py-3 z-50">
      {links.map(({ href, icon: Icon, label, special }) => (
        <Link key={href} href={href} className="flex flex-col items-center gap-1">
          {special
            ? <div className="bg-[#FF6B35] rounded-full p-3 -mt-6 shadow-lg">
                <Icon size={22} color="white" />
              </div>
            : <Icon size={22} color={pathname === href ? '#FF6B35' : '#9CA3AF'} />
          }
          {!special && (
            <span className={`text-xs ${pathname === href ? 'text-[#FF6B35]' : 'text-gray-400'}`}>
              {label}
            </span>
          )}
        </Link>
      ))}
    </div>
  )
}