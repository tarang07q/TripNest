'use client';

import { Fragment, ReactNode } from 'react';
import { Popover, Transition } from '@headlessui/react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  className = '',
}: TooltipProps) {
  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowStyles = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-gray-900',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-gray-900',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-gray-900',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-r-gray-900',
  };

  return (
    <Popover className={`relative inline-block ${className}`}>
      <Popover.Button className="focus:outline-none">
        {children}
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel
          className={`
            absolute z-10 w-max max-w-xs rounded-lg bg-gray-900 px-4 py-2 text-sm text-white
            ${positionStyles[position]}
          `}
        >
          <div
            className={`
              absolute w-0 h-0 border-4 border-transparent
              ${arrowStyles[position]}
            `}
          />
          {content}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
} 