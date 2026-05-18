import { createClient } from '@/utils/supabase/server'
import { Trash2, Package } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import Image from 'next/image'
import AddProductForm from '@/components/AddProductForm'

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', user?.id)
    .order('created_at', { ascending: false })

  async function deleteProduct(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const id = formData.get('id') as string

    // 1. Get product to find image path
    const { data: product } = await supabase
      .from('products')
      .select('image_url')
      .eq('id', id)
      .single()

    // 2. Delete from database
    const { error: dbError } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (dbError) {
      console.error(dbError)
    }

    // 3. Delete from storage if exists
    if (product?.image_url) {
      const path = product.image_url.split('/').pop()
      if (path) {
        await supabase.storage
          .from('product-images')
          .remove([path])
      }
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
        {/* Add Product Form (Client Component with Compression) */}
        <div className="lg:col-span-1 space-y-6">
          <AddProductForm userId={user?.id || ''} />
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
                    <p className="text-[10px] text-muted truncate mt-1 font-light">{product.description}</p>
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
