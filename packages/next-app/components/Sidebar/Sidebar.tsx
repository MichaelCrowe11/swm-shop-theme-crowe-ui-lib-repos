'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sprout,
  Package,
  Headphones,
  BookOpen,
  Brain,
  ShoppingCart,
  Menu,
  X,
  Mic,
  Zap,
  Cpu,
  Activity,
  Eye,
  Wifi
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem, SidebarProps } from '@/types'

const navItems: NavItem[] = [
  { label: 'Neural Dashboard', href: '/', icon: 'Sprout', neuralType: 'growth', priority: 1 },
  { label: 'Quantum Products', href: '/products', icon: 'Package', neuralType: 'commerce', priority: 2 },
  { label: 'Bio-Audio', href: '/audiobook', icon: 'Headphones', neuralType: 'sensory', priority: 3 },
  { label: 'Cultivation Guides', href: '/guides', icon: 'BookOpen', neuralType: 'knowledge', priority: 4 },
  { label: 'Crowe Logic AI', href: '/crowe-logic', icon: 'Brain', hasVoice: true, neuralType: 'intelligence', priority: 5 },
  { label: 'Quantum Cart', href: '/cart', icon: 'ShoppingCart', badge: 0, neuralType: 'transaction', priority: 6 },
]

// AI behavior patterns for adaptive sidebar
interface AIBehaviorPattern {
  visitFrequency: number
  timeSpent: number
  interactionType: 'hover' | 'click' | 'voice' | 'gesture'
  lastVisit: number
  neuralActivation: number
}

// Biometric feedback simulation
interface BiometricData {
  heartRate: number
  focusLevel: number
  stressLevel: number
  engagementScore: number
}

// Particle system for neural network
interface NeuralParticle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
  connectionStrength: number
}

const iconMap = {
  Sprout,
  Package,
  Headphones,
  BookOpen,
  Brain,
  ShoppingCart,
  Mic,
  Zap,
  Cpu,
  Activity,
  Eye,
  Wifi,
}

// Neural activity color mapping
const neuralColors = {
  growth: { primary: '#4ADE80', secondary: '#22C55E', tertiary: '#15803D' },
  commerce: { primary: '#F59E0B', secondary: '#D97706', tertiary: '#92400E' },
  sensory: { primary: '#8B5CF6', secondary: '#7C3AED', tertiary: '#5B21B6' },
  knowledge: { primary: '#06B6D4', secondary: '#0891B2', tertiary: '#0E7490' },
  intelligence: { primary: '#EC4899', secondary: '#DB2777', tertiary: '#BE185D' },
  transaction: { primary: '#EF4444', secondary: '#DC2626', tertiary: '#B91C1C' },
} as const

export function Sidebar({ 
  isOpen = true, 
  onToggle, 
  currentPath 
}: SidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [neuralActivity, setNeuralActivity] = useState<Record<string, number>>({})
  const [particles, setParticles] = useState<NeuralParticle[]>([])
  const [biometrics, setBiometrics] = useState<BiometricData>({
    heartRate: 72,
    focusLevel: 0.7,
    stressLevel: 0.3,
    engagementScore: 0.8
  })
  const [aiLearning, setAiLearning] = useState<Record<string, AIBehaviorPattern>>({})
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const activePath = currentPath || pathname

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen)
    onToggle?.()
    
    // Trigger neural activity burst
    setNeuralActivity(prev => ({
      ...prev,
      system: Math.min((prev.system || 0) + 0.3, 1)
    }))
  }

  // AI Learning System - tracks user behavior patterns
  const trackUserInteraction = useCallback((href: string, type: 'hover' | 'click' | 'voice') => {
    const now = Date.now()
    setAiLearning(prev => {
      const current = prev[href] || {
        visitFrequency: 0,
        timeSpent: 0,
        interactionType: type,
        lastVisit: now,
        neuralActivation: 0
      }
      
      return {
        ...prev,
        [href]: {
          ...current,
          visitFrequency: current.visitFrequency + 1,
          interactionType: type,
          lastVisit: now,
          neuralActivation: Math.min(current.neuralActivation + 0.1, 1)
        }
      }
    })

    // Update neural activity for the interacted item
    const item = navItems.find(item => item.href === href)
    if (item?.neuralType) {
      setNeuralActivity(prev => ({
        ...prev,
        [item.neuralType]: Math.min((prev[item.neuralType] || 0) + 0.2, 1)
      }))
    }
  }, [])

  // Biometric simulation - creates realistic feedback patterns
  useEffect(() => {
    const biometricInterval = setInterval(() => {
      setBiometrics(prev => {
        const time = Date.now() / 1000
        const heartRateVariation = Math.sin(time * 0.1) * 3 + Math.random() * 2
        const focusFluctuation = Math.sin(time * 0.05) * 0.1 + (Math.random() - 0.5) * 0.05
        const stressWave = Math.sin(time * 0.03) * 0.1 + (Math.random() - 0.5) * 0.02
        
        return {
          heartRate: Math.max(60, Math.min(100, 72 + heartRateVariation)),
          focusLevel: Math.max(0, Math.min(1, prev.focusLevel + focusFluctuation)),
          stressLevel: Math.max(0, Math.min(1, prev.stressLevel + stressWave)),
          engagementScore: Math.max(0, Math.min(1, (prev.focusLevel + (1 - prev.stressLevel)) / 2))
        }
      })
    }, 2000)
    
    return () => clearInterval(biometricInterval)
  }, [])

  // Neural Particle System - creates living mycelial connections
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      canvas.style.width = canvas.offsetWidth + 'px'
      canvas.style.height = canvas.offsetHeight + 'px'
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // Initialize particles
    const initParticles = () => {
      const newParticles: NeuralParticle[] = []
      const particleCount = 25
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: `particle-${i}`,
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random() * 1000 + 500,
          maxLife: 1000,
          color: `hsl(${Math.random() * 60 + 30}, 70%, 60%)`,
          size: Math.random() * 3 + 1,
          connectionStrength: Math.random()
        })
      }
      
      setParticles(newParticles)
    }
    
    initParticles()
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      
      setParticles(prevParticles => {
        const updatedParticles = prevParticles.map(particle => {
          // Update position with organic movement
          const time = Date.now() / 1000
          particle.x += particle.vx + Math.sin(time + particle.life * 0.001) * 0.1
          particle.y += particle.vy + Math.cos(time + particle.life * 0.001) * 0.1
          
          // Boundary wrapping
          if (particle.x < 0) particle.x = canvas.offsetWidth
          if (particle.x > canvas.offsetWidth) particle.x = 0
          if (particle.y < 0) particle.y = canvas.offsetHeight
          if (particle.y > canvas.offsetHeight) particle.y = 0
          
          // Age particle
          particle.life -= 1
          
          return particle
        }).filter(particle => particle.life > 0)
        
        // Add new particles occasionally
        if (Math.random() < 0.02 && updatedParticles.length < 30) {
          updatedParticles.push({
            id: `particle-${Date.now()}-${Math.random()}`,
            x: Math.random() * canvas.offsetWidth,
            y: Math.random() * canvas.offsetHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            life: Math.random() * 1000 + 500,
            maxLife: 1000,
            color: `hsl(${Math.random() * 60 + 30}, 70%, 60%)`,
            size: Math.random() * 3 + 1,
            connectionStrength: Math.random()
          })
        }
        
        // Draw particles and connections
        updatedParticles.forEach((particle, i) => {
          const opacity = particle.life / particle.maxLife
          
          // Draw particle
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * opacity, 0, Math.PI * 2)
          ctx.fillStyle = particle.color.replace(')', `, ${opacity})`).replace('hsl', 'hsla')
          ctx.fill()
          
          // Draw connections to nearby particles
          updatedParticles.slice(i + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < 80) {
              const connectionOpacity = (1 - distance / 80) * 0.3 * opacity
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = `hsla(45, 70%, 60%, ${connectionOpacity})`
              ctx.lineWidth = 1
              ctx.stroke()
            }
          })
        })
        
        return updatedParticles
      })
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Neural activity decay
  useEffect(() => {
    const decayInterval = setInterval(() => {
      setNeuralActivity(prev => {
        const decayed = { ...prev }
        Object.keys(decayed).forEach(key => {
          decayed[key] = Math.max(0, decayed[key] - 0.01)
        })
        return decayed
      })
    }, 100)
    
    return () => clearInterval(decayInterval)
  }, [])

  return (
    <>
      {/* Neural Activity Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-sidebar h-full pointer-events-none z-30 opacity-60"
        style={{ 
          background: 'linear-gradient(180deg, rgba(13,13,13,0.95) 0%, rgba(23,20,30,0.9) 100%)',
          backdropFilter: 'blur(20px) saturate(150%)',
        }}
      />
      
      {/* Biometric Display - Top Right */}
      <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-lg rounded-lg p-3 border border-crowe-accent/30 lg:block hidden">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Activity size={12} className="text-green-400" />
            <span className="text-green-400 font-mono">{Math.round(biometrics.heartRate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={12} className="text-blue-400" />
            <span className="text-blue-400 font-mono">{Math.round(biometrics.focusLevel * 100)}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap size={12} className="text-yellow-400" />
            <span className="text-yellow-400 font-mono">{Math.round(biometrics.engagementScore * 100)}%</span>
          </div>
        </div>
      </div>
      
      {/* Quantum Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className={cn(
          "fixed top-4 left-4 z-50 lg:hidden p-3 rounded-lg transition-all duration-300",
          "bg-gradient-to-br from-crowe-dark/90 to-crowe-black/95",
          "backdrop-blur-xl border border-crowe-accent/40",
          "hover:scale-110 active:scale-95",
          "shadow-2xl shadow-crowe-accent/20",
          isMobileOpen ? "rotate-180" : "rotate-0"
        )}
      >
        <div className="relative">
          {isMobileOpen ? <X size={24} className="text-crowe-accent" /> : <Menu size={24} className="text-crowe-accent" />}
          {neuralActivity.system > 0 && (
            <div 
              className="absolute -top-1 -right-1 w-3 h-3 bg-crowe-accent rounded-full animate-pulse"
              style={{ opacity: neuralActivity.system }}
            />
          )}
        </div>
      </button>

      {/* Revolutionary Living Mycelial Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-sidebar z-40 transition-all duration-500 ease-out",
          "bg-gradient-to-b from-black/95 via-crowe-dark/90 to-black/95",
          "border-r border-crowe-accent/30 backdrop-blur-2xl",
          "shadow-2xl shadow-crowe-accent/10",
          "lg:translate-x-0 lg:scale-100",
          isMobileOpen ? "translate-x-0 scale-100" : "-translate-x-full scale-95",
          "transform-gpu perspective-1000"
        )}
        style={{
          background: `
            linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(13,13,13,0.9) 50%, rgba(23,20,30,0.95) 100%),
            radial-gradient(ellipse at 20% 30%, rgba(198,163,81,0.1) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 70%, rgba(201,184,138,0.08) 0%, transparent 50%)
          `,
          boxShadow: `
            0 0 50px rgba(198,163,81,0.15),
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.5)
          `
        }}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Neural Status Indicators */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
            {Object.entries(neuralActivity).map(([type, activity]) => (
              activity > 0.1 && (
                <div 
                  key={type}
                  className="w-2 h-8 bg-gradient-to-t from-transparent to-crowe-accent rounded-full"
                  style={{ 
                    opacity: activity,
                    background: `linear-gradient(to top, transparent, ${neuralColors[type as keyof typeof neuralColors]?.primary || '#C6A351'})` 
                  }}
                />
              )
            ))}
          </div>
          
          {/* Quantum Brand Header */}
          <div className="p-6 border-b border-gradient-to-r from-transparent via-crowe-accent/30 to-transparent relative">
            <div className="absolute inset-0 bg-gradient-radial from-crowe-accent/10 to-transparent opacity-50" />
            <Link href="/" className="block relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Cpu className="w-8 h-8 text-crowe-accent animate-pulse" />
                  <div className="absolute inset-0 w-8 h-8 border border-crowe-accent/50 rounded animate-ping" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-crowe-accent to-crowe-secondary bg-clip-text text-transparent">
                    Crowe Logic™
                  </h1>
                  <p className="text-xs text-crowe-text/70 mt-1 flex items-center gap-1">
                    <Wifi size={10} className="text-green-400 animate-pulse" />
                    Neural Interface Active
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Quantum Neural Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto relative">
            <ul className="space-y-3">
              {navItems.map((item, index) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap]
                const isActive = activePath === item.href
                const neuralLevel = neuralActivity[item.neuralType || ''] || 0
                const aiData = aiLearning[item.href]
                const neuralColor = neuralColors[item.neuralType as keyof typeof neuralColors] || neuralColors.intelligence
                
                return (
                  <li key={item.href} className="relative">
                    {/* Neural Connection Line */}
                    {neuralLevel > 0.1 && (
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-current to-transparent rounded-full"
                        style={{ 
                          color: neuralColor.primary,
                          opacity: neuralLevel,
                          animation: `pulse ${2 - neuralLevel}s ease-in-out infinite`
                        }}
                      />
                    )}
                    
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden",
                        "hover:scale-105 hover:shadow-lg transform-gpu",
                        isActive 
                          ? "bg-gradient-to-r from-crowe-accent/20 to-crowe-secondary/10 text-crowe-accent border border-crowe-accent/50 shadow-lg shadow-crowe-accent/20" 
                          : "text-crowe-text hover:bg-gradient-to-r hover:from-crowe-accent/10 hover:to-transparent hover:text-crowe-accent hover:border-crowe-accent/30 border border-transparent"
                      )}
                      onClick={() => {
                        setIsMobileOpen(false)
                        trackUserInteraction(item.href, 'click')
                      }}
                      onMouseEnter={() => trackUserInteraction(item.href, 'hover')}
                    >
                      {/* Background Neural Glow */}
                      {neuralLevel > 0.2 && (
                        <div 
                          className="absolute inset-0 bg-gradient-radial from-current/20 to-transparent opacity-50"
                          style={{ color: neuralColor.primary }}
                        />
                      )}
                      
                      {/* Icon with quantum effects */}
                      <div className="relative z-10">
                        <Icon 
                          size={22} 
                          className={cn(
                            "transition-all duration-300",
                            isActive ? "drop-shadow-lg" : "group-hover:scale-110",
                            neuralLevel > 0.3 ? "animate-pulse" : ""
                          )}
                          style={{
                            color: isActive ? neuralColor.primary : undefined,
                            filter: neuralLevel > 0.2 ? `drop-shadow(0 0 8px ${neuralColor.primary}40)` : undefined
                          }}
                        />
                        
                        {/* Neural activity indicator */}
                        {neuralLevel > 0.15 && (
                          <div 
                            className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping"
                            style={{ backgroundColor: neuralColor.primary, opacity: neuralLevel }}
                          />
                        )}
                      </div>
                      
                      {/* Label with AI learning indicator */}
                      <div className="flex-1 z-10">
                        <span className={cn(
                          "font-medium transition-all duration-300",
                          isActive ? "font-semibold" : "group-hover:font-semibold"
                        )}>
                          {item.label}
                        </span>
                        
                        {/* AI Learning Progress */}
                        {aiData && aiData.visitFrequency > 3 && (
                          <div className="mt-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-crowe-accent to-crowe-secondary transition-all duration-1000"
                              style={{ 
                                width: `${Math.min(aiData.neuralActivation * 100, 100)}%`,
                                boxShadow: `0 0 4px ${neuralColor.primary}40`
                              }}
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Badge with quantum effects */}
                      {item.badge !== undefined && item.badge > 0 && (
                        <div className="relative z-10">
                          <span className={cn(
                            "bg-gradient-to-r from-crowe-accent to-crowe-secondary text-crowe-black text-xs font-bold px-3 py-1 rounded-full",
                            "shadow-lg transform transition-all duration-300 group-hover:scale-110"
                          )}>
                            {item.badge}
                          </span>
                          <div className="absolute inset-0 bg-crowe-accent rounded-full animate-ping opacity-30" />
                        </div>
                      )}
                      
                      {/* Voice indicator for AI */}
                      {item.hasVoice && (
                        <div className="relative z-10">
                          <Mic 
                            size={16} 
                            className={cn(
                              "text-crowe-accent transition-all duration-300",
                              biometrics.engagementScore > 0.7 ? "animate-pulse" : ""
                            )}
                          />
                        </div>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
            
            {/* AI Status Indicator */}
            <div className="mt-6 p-4 bg-gradient-to-r from-crowe-accent/10 to-crowe-secondary/10 rounded-lg border border-crowe-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Brain size={16} className="text-crowe-accent animate-pulse" />
                <span className="text-sm font-medium text-crowe-accent">AI Learning Status</span>
              </div>
              <div className="text-xs text-crowe-text/70 space-y-1">
                <div className="flex justify-between">
                  <span>Pattern Recognition:</span>
                  <span className="text-green-400">{Object.keys(aiLearning).length > 3 ? 'Active' : 'Learning'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Neural Efficiency:</span>
                  <span className="text-blue-400">{Math.round(biometrics.engagementScore * 100)}%</span>
                </div>
              </div>
            </div>
          </nav>

          {/* Quantum Footer with System Status */}
          <div className="p-4 border-t border-gradient-to-r from-transparent via-crowe-accent/30 to-transparent relative">
            <div className="absolute inset-0 bg-gradient-to-t from-crowe-accent/5 to-transparent" />
            
            {/* System Status Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
              <div className="text-center">
                <div className="text-green-400 font-mono">{Math.round(biometrics.heartRate)}</div>
                <div className="text-gray-500">BPM</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-mono">{particles.length}</div>
                <div className="text-gray-500">NODES</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-mono">{Object.keys(aiLearning).length}</div>
                <div className="text-gray-500">LEARNED</div>
              </div>
            </div>
            
            <p className="text-xs text-crowe-text/40 text-center flex items-center justify-center gap-2">
              <Zap size={10} className="text-crowe-accent animate-pulse" />
              © 2024 Southwest Mushrooms - Neural Interface v2.1.0
            </p>
          </div>
        </div>
      </aside>

      {/* Quantum Mobile Overlay with Neural Effects */}
      {isMobileOpen && (
        <div
          className={cn(
            "fixed inset-0 z-30 lg:hidden transition-all duration-500",
            "bg-gradient-radial from-black/80 via-crowe-dark/60 to-black/40",
            "backdrop-blur-sm"
          )}
          onClick={() => setIsMobileOpen(false)}
          style={{
            background: `
              radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(198,163,81,0.1) 50%, rgba(0,0,0,0.6) 100%),
              linear-gradient(45deg, rgba(0,0,0,0.4) 0%, transparent 100%)
            `
          }}
        >
          <div className="absolute inset-0 opacity-30">
            {/* Floating particles for mobile overlay */}
            {particles.slice(0, 8).map((particle, i) => (
              <div
                key={particle.id}
                className="absolute w-1 h-1 bg-crowe-accent rounded-full animate-pulse"
                style={{
                  left: `${(particle.x / 260) * 100}%`,
                  top: `${(particle.y / 800) * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                  opacity: particle.life / particle.maxLife
                }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

// Custom CSS for gradient borders and advanced effects
const sidebarStyles = `
  .border-gradient-to-r {
    border-image: linear-gradient(to right, transparent, rgba(198,163,81,0.3), transparent) 1;
  }
  
  .bg-gradient-radial {
    background: radial-gradient(ellipse at center, var(--tw-gradient-stops));
  }
  
  .transform-gpu {
    transform: translate3d(0, 0, 0);
  }
  
  .perspective-1000 {
    perspective: 1000px;
  }
`

// Inject styles
if (typeof document !== 'undefined' && !document.querySelector('#sidebar-advanced-styles')) {
  const styleSheet = document.createElement('style')
  styleSheet.id = 'sidebar-advanced-styles'
  styleSheet.textContent = sidebarStyles
  document.head.appendChild(styleSheet)
}