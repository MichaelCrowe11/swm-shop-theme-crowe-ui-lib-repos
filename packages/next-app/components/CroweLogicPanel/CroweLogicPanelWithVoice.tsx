'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader2, ShoppingCart, Copy, Check, Brain, Volume2, VolumeX, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import { MicButton, VoiceVisualizer } from '@/components/MicButton'
import type { ChatMessage, CroweResponse, Product } from '@/types'

interface CroweLogicPanelProps {
  onCreateCheckout?: (items: { productId: string; quantity: number }[]) => void
  onProductClick?: (product: Product) => void
  enableVoice?: boolean
  checkoutConfig?: {
    domain: string
    storefrontToken: string
  }
  elevenLabsConfig?: {
    apiKey: string
    voiceId: string
    model?: string
  }
}

export function CroweLogicPanelWithVoice({ 
  onCreateCheckout, 
  onProductClick,
  enableVoice = true,
  checkoutConfig,
  elevenLabsConfig
}: CroweLogicPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null)
  const [autoPlayVoice, setAutoPlayVoice] = useState(true)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleVoiceTranscription = (text: string) => {
    setInput(text)
    // Optionally auto-submit after voice transcription
    if (text.trim()) {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent, text)
    }
  }

  const playVoiceResponse = async (text: string) => {
    try {
      setIsPlayingAudio(true)
      
      // Use ElevenLabs if configured, otherwise fall back to API route
      if (elevenLabsConfig?.apiKey && elevenLabsConfig?.voiceId) {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsConfig.voiceId}`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': elevenLabsConfig.apiKey
          },
          body: JSON.stringify({
            text,
            model_id: elevenLabsConfig.model || 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          })
        })
        
        if (response.ok) {
          const audioBlob = await response.blob()
          const audioUrl = URL.createObjectURL(audioBlob)
          
          if (audioRef.current) {
            audioRef.current.src = audioUrl
            await audioRef.current.play()
          }
          
          // Clean up URL after playing
          audioRef.current?.addEventListener('ended', () => {
            URL.revokeObjectURL(audioUrl)
          }, { once: true })
        }
      } else {
        // Fallback to API route
        const response = await fetch('/api/voice-agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            text,
            conversationHistory: messages 
          })
        })

        if (!response.ok) {
          throw new Error('Voice synthesis failed')
        }

        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)

        if (audioRef.current) {
          audioRef.current.src = audioUrl
          await audioRef.current.play()
        }
      }
    } catch (error) {
      console.error('Error playing voice response:', error)
      // Fallback to browser speech synthesis
      const utterance = new SpeechSynthesisUtterance(text)
      speechSynthesis.speak(utterance)
    } finally {
      setIsPlayingAudio(false)
    }
  }

  const addToCart = (productId: string, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId)
      if (existing) {
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { productId, quantity }]
    })
    
    // Voice confirmation
    if (autoPlayVoice) {
      playVoiceResponse("Added to your regenerative collection. The mycelial network grows stronger.")
    }
  }

  const initiateCheckout = async () => {
    if (cart.length === 0) {
      if (autoPlayVoice) {
        playVoiceResponse("Your cart appears empty. Let me help you find something from our mycelial offerings.")
      }
      return
    }

    if (!checkoutConfig) {
      onCreateCheckout?.(cart)
      return
    }

    try {
      // Enhanced Shopify Storefront API checkout
      const response = await fetch(`https://${checkoutConfig.domain}/api/2023-10/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': checkoutConfig.storefrontToken
        },
        body: JSON.stringify({
          query: `
            mutation checkoutCreate($input: CheckoutCreateInput!) {
              checkoutCreate(input: $input) {
                checkout {
                  id
                  webUrl
                  totalPrice {
                    amount
                  }
                }
                checkoutUserErrors {
                  field
                  message
                }
              }
            }
          `,
          variables: {
            input: {
              lineItems: cart.map(item => ({
                variantId: `gid://shopify/ProductVariant/${item.productId}`,
                quantity: item.quantity
              }))
            }
          }
        })
      })
      
      const data = await response.json()
      
      if (data.data?.checkoutCreate?.checkout?.webUrl) {
        if (autoPlayVoice) {
          playVoiceResponse("Redirecting to secure checkout. Your journey into regenerative commerce continues.")
        }
        window.open(data.data.checkoutCreate.checkout.webUrl, '_blank')
        setCart([]) // Clear cart after successful checkout
      } else {
        throw new Error('Checkout creation failed')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      if (autoPlayVoice) {
        playVoiceResponse("Checkout encountered a temporary issue. Please try again or contact our cultivation team.")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent, voiceText?: string) => {
    e.preventDefault()
    const messageText = voiceText || input.trim()
    if (!messageText || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Call the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          conversationHistory: messages
        })
      })

      if (!response.ok) {
        throw new Error('Chat request failed')
      }

      const { responses } = await response.json()
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        responses: responses,
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, aiMessage])

      // Auto-play voice if enabled
      if (autoPlayVoice && enableVoice && responses.length > 0) {
        const textContent = responses
          .filter((r: CroweResponse) => r.type === 'text')
          .map((r: CroweResponse) => r.content)
          .join(' ')
        
        if (textContent) {
          await playVoiceResponse(textContent)
        }
      }
    } catch (error) {
      console.error('Error in chat:', error)
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        responses: [{
          id: 'error',
          type: 'text',
          content: 'I apologize, but I encountered an error. Please try again.',
          timestamp: new Date()
        }],
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
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
          <div className="flex items-start gap-2">
            <div className="flex-1 text-crowe-text leading-relaxed">
              {response.content}
            </div>
            {enableVoice && (
              <button
                onClick={() => playVoiceResponse(response.content)}
                className="p-2 hover:bg-crowe-secondary/10 rounded-lg transition-colors"
                disabled={isPlayingAudio}
                title="Play voice"
              >
                <Volume2 size={16} className="text-crowe-text/60" />
              </button>
            )}
          </div>
        )

      case 'product_recommendation':
        return (
          <div className="space-y-3">
            {response.content && (
              <div className="flex items-start gap-2">
                <p className="flex-1 text-crowe-text mb-2">{response.content}</p>
                {enableVoice && (
                  <button
                    onClick={() => playVoiceResponse(response.content)}
                    className="p-2 hover:bg-crowe-secondary/10 rounded-lg transition-colors"
                    disabled={isPlayingAudio}
                    title="Play voice"
                  >
                    <Volume2 size={16} className="text-crowe-text/60" />
                  </button>
                )}
              </div>
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
                          addToCart(product.id, 1)
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
              <div className="flex items-start gap-2">
                <p className="flex-1 text-crowe-text mb-2">{response.content}</p>
                {enableVoice && (
                  <button
                    onClick={() => playVoiceResponse(response.content)}
                    className="p-2 hover:bg-crowe-secondary/10 rounded-lg transition-colors"
                    disabled={isPlayingAudio}
                    title="Play voice"
                  >
                    <Volume2 size={16} className="text-crowe-text/60" />
                  </button>
                )}
              </div>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-crowe-accent" />
            <h2 className="text-xl font-bold text-crowe-accent">
              Crowe Logic™
            </h2>
          </div>
          {enableVoice && (
            <div className="flex items-center gap-3">
              {isPlayingAudio && <VoiceVisualizer isActive={true} />}
              <button
                onClick={() => setAutoPlayVoice(!autoPlayVoice)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  autoPlayVoice 
                    ? "bg-crowe-accent/10 text-crowe-accent" 
                    : "text-crowe-text/40 hover:text-crowe-text"
                )}
                title={autoPlayVoice ? "Disable auto-play voice" : "Enable auto-play voice"}
              >
                {autoPlayVoice ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
            </div>
          )}
        </div>
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
            {enableVoice && (
              <p className="mt-2 text-sm">
                <Mic size={16} className="inline mr-1" />
                Click the mic button to use voice input
              </p>
            )}
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

      {/* Cart Section */}
      {cart.length > 0 && (
        <div className="px-4 py-3 border-t border-crowe-secondary/20 bg-crowe-light/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-crowe-accent">
              Cart ({cart.length} items)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCart([])}
                className="text-xs text-crowe-text/60 hover:text-crowe-text transition-colors"
              >
                Clear
              </button>
              <button
                onClick={initiateCheckout}
                className="flex items-center gap-1 px-3 py-1 bg-crowe-accent text-crowe-black rounded text-xs font-medium hover:bg-crowe-secondary transition-colors"
              >
                <ShoppingCart size={12} />
                Checkout
              </button>
            </div>
          </div>
          <div className="text-xs text-crowe-text/60">
            Ready for regenerative commerce
          </div>
        </div>
      )}

      {/* Voice Controls */}
      {enableVoice && (
        <div className="px-4 py-2 border-t border-crowe-secondary/20 bg-crowe-light/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-crowe-text/60">Voice Assistant</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoPlayVoice(!autoPlayVoice)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
                  autoPlayVoice
                    ? "bg-crowe-accent/20 text-crowe-accent"
                    : "text-crowe-text/60 hover:text-crowe-text"
                )}
              >
                {autoPlayVoice ? <Volume2 size={12} /> : <VolumeX size={12} />}
                Auto-play
              </button>
              {isPlayingAudio && (
                <div className="flex items-center gap-1 text-xs text-crowe-accent">
                  <div className="w-2 h-2 bg-crowe-accent rounded-full animate-pulse" />
                  Speaking...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
          {enableVoice && (
            <MicButton 
              onTranscription={handleVoiceTranscription}
              size="md"
            />
          )}
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

      {/* Hidden audio element */}
      <audio ref={audioRef} className="hidden" onEnded={() => setIsPlayingAudio(false)} />
    </div>
  )
}