"use client"

import { useParams } from "next/navigation"
import Navbar from "@/components/Navbar"
import { ArrowLeft, MessageCircle, QrCode } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ProductDetail() {
  const { id } = useParams()
  const [showPayment, setShowPayment] = useState(false)

  // Mock data
  const product = {
    name: "Handwoven Native Bag",
    price: 1200,
    seller: "Antequera Crafts",
    description: "Authentic handwoven bag made from sustainable locally sourced Buri palm leaves. Each piece is unique and supports the local weaving community in Antequera, Bohol.",
    gcashQr: "/mock-qr.png", // Placeholder
    messengerLink: "https://m.me/yourpage" // Placeholder
  }

  if (showPayment) {
    return (
      <main className="min-h-screen pt-16 bg-black text-white">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 text-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Complete Payment</h1>
            <p className="text-muted text-sm">Scan the QR code below using your GCash app.</p>
          </div>
          
          <div className="relative aspect-square max-w-[300px] mx-auto bg-white p-4 rounded-2xl">
             {/* In a real app, this would be the seller's QR code */}
             <div className="w-full h-full flex items-center justify-center bg-zinc-100 rounded-lg">
                <QrCode className="w-20 h-20 text-black" />
             </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-accent rounded-xl border border-border">
              <p className="text-xs text-muted uppercase tracking-widest mb-1">Total Amount</p>
              <p className="text-2xl font-mono font-bold">₱{product.price.toLocaleString()}</p>
            </div>
            
            <div className="text-left text-sm text-muted space-y-2 px-2">
              <p>1. Open GCash app and select 'Scan QR'.</p>
              <p>2. Send the exact amount: ₱{product.price.toLocaleString()}.</p>
              <p>3. Take a screenshot of the receipt.</p>
            </div>
          </div>

          <Link 
            href={product.messengerLink}
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
        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div className="aspect-square bg-accent rounded-3xl overflow-hidden border border-border">
            <div className="w-full h-full flex items-center justify-center text-muted uppercase tracking-widest text-sm">
              Product Image
            </div>
          </div>

          <div className="space-y-8 py-4">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-muted font-bold">{product.seller}</p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">{product.name}</h1>
              <p className="text-3xl font-mono text-gradient">₱{product.price.toLocaleString()}</p>
            </div>

            <p className="text-muted leading-relaxed text-lg font-light">
              {product.description}
            </p>

            <div className="space-y-4 pt-4">
              <button 
                onClick={() => setShowPayment(true)}
                className="w-full py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-zinc-200 transition-all active:scale-95"
              >
                Buy with GCash
              </button>
              <p className="text-center text-[10px] text-muted uppercase tracking-widest">
                Secure transaction via GCash & Messenger
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
