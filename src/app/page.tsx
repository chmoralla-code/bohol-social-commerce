import Navbar from "@/components/Navbar"
import ProductCard from "@/components/ProductCard"
import { createClient } from "@/utils/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  
  // Fetch real products and join with seller profile
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      profiles:seller_id (
        store_name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <main className="min-h-screen pt-16 bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent" />
        <div className="relative z-10 text-center space-y-6 px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gradient leading-tight">
            Elevating Bohol's <br /> Finest Creations.
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Discover a curated collection of premium products from local artisans and sellers across Bohol. 
            Seamless payment via GCash, final handoff to Messenger.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <button className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-zinc-200 transition-colors">
              Browse Catalog
            </button>
            <button className="px-8 py-3 border border-border rounded-full font-semibold hover:bg-accent transition-colors">
              Become a Seller
            </button>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted font-bold">Featured Catalog</p>
            <h2 className="text-3xl font-bold tracking-tight text-white">Curated Selection</h2>
          </div>
          <button className="text-sm font-medium hover:underline underline-offset-4 text-white">View All Products</button>
        </div>
        
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((p) => (
              <ProductCard 
                key={p.id} 
                id={p.id}
                name={p.name}
                price={p.price}
                image={p.image_url}
                seller={p.profiles?.store_name || 'Local Seller'} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted">
            <p>No products found in the catalog yet.</p>
          </div>
        )}
      </section>

      <footer className="border-t border-border py-12 text-center text-muted text-sm font-light">
        <p>© 2025 Bohol Social Commerce Platform. All rights reserved.</p>
      </footer>
    </main>
  )
}
