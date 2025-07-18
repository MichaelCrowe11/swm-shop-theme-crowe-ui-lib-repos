import { NextRequest, NextResponse } from 'next/server'

const ELEVENLABS_API_KEY = 'api-sk_d07dc3e1a86f50a55adb3e45cf3aae018b1a326e65b9fb8d'
const ELEVENLABS_STT_URL = 'https://api.elevenlabs.io/v1/speech-to-text'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Convert the audio file to a format ElevenLabs accepts
    const audioBuffer = await audioFile.arrayBuffer()
    const audioBlob = new Blob([audioBuffer], { type: audioFile.type })

    // Create form data for ElevenLabs
    const elevenLabsFormData = new FormData()
    elevenLabsFormData.append('audio', audioBlob, 'audio.webm')

    // Send to ElevenLabs STT API
    const response = await fetch(ELEVENLABS_STT_URL, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: elevenLabsFormData
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('ElevenLabs STT error:', error)
      return NextResponse.json(
        { error: 'Speech-to-text processing failed' },
        { status: 500 }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      text: data.text || data.transcription || '',
      confidence: data.confidence
    })
  } catch (error) {
    console.error('STT route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}