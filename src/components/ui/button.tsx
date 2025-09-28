"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "romantic" | "gold"
  size?: "sm" | "md" | "lg" | "xl"
  isLoading?: boolean
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl active:scale-95"

    const variants = {
      primary: "bg-blush-500 hover:bg-blush-600 text-white shadow-lg hover:shadow-xl focus:ring-blush-400 bg-gradient-to-r from-blush-500 to-blush-600 hover:from-blush-600 hover:to-blush-700",
      secondary: "bg-sage-500 hover:bg-sage-600 text-white shadow-lg hover:shadow-xl focus:ring-sage-400 bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700",
      outline: "border-2 border-blush-300 text-blush-700 hover:bg-blush-50 hover:border-blush-400 focus:ring-blush-400 bg-white/50 backdrop-blur-sm",
      ghost: "text-blush-700 hover:bg-blush-50 hover:text-blush-800 focus:ring-blush-400",
      romantic: "bg-gradient-to-r from-blush-400 via-blush-500 to-burgundy-500 hover:from-blush-500 hover:via-blush-600 hover:to-burgundy-600 text-white shadow-lg hover:shadow-xl focus:ring-blush-400 relative overflow-hidden",
      gold: "bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-burgundy-900 shadow-lg hover:shadow-xl focus:ring-gold-400 font-semibold"
    }

    const sizes = {
      sm: "px-4 py-2 text-sm min-h-[36px]",
      md: "px-6 py-3 text-base min-h-[44px]",
      lg: "px-8 py-4 text-lg min-h-[52px]",
      xl: "px-10 py-5 text-xl min-h-[60px]"
    }

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isLoading && "cursor-wait",
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {variant === "romantic" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />
        )}

        {isLoading && (
          <div className="mr-2 h-4 w-4 animate-spin">
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          </div>
        )}

        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }