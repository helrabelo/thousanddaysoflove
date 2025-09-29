"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "wedding" | "elegant" | "subtle" | "invitation" | "bordered"
  children: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "wedding", children, ...props }, ref) => {
    const baseStyles = "transition-all duration-300 rounded-lg"

    const variants = {
      wedding: "bg-[var(--card)] border border-[var(--border-subtle)] shadow-[0_2px_8px_var(--shadow-subtle)]" +
               " hover:shadow-[0_4px_16px_var(--shadow-medium)] hover:-translate-y-1 p-8",
      elegant: "bg-[var(--card)] border border-[var(--border-subtle)] shadow-[0_2px_8px_var(--shadow-subtle)]" +
               " hover:shadow-[0_4px_16px_var(--shadow-medium)] hover:-translate-y-0.5 p-6",
      invitation: "bg-[var(--white-soft)] border-2 border-[var(--border-subtle)] shadow-[0_4px_12px_var(--shadow-subtle)]" +
                  " hover:shadow-[0_8px_24px_var(--shadow-medium)] p-12 text-center",
      subtle: "bg-[var(--accent)] border-0 hover:bg-[var(--background)] p-6",
      bordered: "bg-[var(--card)] border-2 border-[var(--decorative)] hover:border-[var(--primary-text)] p-6"
    }

    return (
      <div
        className={cn(baseStyles, variants[variant], className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-0 pb-4", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-medium leading-tight", className)}
      style={{
        fontFamily: 'var(--font-playfair)',
        color: 'var(--primary-text)',
        letterSpacing: '0.05em'
      }}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-base leading-relaxed", className)}
      style={{
        fontFamily: 'var(--font-crimson)',
        color: 'var(--secondary-text)',
        fontStyle: 'italic',
        lineHeight: '1.8'
      }}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-0 pt-0", className)}
      style={{ fontFamily: 'var(--font-crimson)' }}
      {...props}
    />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-center p-0 pt-6", className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }