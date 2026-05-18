"use client"

import Link from "next/link"
import { Search, Menu, ShoppingBag, User, LayoutDashboard, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { signOut } from "@/app/login/actions"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-accent rounded-full transition-colors lg:hidden">
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="text-xl font-bold tracking-tighter text-gradient">
            BOHOL SOCIAL
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text" 
              placeholder="Search products, stores..." 
              className="w-full bg-accent border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-white/30 transition-all font-light"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-full transition-colors text-sm font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <form action={signOut}>
                <button className="p-2 hover:bg-red-500/10 text-muted hover:text-red-500 rounded-full transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
            </div>
          ) : (
            <>
              <button className="p-2 hover:bg-accent rounded-full transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </button>
              <Link href="/login" className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-full transition-colors text-sm font-medium">
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Seller Login</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
