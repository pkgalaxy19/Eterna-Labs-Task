'use client'

import * as React from 'react'
import { GripVertical } from 'lucide-react'

import { cn } from '@/lib/utils'

const Resizable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex w-full', className)}
    {...props}
  />
))
Resizable.displayName = 'Resizable'

const ResizablePanel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultSize?: number
    minSize?: number
  }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1', className)}
    {...props}
  />
))
ResizablePanel.displayName = 'ResizablePanel'

const ResizableHandle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    withHandle?: boolean
  }
>(({ withHandle, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex w-1 items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 hover:bg-border/80 transition-colors',
      withHandle && 'after:h-8',
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-1 rounded-full border border-border bg-secondary" />
    )}
  </div>
))
ResizableHandle.displayName = 'ResizableHandle'

export { Resizable, ResizablePanel, ResizableHandle }
