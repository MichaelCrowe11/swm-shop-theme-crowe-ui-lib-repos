'use client'

import React from 'react'
import { Thermometer, Droplets, Wind, Leaf, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MetafieldCalloutProps } from '@/types'

const iconMap = {
  temperature: Thermometer,
  humidity: Droplets,
  co2: Wind,
  substrate: Leaf,
  time: Clock,
}

export function MetafieldCallout({ 
  metafields, 
  variant = 'inline' 
}: MetafieldCalloutProps) {
  if (!metafields || Object.keys(metafields).length === 0) {
    return null
  }

  const fields = [
    {
      label: 'CO₂ Level',
      value: metafields.co2Level,
      icon: 'co2',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      label: 'Temperature',
      value: metafields.temperature,
      icon: 'temperature',
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
    },
    {
      label: 'Substrate',
      value: metafields.substrate,
      icon: 'substrate',
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      label: 'Humidity',
      value: metafields.humidity,
      icon: 'humidity',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
    },
    {
      label: 'Growth Time',
      value: metafields.growthTime,
      icon: 'time',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
  ].filter(field => field.value)

  if (fields.length === 0) return null

  if (variant === 'card') {
    return (
      <div className="bg-crowe-dark/50 rounded-xl border border-crowe-secondary/20 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-crowe-accent mb-4">
          Growing Specifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => {
            const Icon = iconMap[field.icon as keyof typeof iconMap]
            return (
              <div
                key={field.label}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg",
                  field.bgColor
                )}
              >
                <div className={cn("p-2 rounded-lg", field.bgColor)}>
                  <Icon className={cn("w-5 h-5", field.color)} />
                </div>
                <div>
                  <p className="text-xs text-crowe-text/60">{field.label}</p>
                  <p className="font-medium text-crowe-text">{field.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Inline variant
  return (
    <div className="flex flex-wrap gap-3">
      {fields.map((field) => {
        const Icon = iconMap[field.icon as keyof typeof iconMap]
        return (
          <div
            key={field.label}
            className="flex items-center gap-2 px-3 py-2 bg-crowe-dark/30 rounded-lg border border-crowe-secondary/10"
          >
            <Icon className={cn("w-4 h-4", field.color)} />
            <span className="text-sm">
              <span className="text-crowe-text/60">{field.label}:</span>{' '}
              <span className="text-crowe-text font-medium">{field.value}</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}

// Visual gauge component for special cases
interface GaugeProps {
  value: number
  max: number
  label: string
  color: string
}

export function Gauge({ value, max, label, color }: GaugeProps) {
  const percentage = (value / max) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-crowe-text/60">{label}</span>
        <span className="text-crowe-text font-medium">
          {value}/{max}
        </span>
      </div>
      <div className="h-2 bg-crowe-dark/20 rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}