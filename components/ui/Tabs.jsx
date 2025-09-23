'use client';

import { useState, useId } from 'react';



export default function Tabs({ 
  tabs, 
  defaultIndex = 0, 
  variant = 'underline',
  className = '' 
}) {
  const [activeTab, setActiveTab] = useState(defaultIndex);
  const id = useId();

  // Handle keyboard navigation
  const handleKeyDown = (event, index) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        setActiveTab((prev) => (prev > 0 ? prev - 1 : tabs.length - 1));
        break;
      case 'ArrowRight':
        event.preventDefault();
        setActiveTab((prev) => (prev < tabs.length - 1 ? prev + 1 : 0));
        break;
      case 'Home':
        event.preventDefault();
        setActiveTab(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveTab(tabs.length - 1);
        break;
    }
  };

  const variantStyles = {
    underline: {
      tabList: 'border-b border-gray-200',
      tab: (isActive) => 
        `px-4 py-2 font-medium text-sm transition-all duration-300 ease-in-out relative ${
          isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
        }`,
      activeIndicator: 'absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transition-all duration-300 ease-in-out'
    },
    pills: {
      tabList: 'flex gap-2 p-1 bg-lcard dark:bg-dcard rounded-xl justify-center mx-auto w-full',
      tab: (isActive) => 
        `px-4 py-2 font-medium text-sm rounded-xl transition-all duration-300 ease-in-out outline-none ring-none focus:outline-none w-full text-center ${
          isActive 
            ? 'bg-lbtn dark:dbtn  shadow-sm' 
            : ' text-lfont '
        }`,
      activeIndicator: ''
    },
    cards: {
      tabList: 'border-b border-gray-200',
      tab: (isActive) => 
        `px-6 py-3 font-medium text-sm border-b-2 transition-all duration-300 ease-in-out ${
          isActive 
            ? 'border-blue-500 text-blue-600 bg-blue-50' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`,
      activeIndicator: ''
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className={` ${className}`}>
      {/* Tab List */}
      <div 
        role="tablist" 
        aria-label="Tabs navigation"
        className={`flex ${styles.tabList}`}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`${id}-tabpanel-${index}`}
            id={`${id}-tab-${index}`}
            tabIndex={activeTab === index ? 0 : -1}
            onClick={() => !tab.disabled && setActiveTab(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={tab.disabled}
            className={`
              relative flex items-center space-x-2 focus:outline-none focus:ring-0 ring-0
              ${styles.tab(activeTab === index)}
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {variant === 'underline' && activeTab === index && (
              <span className={styles.activeIndicator} />
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="mt-4 relative">
        {tabs.map((tab, index) => (
          <div
            key={index}
            role="tabpanel"
            id={`${id}-tabpanel-${index}`}
            aria-labelledby={`${id}-tab-${index}`}
            tabIndex={0}
            className={`transition-all duration-500 ease-in-out ${
              activeTab === index
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 absolute transform -translate-y-2 h-0 overflow-hidden'
            }`}
          >
            <div className={activeTab === index ? 'animate-fadeIn' : ''}>
              {tab.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}