import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Plus, Settings, Package, LayoutDashboard, ExternalLink, LogOut } from 'lucide-react'
import Link from 'next/link'
import { signOut } from '../login/actions'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <div className="p-4 mb-6 premium-card rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-lg font-bold">
                {profile?.store_name?.charAt(0) || profile?.full_name?.charAt(0) || 'S'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{profile?.store_name || 'My Store'}</p>
                <p className="text-[10px] text-muted uppercase tracking-widest">Seller Account</p>
              </div>
            </div>

            <nav className="space-y-1">
              <Link 
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-medium group"
              >
                <LayoutDashboard className="w-5 h-5 text-muted group-hover:text-white transition-colors" />
                Overview
              </Link>
              <Link 
                href="/dashboard/products"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-medium group"
              >
                <Package className="w-5 h-5 text-muted group-hover:text-white transition-colors" />
                Products
              </Link>
              <Link 
                href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-medium group"
              >
                <Settings className="w-5 h-5 text-muted group-hover:text-white transition-colors" />
                Store Settings
              </Link>
              <a 
                href={`/product?seller=${profile?.id}`}
                target="_blank"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-medium group text-muted hover:text-white"
              >
                <ExternalLink className="w-5 h-5" />
                View Public Store
              </a>
              <form action={signOut}>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors text-sm font-medium group mt-8">
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </form>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
