'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MicButtonProps {
  onTranscription?: (text: string) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function MicButton({ onTranscription, className, size = 'md' }: MicButtonProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      })
      
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        await sendToSTT(audioBlob)
        
        // Clean up
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please check your permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const sendToSTT = async (audioBlob: Blob) => {
    setIsProcessing(true)
    
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch('/api/stt', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('STT request failed')
      }

      const { text } = await response.json()
      onTranscription?.(text)
    } catch (error) {
      console.error('Error processing audio:', error)
      alert('Error processing audio. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClick = () => {
    if (isRecording) {
      stopRecording()
    } else if (!isProcessing) {
      startRecording()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing}
      className={cn(
        'relative rounded-full transition-all duration-300',
        'flex items-center justify-center',
        sizeClasses[size],
        isRecording 
          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
          : 'bg-crowe-accent hover:bg-crowe-secondary',
        isProcessing && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
    >
      {isProcessing ? (
        <Loader2 
          size={iconSizes[size]} 
          className="animate-spin text-crowe-black" 
        />
      ) : isRecording ? (
        <MicOff 
          size={iconSizes[size]} 
          className="text-white" 
        />
      ) : (
        <Mic 
          size={iconSizes[size]} 
          className="text-crowe-black" 
        />
      )}
      
      {/* Recording indicator */}
      {isRecording && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
      )}
    </button>
  )
}

// Voice activity visualizer component
export function VoiceVisualizer({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex items-center gap-1 h-6">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-1 bg-crowe-accent rounded-full transition-all duration-150',
            isActive ? 'animate-pulse' : 'h-2'
          )}
          style={{
            height: isActive ? `${Math.random() * 16 + 8}px` : '8px',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  )
}