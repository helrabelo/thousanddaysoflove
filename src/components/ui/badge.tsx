"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "confirmed" | "pending" | "declined" | "romantic" | "gold"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 font-body"

    const variants = {
      default: "bg-sage-100 text-sage-700 border border-sage-200",
      confirmed: "bg-sage-100 text-sage-700 border border-sage-200 shadow-sm",
      pending: "bg-gold-100 text-gold-700 border border-gold-200 shadow-sm",
      declined: "bg-burgundy-100 text-burgundy-700 border border-burgundy-200 shadow-sm",
      romantic: "bg-gradient-to-r from-blush-100 to-blush-200 text-blush-700 border border-blush-300 shadow-sm",
      gold: "bg-gradient-to-r from-gold-200 to-gold-300 text-gold-800 border border-gold-400 shadow-sm font-semibold"
    }

    const sizes = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base"
    }

    return (
      <div
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Badge.displayName = "Badge"

export { Badge }