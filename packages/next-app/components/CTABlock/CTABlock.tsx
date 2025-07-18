'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CTABlockProps } from '@/types'

export function CTABlock({
  title,
  description,
  buttonText,
  buttonHref,
  image,
  variant = 'default',
}: CTABlockProps) {
  const isExternal = buttonHref.startsWith('http')
  
  const variantStyles = {
    default: {
      container: 'bg-gradient-to-r from-crowe-dark to-crowe-black',
      text: 'text-crowe-text',
      button: 'bg-crowe-accent text-crowe-black hover:bg-crowe-secondary',
    },
    accent: {
      container: 'bg-gradient-to-r from-crowe-accent/20 to-crowe-secondary/20',
      text: 'text-crowe-text',
      button: 'bg-crowe-accent text-crowe-black hover:bg-crowe-secondary',
    },
    secondary: {
      container: 'bg-gradient-to-r from-crowe-secondary/10 to-crowe-accent/10',
      text: 'text-crowe-text',
      button: 'bg-crowe-light text-crowe-black hover:bg-crowe-accent hover:text-crowe-black',
    },
  }

  const styles = variantStyles[variant]

  const ButtonComponent = isExternal ? 'a' : Link
  const buttonProps = isExternal
    ? { href: buttonHref, target: '_blank', rel: 'noopener noreferrer' }
    : { href: buttonHref }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-crowe-secondary/20',
        styles.container
      )}
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
        {/* Content */}
        <div className="flex-1 text-center md:text-left">
          <h3 className={cn('text-3xl md:text-4xl font-bold mb-4', styles.text)}>
            {title}
          </h3>
          <p className={cn('text-lg md:text-xl mb-6 opacity-90', styles.text)}>
            {description}
          </p>
          <ButtonComponent
            {...buttonProps}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200',
              'transform hover:scale-105 active:scale-100',
              styles.button
            )}
          >
            {buttonText}
            {isExternal ? <ExternalLink size={18} /> : <ArrowRight size={18} />}
          </ButtonComponent>
        </div>

        {/* Image */}
        {image && (
          <div className="relative w-full md:w-80 h-64 md:h-80 rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
              priority
            />
          </div>
        )}
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-crowe-accent rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-crowe-secondary rounded-full blur-3xl" />
      </div>
    </div>
  )
}

// Mini CTA variant for inline use
export function MiniCTA({
  title,
  buttonText,
  buttonHref,
}: Pick<CTABlockProps, 'title' | 'buttonText' | 'buttonHref'>) {
  return (
    <div className="flex items-center justify-between p-4 bg-crowe-accent/10 rounded-lg border border-crowe-accent/20">
      <span className="text-crowe-text font-medium">{title}</span>
      <Link
        href={buttonHref}
        className="flex items-center gap-1 text-crowe-accent hover:text-crowe-secondary transition-colors font-medium"
      >
        {buttonText}
        <ArrowRight size={16} />
      </Link>
    </div>
  )
}