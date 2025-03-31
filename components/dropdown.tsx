'use client';

import { Fragment, ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';

interface DropdownProps {
  trigger: ReactNode;
  items: Array<{
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  }>;
  className?: string;
}

export default function Dropdown({ trigger, items, className = '' }: DropdownProps) {
  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <Menu.Button className="inline-flex w-full justify-center">
        {trigger}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            {items.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    onClick={item.onClick}
                    className={`
                      group flex w-full items-center rounded-md px-2 py-2 text-sm
                      ${active ? 'bg-blue-500 text-white' : 'text-gray-900'}
                    `}
                  >
                    {item.icon && (
                      <span className="mr-2 h-5 w-5">{item.icon}</span>
                    )}
                    {item.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 