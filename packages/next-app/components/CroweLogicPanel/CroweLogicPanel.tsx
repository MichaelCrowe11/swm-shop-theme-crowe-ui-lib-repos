'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader2, ShoppingCart, Copy, Check, Brain } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import type { ChatMessage, CroweResponse, Product } from '@/types'

interface CroweLogicPanelProps {
  onCreateCheckout?: (items: { productId: string; quantity: number }[]) => void
  onProductClick?: (product: Product) => void
}

export function CroweLogicPanel({ onCreateCheckout, onProductClick }: CroweLogicPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response - in production, this would call your API
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        responses: getMockResponse(userMessage.content),
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const getMockResponse = (query: string): CroweResponse[] => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('beginner') || lowerQuery.includes('start')) {
      return [
        {
          id: '1',
          type: 'text',
          content: 'Welcome to mushroom cultivation! Based on your interest in starting out, I recommend beginning with oyster mushrooms. They\'re forgiving, grow quickly, and produce abundant yields.',
          timestamp: new Date(),
        },
        {
          id: '2',
          type: 'product_recommendation',
          content: 'These beginner-friendly kits are perfect for you:',
          metadata: {
            products: [
              {
                id: 'prod_1',
                title: 'Blue Oyster Starter Kit',
                description: 'Perfect for beginners - fruits in 7-10 days',
                price: 32.00,
                currencyCode: 'USD',
                image: { url: '/images/blue-oyster.jpg', altText: 'Blue Oyster Kit' },
                metafields: {
                  co2Level: '≤ 600 ppm',
                  temperature: '65-75°F',
                  substrate: 'Straw + Hardwood',
                  humidity: '85-95%',
                }
              },
              {
                id: 'prod_2',
                title: 'Pink Oyster Grow Block',
                description: 'Vibrant pink mushrooms, great yields',
                price: 35.00,
                currencyCode: 'USD',
                image: { url: '/images/pink-oyster.jpg', altText: 'Pink Oyster Block' },
                metafields: {
                  co2Level: '≤ 800 ppm',
                  temperature: '70-85°F',
                  substrate: 'Soy Hull + Wheat Bran',
                  humidity: '80-90%',
                }
              }
            ]
          },
          timestamp: new Date(),
        }
      ]
    }
    
    if (lowerQuery.includes('substrate') || lowerQuery.includes('formula')) {
      return [
        {
          id: '3',
          type: 'text',
          content: 'I\'ll help you create a high-yield substrate formula. This formula is optimized for Pleurotus (Oyster) species:',
          timestamp: new Date(),
        },
        {
          id: '4',
          type: 'formula',
          content: 'Master\'s Mix - High Yield Formula',
          metadata: {
            formula: {
              id: 'formula_1',
              name: 'Master\'s Mix for Pleurotus',
              ingredients: [
                { name: 'Hardwood Pellets', percentage: 40 },
                { name: 'Soy Hull Pellets', percentage: 40 },
                { name: 'Wheat Bran', percentage: 18 },
                { name: 'Gypsum', percentage: 2 },
              ],
              hydration: 65,
              ph: 6.5,
            }
          },
          timestamp: new Date(),
        }
      ]
    }

    return [
      {
        id: '5',
        type: 'text',
        content: 'I can help you with mushroom cultivation, product recommendations, substrate formulas, and growing techniques. What would you like to know?',
        timestamp: new Date(),
      }
    ]
  }

  const copyFormula = (formulaId: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedFormula(formulaId)
    setTimeout(() => setCopiedFormula(null), 2000)
  }

  const renderResponse = (response: CroweResponse) => {
    switch (response.type) {
      case 'text':
        return (
          <div className="text-crowe-text leading-relaxed">
            {response.content}
          </div>
        )

      case 'product_recommendation':
        return (
          <div className="space-y-3">
            {response.content && (
              <p className="text-crowe-text mb-2">{response.content}</p>
            )}
            {response.metadata?.products?.map(product => (
              <div
                key={product.id}
                className="bg-crowe-light/10 rounded-lg p-4 hover:bg-crowe-accent/10 transition-colors cursor-pointer"
                onClick={() => onProductClick?.(product)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-crowe-secondary/20 rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-crowe-accent">
                      {product.title}
                    </h4>
                    <p className="text-sm text-crowe-text/80 mt-1">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-crowe-accent">
                        {formatPrice(product.price, product.currencyCode)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onCreateCheckout?.([{ productId: product.id, quantity: 1 }])
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-crowe-accent text-crowe-black rounded-lg hover:bg-crowe-secondary transition-colors text-sm font-medium"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                    </div>
                    {product.metafields && (
                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                        {product.metafields.co2Level && (
                          <div className="text-crowe-text/60">
                            CO₂: {product.metafields.co2Level}
                          </div>
                        )}
                        {product.metafields.temperature && (
                          <div className="text-crowe-text/60">
                            Temp: {product.metafields.temperature}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      case 'formula':
        const formula = response.metadata?.formula
        if (!formula) return null
        
        const formulaText = `${formula.name}\n\nIngredients:\n${formula.ingredients
          .map(i => `${i.name}: ${i.percentage}%`)
          .join('\n')}\n\nHydration: ${formula.hydration}%\npH: ${formula.ph}`
        
        return (
          <div className="space-y-2">
            {response.content && (
              <p className="text-crowe-text mb-2">{response.content}</p>
            )}
            <div className="bg-crowe-black/20 rounded-lg p-4 font-mono text-sm">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-crowe-accent">
                  {formula.name}
                </h4>
                <button
                  onClick={() => copyFormula(formula.id, formulaText)}
                  className="text-crowe-text/60 hover:text-crowe-accent transition-colors"
                >
                  {copiedFormula === formula.id ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <h5 className="text-crowe-secondary text-xs uppercase mb-2">
                    Ingredients
                  </h5>
                  {formula.ingredients.map((ingredient, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-crowe-text/80"
                    >
                      <span>{ingredient.name}</span>
                      <span>{ingredient.percentage}%</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-crowe-secondary/20 pt-3 flex gap-6 text-crowe-text/80">
                  <div>
                    <span className="text-crowe-secondary text-xs">Hydration:</span>{' '}
                    {formula.hydration}%
                  </div>
                  <div>
                    <span className="text-crowe-secondary text-xs">pH:</span>{' '}
                    {formula.ph}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onCreateCheckout?.([{ productId: 'substrate_mix', quantity: 1 }])}
                  className="flex-1 px-4 py-2 bg-crowe-accent text-crowe-black rounded-lg hover:bg-crowe-secondary transition-colors text-sm font-medium"
                >
                  Create Checkout
                </button>
                <button className="px-4 py-2 border border-crowe-secondary/20 text-crowe-text rounded-lg hover:bg-crowe-secondary/10 transition-colors text-sm">
                  Save Formula
                </button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full bg-crowe-dark rounded-xl border border-crowe-secondary/20">
      {/* Header */}
      <div className="p-4 border-b border-crowe-secondary/20">
        <h2 className="text-xl font-bold text-crowe-accent flex items-center gap-2">
          <Brain className="w-6 h-6" />
          Crowe Logic™
        </h2>
        <p className="text-sm text-crowe-text/60 mt-1">
          Your myco-intelligent cultivation assistant
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-crowe-text/40 mt-8">
            <p>Ask me about mushroom cultivation, growing techniques,</p>
            <p>substrate formulas, or product recommendations.</p>
          </div>
        )}
        
        {messages.map(message => (
          <div
            key={message.id}
            className={cn(
              "animate-fade-in",
              message.role === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[80%]'
            )}
          >
            {message.role === 'user' ? (
              <div className="bg-crowe-accent/10 rounded-lg p-3 text-crowe-text">
                {message.content}
              </div>
            ) : (
              <div className="space-y-3">
                {message.responses?.map(response => (
                  <div
                    key={response.id}
                    className="bg-crowe-dark/5 rounded-lg p-4 border border-crowe-secondary/20"
                  >
                    {renderResponse(response)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-crowe-text/60">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Analyzing your request...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-crowe-secondary/20">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about mushroom cultivation..."
            className="flex-1 px-4 py-3 bg-crowe-light/10 text-crowe-text rounded-lg border border-crowe-secondary/20 focus:outline-none focus:border-crowe-accent placeholder:text-crowe-text/40"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              "p-3 rounded-lg transition-colors",
              input.trim() && !isLoading
                ? "bg-crowe-accent text-crowe-black hover:bg-crowe-secondary"
                : "bg-crowe-secondary/20 text-crowe-text/40 cursor-not-allowed"
            )}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  )
}