import React from 'react';

interface TooltipProps {
  message: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ message, children }) => {
  if (!message) return <>{children}</>;

  return (
    <div data-tooltip-target='tooltip-default' className='relative flex items-center'>
      {children}
      <div id='tooltip-default' role='tooltip' class='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700'>
          {message}
        <div class='tooltip-arrow' data-popper-arrow></div>
      </div>
    </div>
  );
};

export default Tooltip;