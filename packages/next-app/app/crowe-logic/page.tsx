'use client'

import { CroweLogicPanelWithVoice } from '@/components/CroweLogicPanel'
import { useState } from 'react'
import type { Product } from '@/types'

export default function CroweLogicPage() {
  const [checkoutItems, setCheckoutItems] = useState<{ productId: string; quantity: number }[]>([])

  const handleCreateCheckout = (items: { productId: string; quantity: number }[]) => {
    console.log('Creating checkout with items:', items)
    setCheckoutItems(items)
    // In production, this would use Shopify Storefront API to create a checkout
    // Example:
    // const checkout = await createCheckout(items)
    // window.location.href = checkout.webUrl
  }

  const handleProductClick = (product: Product) => {
    console.log('Product clicked:', product)
    // Could navigate to product page or show modal
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="h-full max-w-6xl mx-auto">
        <div className="h-full flex flex-col">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-crowe-accent mb-2">
              Crowe Logic™ Assistant
            </h1>
            <p className="text-crowe-text/70">
              Ask me anything about mushroom cultivation, growing techniques, or get personalized product recommendations.
            </p>
          </div>
          
          <div className="flex-1 min-h-0">
            <CroweLogicPanelWithVoice
              onCreateCheckout={handleCreateCheckout}
              onProductClick={handleProductClick}
              enableVoice={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}