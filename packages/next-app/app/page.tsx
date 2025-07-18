'use client'

import { CTABlock } from '@/components/CTABlock'
import { ProductCard } from '@/components/ProductCard'
import { MetafieldCallout } from '@/components/MetafieldCallout'
import type { Product, ProductMetafields } from '@/types'

// Mock data - in production, this would come from Shopify Storefront API
const featuredProducts: Product[] = [
  {
    id: '1',
    title: 'Blue Oyster Starter Kit',
    description: 'Perfect for beginners - fruits in 7-10 days. High yields with minimal effort.',
    price: 32.00,
    currencyCode: 'USD',
    image: {
      url: '/api/placeholder/400/400',
      altText: 'Blue Oyster Mushroom Kit'
    },
    metafields: {
      co2Level: '≤ 600 ppm',
      temperature: '65-75°F',
      substrate: 'Straw + Hardwood',
      humidity: '85-95%',
      growthTime: '7-10 days'
    }
  },
  {
    id: '2',
    title: 'Lions Mane Growing Block',
    description: 'Gourmet medicinal mushroom with cognitive benefits. Easy to grow indoors.',
    price: 45.00,
    currencyCode: 'USD',
    image: {
      url: '/api/placeholder/400/400',
      altText: 'Lions Mane Mushroom Block'
    },
    metafields: {
      co2Level: '≤ 800 ppm',
      temperature: '65-75°F',
      substrate: 'Hardwood + Bran',
      humidity: '85-90%',
      growthTime: '14-21 days'
    }
  },
  {
    id: '3',
    title: 'Shiitake Log Kit',
    description: 'Traditional log cultivation for authentic shiitake mushrooms.',
    price: 55.00,
    currencyCode: 'USD',
    image: {
      url: '/api/placeholder/400/400',
      altText: 'Shiitake Log Kit'
    },
    metafields: {
      co2Level: '≤ 1000 ppm',
      temperature: '55-75°F',
      substrate: 'Oak Log',
      humidity: '80-85%',
      growthTime: '6-12 months'
    }
  }
]

const exampleMetafields: ProductMetafields = {
  co2Level: '≤ 600 ppm',
  temperature: '65-75°F',
  substrate: 'Soy Hull + Hardwood',
  humidity: '85-95%',
  growthTime: '14-21 days'
}

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section>
        <h1 className="text-5xl font-bold text-crowe-accent mb-4">
          Welcome to Crowe Logic™
        </h1>
        <p className="text-xl text-crowe-text/80 mb-8 max-w-3xl">
          Your myco-intelligent commerce interface for mushroom cultivation. 
          Discover grow kits, substrate formulas, and expert guidance powered by regenerative intelligence.
        </p>
        
        <CTABlock
          title="Discover the Mushroom Cultivation Audiobook"
          description="Learn the secrets of successful mushroom growing with our comprehensive audio guide."
          buttonText="Listen Now"
          buttonHref="/audiobook"
          variant="accent"
          image={{
            src: '/api/placeholder/320/320',
            alt: 'Mushroom Cultivation Audiobook Cover'
          }}
        />
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-3xl font-bold text-crowe-accent mb-8">
          Featured Growing Kits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(product) => {
                console.log('Add to cart:', product)
                // In production, this would use Shopify Storefront API
              }}
            />
          ))}
        </div>
      </section>

      {/* Metafield Example */}
      <section>
        <h2 className="text-3xl font-bold text-crowe-accent mb-8">
          Growing Specifications
        </h2>
        <p className="text-crowe-text/80 mb-6">
          All our products come with detailed growing specifications to ensure your success:
        </p>
        <MetafieldCallout metafields={exampleMetafields} variant="card" />
      </section>

      {/* Call to Action */}
      <section>
        <CTABlock
          title="Ready to Start Growing?"
          description="Get personalized recommendations from our myco-intelligent assistant."
          buttonText="Chat with Crowe Logic"
          buttonHref="/crowe-logic"
          variant="default"
        />
      </section>
    </div>
  )
}
