import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils/index'

type SurfaceProps = React.HTMLAttributes<HTMLDivElement> & {
  withShadow?: boolean
  withBorder?: boolean
  className?: string
  children?: React.ReactNode
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  ({ children, className, withShadow = true, withBorder = true, ...props }, ref) => {
    const surfaceClass = cn(
      className,
      'bg-black rounded-lg dark:bg-white',
      withShadow ? 'shadow-sm' : '',
      // withBorder ? 'border border-neutral-200 dark:border-neutral-800' : '',
    )

    return (
      <div className={surfaceClass} {...props} ref={ref}>
        {children}
      </div>
    )
  },
)

Surface.displayName = 'Surface'
