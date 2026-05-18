"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"

interface ProductCardProps {
  id: number | string
  name: string
  price: number
  image?: string
  seller: string
}

export default function ProductCard({ id, name, price, image, seller }: ProductCardProps) {
  return (
    <Link href={`/product/${id}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="premium-card rounded-xl overflow-hidden group cursor-pointer"
      >
      <div className="relative aspect-square bg-accent overflow-hidden">
        {image ? (
          <Image 
            src={image} 
            alt={name} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-xs uppercase tracking-widest">
            No Image
          </div>
        )}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[10px] uppercase tracking-tighter border border-white/10">
          New Arrival
        </div>
      </div>
      <div className="p-4 space-y-1">
        <p className="text-[10px] text-muted uppercase tracking-widest font-medium">{seller}</p>
        <h3 className="text-sm font-semibold truncate group-hover:text-white transition-colors">{name}</h3>
        <p className="text-sm font-mono">₱{price.toLocaleString()}</p>
      </div>
    </motion.div>
    </Link>
  )
}
