

import { cn } from '@lib/utils/index'
import { Surface } from './Surface'
import Tooltip from './Tooltip'
import { forwardRef } from 'react'




const ToolbarWrapper = forwardRef(({ shouldShowContent = true, children, isVertical = false, className,...rest },ref) => {
    const toolbarClassName = cn(
      'text-black inline-flex h-full leading-none gap-0.5',
      isVertical ? 'flex-col p-2' : 'flex-row p-1 items-center',
      className,
    )

    return (
      shouldShowContent && (
        <Surface className={toolbarClassName} {...rest} ref={ref}>
          {children}
        </Surface>
      )
    )
  })


ToolbarWrapper.displayName = 'Toolbar'






const ToolbarButton = 
  forwardRef((
    {children, buttonSize = 'icon', variant = 'ghost', className, tooltip, tooltipShortcut,active ,disabled, activeClassname, ...rest},ref
    
  ) => {
    const buttonClass = cn('gap-1 min-w-[2rem] px-2 w-auto', className)


    const buttonClassName = cn(
      'flex group items-center justify-center border border-transparent gap-2 text-sm font-semibold rounded-md disabled:opacity-50 whitespace-nowrap',

      variant === 'ghost' &&
        cn(
          'bg-transparent border-transparent ',
          !disabled && !active && 'hover:bg-dcard text-white   dark:hover:bg-lcard dark:text-black',
          active && cn('bg-white text-black  dark:bg-black dark:text-white ', activeClassname),
        ),

      buttonSize === 'medium' && 'py-2 px-3',
      buttonSize === 'small' && 'py-1 px-2',
      buttonSize === 'icon' && 'w-8 h-8',
      buttonSize === 'iconSmall' && 'w-6 h-6',

      buttonClass,
    )

    const content = (
      <button
        type='button' ref={ref} disabled={disabled} className={buttonClassName} {...rest}
      >
        {children}
      </button>
    )

    if (tooltip) {
      return (
        <Tooltip title={tooltip} shortcut={tooltipShortcut}>
          {content}
        </Tooltip>
      )
    }

    return content
  })


ToolbarButton.displayName = 'ToolbarButton'

export const Toolbar = {
  Wrapper: ToolbarWrapper,
  Button: ToolbarButton,
}
