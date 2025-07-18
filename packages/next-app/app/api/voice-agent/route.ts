import { NextRequest, NextResponse } from 'next/server'

const ELEVENLABS_API_KEY = 'api-sk_d07dc3e1a86f50a55adb3e45cf3aae018b1a326e65b9fb8d'
const ELEVENLABS_AGENT_ID = 'agent_01jz4jgxksfj7v6tkc6f1g7d9y'
const ELEVENLABS_AGENT_URL = `https://api.elevenlabs.io/v1/agents/${ELEVENLABS_AGENT_ID}/infer`

export async function POST(request: NextRequest) {
  try {
    const { text, conversationHistory } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      )
    }

    // Prepare the request for ElevenLabs Agent API
    const agentRequest = {
      text,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        use_speaker_boost: true
      },
      conversation: conversationHistory || []
    }

    // Send to ElevenLabs Agent API
    const response = await fetch(ELEVENLABS_AGENT_URL, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agentRequest)
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('ElevenLabs Agent error:', error)
      return NextResponse.json(
        { error: 'Voice synthesis failed' },
        { status: 500 }
      )
    }

    // Stream the audio response
    const audioData = await response.arrayBuffer()
    
    return new NextResponse(audioData, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioData.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('Voice agent route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}