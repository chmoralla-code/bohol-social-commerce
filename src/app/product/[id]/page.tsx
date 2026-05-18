"use client"

import { useParams } from "next/navigation"
import Navbar from "@/components/Navbar"
import { ArrowLeft, MessageCircle, QrCode, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"

export default function ProductDetail() {
  const { id } = useParams()
  const [showPayment, setShowPayment] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles:seller_id (*)
        `)
        .eq('id', id)
        .single()

      if (data) setProduct(data)
      setLoading(false)
    }
    fetchProduct()
  }, [id, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <p className="text-white">Product not found.</p>
        <Link href="/" className="text-muted hover:text-white underline">Return Home</Link>
      </div>
    )
  }

  if (showPayment) {
    return (
      <main className="min-h-screen pt-16 bg-black text-white">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 text-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Complete Payment</h1>
            <p className="text-muted text-sm font-light">Scan the QR code below using your GCash app.</p>
          </div>
          
          <div className="relative aspect-square max-w-[300px] mx-auto bg-white p-4 rounded-2xl overflow-hidden">
             {product.profiles?.gcash_qr_url ? (
               <Image 
                 src={product.profiles.gcash_qr_url} 
                 alt="GCash QR" 
                 fill 
                 className="object-contain p-2"
               />
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 rounded-lg text-black gap-2">
                  <QrCode className="w-16 h-16" />
                  <p className="text-[10px] uppercase font-bold text-muted">QR Not Available</p>
               </div>
             )}
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-accent rounded-xl border border-border">
              <p className="text-xs text-muted uppercase tracking-widest mb-1">Total Amount</p>
              <p className="text-2xl font-mono font-bold">₱{product.price.toLocaleString()}</p>
            </div>
            
            <div className="text-left text-sm text-muted space-y-2 px-2 font-light">
              <p>1. Open GCash app and select 'Scan QR'.</p>
              <p>2. Send the exact amount: ₱{product.price.toLocaleString()}.</p>
              <p>3. Take a screenshot of the receipt.</p>
            </div>
          </div>

          <Link 
            href={product.profiles?.messenger_link || '#'}
            target="_blank"
            className="block w-full py-4 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            I have paid, send receipt
          </Link>
          
          <button 
            onClick={() => setShowPayment(false)}
            className="text-sm text-muted hover:text-white transition-colors"
          >
            Cancel and return
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-16 bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-white mb-8 transition-colors text-sm uppercase tracking-widest font-bold">
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div className="aspect-square bg-accent rounded-3xl overflow-hidden border border-border relative">
            {product.image_url ? (
              <Image src={product.image_url} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted uppercase tracking-widest text-sm">
                Product Image
              </div>
            )}
          </div>

          <div className="space-y-8 py-4">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-muted font-bold">{product.profiles?.store_name || 'Local Seller'}</p>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">{product.name}</h1>
              <p className="text-3xl font-mono text-gradient">₱{product.price.toLocaleString()}</p>
            </div>

            <p className="text-muted leading-relaxed text-lg font-light">
              {product.description || 'No description provided.'}
            </p>

            <div className="space-y-4 pt-4">
              <button 
                onClick={() => setShowPayment(true)}
                className="w-full py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-zinc-200 transition-all active:scale-95"
              >
                Buy with GCash
              </button>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] text-muted uppercase tracking-widest font-bold">
                  Seller is active & ready to fulfill
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
