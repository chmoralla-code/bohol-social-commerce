import { createClient } from '@/utils/supabase/server'
import { Package, TrendingUp, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: products } = await supabase
    .from('products')
    .select('id')
    .eq('seller_id', user?.id)

  const stats = [
    { name: 'Total Products', value: products?.length || 0, icon: Package, color: 'text-blue-500' },
    { name: 'Views (30d)', value: '1.2k', icon: TrendingUp, color: 'text-green-500' },
    { name: 'Store Visitors', value: '450', icon: Users, color: 'text-purple-500' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <Link 
          href="/dashboard/products" 
          className="flex items-center gap-2 text-sm text-muted hover:text-white transition-colors"
        >
          Manage Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="premium-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <span className="text-[10px] uppercase tracking-widest text-muted font-bold">+12%</span>
            </div>
            <div>
              <p className="text-2xl font-mono font-bold">{stat.value}</p>
              <p className="text-xs text-muted uppercase tracking-widest font-medium">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="premium-card rounded-2xl overflow-hidden border border-border">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-bold">Recent Activity</h2>
          <button className="text-xs text-muted hover:text-white transition-colors">Clear All</button>
        </div>
        <div className="p-12 text-center space-y-2">
          <p className="text-muted text-sm font-light">No recent sales activity yet.</p>
          <p className="text-xs text-muted uppercase tracking-widest">Your store is live and discovery is active.</p>
        </div>
      </div>
    </div>
  )
}
