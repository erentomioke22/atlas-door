import { cn } from '@lib/utils/index'
import { forwardRef } from 'react';


// export type SurfaceProps = HTMLProps<HTMLDivElement> & {
//   withShadow?: boolean
//   withBorder?: boolean
// }

export const Surface = forwardRef(({ children, className, withShadow = true, withBorder = true,...props},ref)  => {
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
  })

  Surface.displayName = 'Surface';
// export default Surface;
