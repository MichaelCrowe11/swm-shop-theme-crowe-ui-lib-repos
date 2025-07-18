'use client'

import React, { useState } from 'react'
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
  Mic
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem, SidebarProps } from '@/types'

const navItems: NavItem[] = [
  { label: 'Grow Dashboard', href: '/', icon: 'Sprout' },
  { label: 'Products', href: '/products', icon: 'Package' },
  { label: 'Audiobook', href: '/audiobook', icon: 'Headphones' },
  { label: 'Guides', href: '/guides', icon: 'BookOpen' },
  { label: 'Crowe Logic AI', href: '/crowe-logic', icon: 'Brain', hasVoice: true },
  { label: 'Cart', href: '/cart', icon: 'ShoppingCart', badge: 0 },
]

const iconMap = {
  Sprout,
  Package,
  Headphones,
  BookOpen,
  Brain,
  ShoppingCart,
  Mic,
}

export function Sidebar({ isOpen = true, onToggle, currentPath }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const activePath = currentPath || pathname

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen)
    onToggle?.()
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-crowe-dark/80 backdrop-blur-sm border border-crowe-secondary/20"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-sidebar bg-crowe-black border-r border-crowe-secondary/20 z-40 transition-transform duration-300",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="p-6 border-b border-crowe-secondary/20">
            <Link href="/" className="block">
              <h1 className="text-2xl font-bold text-crowe-accent">
                Crowe Logic™
              </h1>
              <p className="text-sm text-crowe-text/60 mt-1">
                Myco-Intelligent Commerce
              </p>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap]
                const isActive = activePath === item.href
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                        "hover:bg-crowe-secondary/10 hover:text-crowe-accent",
                        isActive 
                          ? "bg-crowe-accent/10 text-crowe-accent border-l-4 border-crowe-accent" 
                          : "text-crowe-text hover:translate-x-1"
                      )}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-auto bg-crowe-accent text-crowe-black text-xs font-bold px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-crowe-secondary/20">
            <p className="text-xs text-crowe-text/40 text-center">
              © 2024 Southwest Mushrooms
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}