// Product types
export interface Product {
  id: string
  title: string
  description: string
  price: number
  currencyCode: string
  image: {
    url: string
    altText?: string
  }
  metafields?: ProductMetafields
}

export interface ProductMetafields {
  co2Level?: string        // e.g., "≤ 600 ppm"
  temperature?: string     // e.g., "68-75°F"
  substrate?: string       // e.g., "Soy hull + Hardwood"
  humidity?: string        // e.g., "85-95%"
  growthTime?: string      // e.g., "14-21 days"
}

// Crowe Logic Panel types
export interface CroweResponse {
  id: string
  type: 'text' | 'product_recommendation' | 'formula' | 'guide_link' | 'checkout_prompt'
  content: string
  metadata?: {
    products?: Product[]
    formula?: SubstrateFormula
    guide?: Guide
    checkoutItems?: CartItem[]
  }
  timestamp: Date
}

export interface SubstrateFormula {
  id: string
  name: string
  ingredients: {
    name: string
    percentage: number
  }[]
  hydration: number
  ph: number
}

export interface Guide {
  id: string
  title: string
  excerpt: string
  url: string
  category: 'beginner' | 'intermediate' | 'advanced'
}

// Cart types
export interface CartItem {
  productId: string
  quantity: number
  variantId?: string
}

// Navigation types
export interface NavItem {
  label: string
  href: string
  icon: string // Icon name from lucide-react
  badge?: number
  hasVoice?: boolean
}

// CTA types
export interface CTABlockProps {
  title: string
  description: string
  buttonText: string
  buttonHref: string
  image?: {
    src: string
    alt: string
  }
  variant?: 'default' | 'accent' | 'secondary'
}

// Chat types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  responses?: CroweResponse[]
  timestamp: Date
}

// Component props
export interface SidebarProps {
  isOpen?: boolean
  onToggle?: () => void
  currentPath?: string
}

export interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  showMetafields?: boolean
}

export interface MetafieldCalloutProps {
  metafields: ProductMetafields
  variant?: 'inline' | 'card'
}