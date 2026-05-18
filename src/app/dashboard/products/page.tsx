import { createClient } from '@/utils/supabase/server'
import { Plus, Trash2, Package } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import Image from 'next/image'

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', user?.id)
    .order('created_at', { ascending: false })

  async function addProduct(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const name = formData.get('name') as string
    const price = parseFloat(formData.get('price') as string)
    const description = formData.get('description') as string
    const image_url = formData.get('image_url') as string
    const category = formData.get('category') as string

    const { error } = await supabase
      .from('products')
      .insert({
        name,
        price,
        description,
        image_url,
        category,
        seller_id: user?.id,
      })

    if (error) {
      console.error(error)
    }

    revalidatePath('/dashboard/products')
  }

  async function deleteProduct(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const id = formData.get('id') as string

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
    }

    revalidatePath('/dashboard/products')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted text-sm font-light">Manage your catalog and inventory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Product Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="premium-card p-6 rounded-2xl space-y-6 border border-border">
            <h2 className="font-bold flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add New Product
            </h2>
            <form action={addProduct} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted font-bold ml-1">Product Name</label>
                <input 
                  name="name"
                  required
                  className="w-full bg-accent border border-border rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-white/30 transition-all"
                  placeholder="e.g. Native Bag"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted font-bold ml-1">Price (₱)</label>
                <input 
                  name="price"
                  type="number"
                  required
                  className="w-full bg-accent border border-border rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-white/30 transition-all"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted font-bold ml-1">Image URL</label>
                <input 
                  name="image_url"
                  className="w-full bg-accent border border-border rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-white/30 transition-all"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted font-bold ml-1">Description</label>
                <textarea 
                  name="description"
                  rows={3}
                  className="w-full bg-accent border border-border rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-white/30 transition-all resize-none"
                  placeholder="Product details..."
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all active:scale-95"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>

        {/* Product List */}
        <div className="lg:col-span-2 space-y-4">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => (
                <div key={product.id} className="premium-card p-4 rounded-2xl flex items-center gap-4 group">
                  <div className="w-20 h-20 bg-accent rounded-xl overflow-hidden relative flex-shrink-0">
                    {product.image_url ? (
                      <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                    ) : (
                      <Package className="w-8 h-8 text-muted absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{product.name}</h3>
                    <p className="text-sm text-gradient font-mono">₱{product.price.toLocaleString()}</p>
                    <p className="text-[10px] text-muted truncate mt-1">{product.description}</p>
                  </div>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <button 
                      type="submit"
                      className="p-2 hover:bg-red-500/10 text-muted hover:text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <div className="premium-card rounded-2xl border border-dashed border-border p-20 text-center space-y-4">
              <Package className="w-12 h-12 text-muted mx-auto" />
              <div className="space-y-1">
                <p className="font-bold">No products yet</p>
                <p className="text-xs text-muted uppercase tracking-widest">Start adding items to your catalog.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
