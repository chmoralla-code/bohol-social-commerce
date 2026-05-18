"use client"

import { useState, useEffect } from "react"
import { Plus, Package, Loader2, Upload, X, Edit2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import imageCompression from "browser-image-compression"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Product {
  id?: string
  name: string
  price: number
  description: string
  image_url: string
}

export default function ProductForm({ 
  userId, 
  initialData = null 
}: { 
  userId: string, 
  initialData?: Product | null 
}) {
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)
  const [isEditing, setIsEditing] = useState(!!initialData)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (initialData) {
      setIsEditing(true)
      setImagePreview(initialData.image_url)
    } else {
      setIsEditing(false)
      setImagePreview(null)
    }
  }, [initialData])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      }
      
      const compressedFile = await imageCompression(file, options)
      setImageFile(compressedFile)
      setImagePreview(URL.createObjectURL(compressedFile))
    } catch (error) {
      console.error("Compression error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const price = parseFloat(formData.get('price') as string)
    const description = formData.get('description') as string
    let image_url = initialData?.image_url || ""

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${userId}-${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)
        
        image_url = publicUrl
      }

      if (isEditing && initialData?.id) {
        const { error: dbError } = await supabase
          .from('products')
          .update({
            name,
            price,
            description,
            image_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', initialData.id)

        if (dbError) throw dbError
      } else {
        const { error: dbError } = await supabase
          .from('products')
          .insert({
            name,
            price,
            description,
            image_url,
            seller_id: userId,
          })

        if (dbError) throw dbError
      }

      router.refresh()
      if (!isEditing) {
        setImageFile(null)
        setImagePreview(null)
        ;(e.target as HTMLFormElement).reset()
      } else {
        // If we want to exit edit mode, we'd need a way to clear the initialData prop from parent
        // For now, let's just stay in edit mode with updated data
      }
    } catch (error: any) {
      alert(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="premium-card p-6 rounded-2xl space-y-6 border border-border">
      <h2 className="font-bold flex items-center gap-2">
        {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />} 
        {isEditing ? "Edit Product" : "Add New Product"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-muted font-bold ml-1">Product Image</label>
          <div className="relative group">
            {imagePreview ? (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-accent border border-border">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                <button 
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 p-1 bg-black/50 backdrop-blur-md rounded-full hover:bg-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-border hover:border-white/30 hover:bg-accent/50 transition-all cursor-pointer group">
                <Upload className="w-6 h-6 text-muted group-hover:text-white mb-2 transition-colors" />
                <p className="text-[10px] uppercase tracking-widest text-muted group-hover:text-white transition-colors">Click to upload</p>
                <p className="text-[9px] text-muted/50 mt-1">Auto-optimized to &lt;1MB</p>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-muted font-bold ml-1">Product Name</label>
          <input 
            name="name"
            defaultValue={initialData?.name || ''}
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
            defaultValue={initialData?.price || ''}
            required
            className="w-full bg-accent border border-border rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-white/30 transition-all"
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-muted font-bold ml-1">Description</label>
          <textarea 
            name="description"
            defaultValue={initialData?.description || ''}
            rows={3}
            className="w-full bg-accent border border-border rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-white/30 transition-all resize-none font-light"
            placeholder="Product details..."
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Processing..." : isEditing ? "Update Product" : "Add Product"}
        </button>
        
        {isEditing && (
          <button 
            type="button"
            onClick={() => window.location.reload()} // Quick way to reset
            className="w-full py-2 text-xs text-muted hover:text-white transition-colors"
          >
            Cancel Editing
          </button>
        )}
      </form>
    </div>
  )
}
