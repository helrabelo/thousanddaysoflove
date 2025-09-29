"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "wedding" | "wedding-outline" | "elegant" | "ghost" | "secondary" | "romantic" | "outline"
  size?: "sm" | "md" | "lg" | "xl"
  isLoading?: boolean
  asChild?: boolean
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "wedding", size = "md", isLoading, asChild = false, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

    const variants = {
      wedding: "text-white border-2 border-current shadow-sm hover:shadow-md focus:ring-2" +
               " bg-[var(--primary-text)] hover:bg-[var(--background)] hover:text-[var(--primary-text)] hover:border-[var(--primary-text)]",
      "wedding-outline": "border-2 border-[var(--primary-text)] text-[var(--primary-text)] bg-transparent" +
                        " hover:bg-[var(--primary-text)] hover:text-[var(--background)] focus:ring-[var(--decorative)]",
      elegant: "border shadow-sm hover:shadow-md text-[var(--secondary-text)] border-[var(--border-subtle)]" +
               " bg-[var(--card)] hover:bg-[var(--accent)] hover:-translate-y-0.5",
      ghost: "text-[var(--secondary-text)] hover:bg-[var(--accent)] hover:text-[var(--primary-text)] focus:ring-[var(--decorative)]",
      secondary: "bg-[var(--decorative)] text-[var(--white-soft)] border-2 border-[var(--decorative)]" +
                " hover:bg-transparent hover:text-[var(--decorative)] focus:ring-[var(--decorative)]",
      // Legacy variants for backward compatibility during migration
      romantic: "bg-[var(--primary-text)] text-[var(--white-soft)] border-2 border-[var(--primary-text)]" +
                " hover:bg-[var(--background)] hover:text-[var(--primary-text)] focus:ring-[var(--decorative)]",
      outline: "border-2 border-[var(--primary-text)] text-[var(--primary-text)] bg-transparent" +
               " hover:bg-[var(--primary-text)] hover:text-[var(--background)] focus:ring-[var(--decorative)]"
    }

    const sizes = {
      sm: "px-6 py-2 text-sm min-h-[40px] letter-spacing-[0.05em]",
      md: "px-12 py-4 text-base min-h-[48px] letter-spacing-[0.1em]",
      lg: "px-16 py-5 text-lg min-h-[56px] letter-spacing-[0.1em]",
      xl: "px-20 py-6 text-xl min-h-[64px] letter-spacing-[0.15em]"
    }

    const getFontFamily = () => {
      if (variant === 'wedding' || variant === 'wedding-outline') {
        return { fontFamily: 'var(--font-cormorant)', textTransform: 'uppercase' as const }
      }
      return { fontFamily: 'var(--font-playfair)' }
    }

    if (asChild) {
      return React.cloneElement(
        children as React.ReactElement,
        {
          className: cn(
            baseStyles,
            variants[variant],
            sizes[size],
            isLoading && "cursor-wait",
            (children as React.ReactElement).props.className,
            className
          ),
          style: {
            ...getFontFamily(),
            ...(children as React.ReactElement).props.style,
            ...props.style
          },
          ref,
          ...props
        }
      )
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
        style={{
          ...getFontFamily(),
          ...props.style
        }}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
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