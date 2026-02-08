"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTilt } from "@/hooks/use-tilt"

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  tilt?: boolean
  tiltMax?: number
}

const Card3D = React.forwardRef<HTMLDivElement, Card3DProps>(
  ({ className, children, tilt = true, tiltMax = 12, ...props }, ref) => {
    const { ref: tiltRef, handleMouseMove, handleMouseLeave } = useTilt<HTMLDivElement>({
      max: tiltMax,
      scale: 1.02,
    })

    const mergedRef = (node: HTMLDivElement | null) => {
      ;(tiltRef as React.MutableRefObject<HTMLDivElement | null>).current = node
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
    }

    return (
      <div
        ref={mergedRef}
        onMouseMove={tilt ? handleMouseMove : undefined}
        onMouseLeave={tilt ? handleMouseLeave : undefined}
        className={cn(
          "rounded-xl glass-card text-card-foreground transition-transform duration-300 ease-out",
          tilt && "will-change-transform cursor-pointer",
          className
        )}
        style={tilt ? { transformStyle: "preserve-3d", perspective: "1000px" } : undefined}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card3D.displayName = "Card3D"

export { Card3D }
