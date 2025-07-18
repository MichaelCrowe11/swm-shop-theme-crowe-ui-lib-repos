'use client'

'use client'

import React from 'react'
import Image from 'next/image'
import { ShoppingCart, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import type { ProductCardProps } from '@/types'

export function ProductCard({ 
  product, 
  onAddToCart, 
  showMetafields = true 
}: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart?.(product)
  }

  return (
    <article className="group bg-crowe-light/5 rounded-xl border border-crowe-secondary/20 overflow-hidden hover:border-crowe-accent/40 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square bg-crowe-secondary/10 overflow-hidden">
        {product.image.url ? (
          <Image
            src={product.image.url}
            alt={product.image.altText || product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-crowe-text/20">
            <Package size={48} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Price */}
        <div>
          <h3 className="font-semibold text-lg text-crowe-accent line-clamp-1 group-hover:text-crowe-secondary transition-colors">
            {product.title}
          </h3>
          <p className="text-2xl font-bold text-crowe-text mt-1">
            {formatPrice(product.price, product.currencyCode)}
          </p>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-crowe-text/70 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Metafields */}
        {showMetafields && product.metafields && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-crowe-secondary/10">
            {product.metafields.co2Level && (
              <MetafieldItem 
                label="CO₂" 
                value={product.metafields.co2Level}
                icon="💨"
              />
            )}
            {product.metafields.temperature && (
              <MetafieldItem 
                label="Temp" 
                value={product.metafields.temperature}
                icon="🌡️"
              />
            )}
            {product.metafields.substrate && (
              <MetafieldItem 
                label="Substrate" 
                value={product.metafields.substrate}
                icon="🌿"
                className="col-span-2"
              />
            )}
            {product.metafields.humidity && (
              <MetafieldItem 
                label="Humidity" 
                value={product.metafields.humidity}
                icon="💧"
              />
            )}
            {product.metafields.growthTime && (
              <MetafieldItem 
                label="Growth" 
                value={product.metafields.growthTime}
                icon="⏱️"
              />
            )}
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
            "bg-crowe-accent text-crowe-black font-medium",
            "hover:bg-crowe-secondary transition-colors duration-200",
            "active:scale-[0.98] transform"
          )}
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </article>
  )
}

// Metafield Item Component
interface MetafieldItemProps {
  label: string
  value: string
  icon?: string
  className?: string
}

function MetafieldItem({ label, value, icon, className }: MetafieldItemProps) {
  return (
    <div className={cn("flex items-start gap-2 text-xs", className)}>
      {icon && <span className="text-base leading-none mt-0.5">{icon}</span>}
      <div>
        <span className="text-crowe-text/50">{label}:</span>{' '}
        <span className="text-crowe-text/80 font-medium">{value}</span>
      </div>
    </div>
  )
}