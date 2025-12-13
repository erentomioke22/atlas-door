// components/Navbar.js
'use client';

import React from 'react'
import Dropdown from './Dropdown'
import Drawer from './drawer'

type DropDrawerProps = {
  children?: React.ReactNode
  title?: React.ReactNode
  btnStyle?: string
  className?: string
  close?: boolean
  disabled?: boolean
}

const DropDrawer: React.FC<DropDrawerProps> = ({ children, title, btnStyle, className, close, disabled }) => {
  return (
    <div>
      <div className="hidden sm:block">
        <Dropdown title={title} close={close} className={className} disabled={disabled} btnStyle={btnStyle}>
          {children}
        </Dropdown>
      </div>

      <div className="block sm:hidden">
        <Drawer
          title={title}
          onClose={close}
          position={undefined}
          header={undefined}
          headerStyle={undefined}
          btnStyle={btnStyle}
          size={'h-2/4 w-full border-t-2 border-lcard dark:border-dcard rounded-t-3xl'}
          disabled={disabled}
          style={undefined}
        >
          <div className="w-12 h-1.5 bg-lbtn rounded-full mx-auto my-2 " />
          {children}
        </Drawer>
      </div>
    </div>
  )
}

export default DropDrawer