import { NextRequest, NextResponse } from 'next/server'
import type { ChatMessage, CroweResponse } from '@/types'

// In production, you would use your actual AI API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-api-key'

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'No message provided' },
        { status: 400 }
      )
    }

    // Create system prompt for Crowe Logic™ persona
    const systemPrompt = `You are Crowe Logic™, a myco-intelligent cultivation assistant for Southwest Mushrooms. 
You help cultivators with mushroom growing advice, product recommendations, and substrate formulas.
Speak with a warm, confident tone like a mentor guiding a cultivator.
Provide actionable steps and specific growing tips.
When recommending products, mention their metafield specifications (temperature, humidity, CO2, substrate).
Frame responses in the context of regenerative cultivation and mycological wisdom.`

    // For now, generate mock responses - in production, call OpenAI/Claude API
    const responses = await generateCroweResponses(message, conversationHistory)

    return NextResponse.json({
      responses,
      timestamp: new Date()
    })
  } catch (error) {
    console.error('Chat route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Mock response generator - replace with actual AI API call
async function generateCroweResponses(
  message: string, 
  history?: ChatMessage[]
): Promise<CroweResponse[]> {
  const lowerMessage = message.toLowerCase()
  
  // Context-aware responses based on keywords
  if (lowerMessage.includes('oyster') || lowerMessage.includes('pleurotus')) {
    return [
      {
        id: Date.now().toString(),
        type: 'text',
        content: 'Ah, oyster mushrooms—nature\'s prolific decomposers! They\'re perfect for beginners because they\'re remarkably forgiving and grow rapidly. Let me share some wisdom about cultivating Pleurotus species.',
        timestamp: new Date()
      },
      {
        id: (Date.now() + 1).toString(),
        type: 'text',
        content: 'The key to successful oyster cultivation is maintaining proper fresh air exchange. They need CO₂ levels below 600 ppm during fruiting, which means good ventilation is crucial. I recommend starting with our Blue Oyster kit.',
        timestamp: new Date()
      },
      {
        id: (Date.now() + 2).toString(),
        type: 'product_recommendation',
        content: 'Here\'s the perfect starter kit for your oyster journey:',
        metadata: {
          products: [
            {
              id: 'blue-oyster-kit',
              title: 'Blue Oyster Starter Kit',
              description: 'Cold-loving strain, fruits in 7-10 days',
              price: 32.00,
              currencyCode: 'USD',
              image: { url: '/api/placeholder/400/400', altText: 'Blue Oyster Kit' },
              metafields: {
                co2Level: '≤ 600 ppm',
                temperature: '65-75°F',
                substrate: 'Straw + Hardwood',
                humidity: '85-95%',
                growthTime: '7-10 days'
              }
            }
          ]
        },
        timestamp: new Date()
      }
    ]
  }

  if (lowerMessage.includes('substrate') || lowerMessage.includes('recipe')) {
    return [
      {
        id: Date.now().toString(),
        type: 'text',
        content: 'Creating the perfect substrate is like preparing soil for a garden—it\'s the foundation of abundant yields. Let me share a time-tested formula that\'s been refined through countless grows.',
        timestamp: new Date()
      },
      {
        id: (Date.now() + 1).toString(),
        type: 'formula',
        content: 'Master\'s Mix - High Yield Formula',
        metadata: {
          formula: {
            id: 'masters-mix',
            name: 'Master\'s Mix for Gourmet Mushrooms',
            ingredients: [
              { name: 'Hardwood Pellets', percentage: 40 },
              { name: 'Soy Hull Pellets', percentage: 40 },
              { name: 'Wheat Bran', percentage: 18 },
              { name: 'Gypsum', percentage: 2 }
            ],
            hydration: 65,
            ph: 6.5
          }
        },
        timestamp: new Date()
      },
      {
        id: (Date.now() + 2).toString(),
        type: 'text',
        content: 'This formula provides the perfect balance of nutrition and structure. The hardwood gives long-term nutrition, soy hulls provide nitrogen, wheat bran jumpstarts colonization, and gypsum helps with pH buffering and prevents clumping.',
        timestamp: new Date()
      }
    ]
  }

  // Default response
  return [
    {
      id: Date.now().toString(),
      type: 'text',
      content: `I understand you're asking about "${message}". As your myco-intelligent guide, I'm here to help you succeed in mushroom cultivation. Could you tell me more about your growing setup or what specific aspect you'd like to explore?`,
      timestamp: new Date()
    },
    {
      id: (Date.now() + 1).toString(),
      type: 'text',
      content: 'Whether you\'re interested in growing techniques, choosing the right species, substrate formulation, or troubleshooting, I can provide guidance tailored to your needs.',
      timestamp: new Date()
    }
  ]
}