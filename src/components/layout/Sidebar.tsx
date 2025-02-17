'use client';

import { FC, Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  CalendarIcon,
  DocumentIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const navigationGroups = [
  {
    name: 'Dashboard',
    items: [
      { name: 'Home', href: '/dashboard', icon: HomeIcon }
    ]
  },
  {
    name: 'Entities',
    items: [
      { name: 'Organisations', href: '/organisations', icon: UsersIcon },
      { name: 'Teams', href: '/teams', icon: FolderIcon },
      { name: 'Services', href: '/services', icon: CalendarIcon }
    ]
  },
  {
    name: 'Assessments',
    items: [
      { name: 'View Assessments', href: '/assessments/view', icon: DocumentIcon },
      { name: 'Start Assessment', href: '/assessments/new', icon: DocumentIcon },
      { name: 'Manage Templates', href: '/assessments/templates', icon: DocumentIcon }
    ]
  },
  {
    name: 'Reports & Analytics',
    items: [
      { name: 'Overview Reports', href: '/reports/overview', icon: ChartBarIcon },
      { name: 'Comparisons', href: '/reports/comparisons', icon: ChartBarIcon },
      { name: 'Trend Analysis', href: '/reports/trends', icon: ChartBarIcon }
    ]
  },
  {
    name: '__separator__',
    items: []
  },
  {
    name: 'Settings',
    items: [
      { name: 'System Settings', href: '/settings/system', icon: Cog6ToothIcon }
    ]
  }
];


const Sidebar: FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex h-full flex-col bg-indigo-600">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-shrink-0 items-center px-4 py-4">
          <Link href="/dashboard" className="text-xl font-bold text-white hover:text-indigo-100">
            Capability Lens
          </Link>
        </div>
        <nav className="mt-8 flex-1 space-y-6 px-2">
          {navigationGroups.map((group) => (
            <div key={group.name} className="space-y-1">
              {group.name !== '__separator__' ? (
                <h3 className="px-2 text-sm font-semibold text-indigo-200">{group.name}</h3>
              ) : (
                <div className="py-6" />
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                      isActive
                        ? 'bg-indigo-700 text-white'
                        : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                    )}
                    >
                      <item.icon
                        className={clsx(
                          'mr-3 h-5 w-5 flex-shrink-0',
                          isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
      </div>
      <div className="flex flex-shrink-0 border-t border-indigo-700 p-4">
        <Menu as="div" className="relative w-full">
          <Menu.Button className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 hover:text-white">
            <UserCircleIcon className="mr-3 h-6 w-6 text-indigo-200" aria-hidden="true" />
            <span className="flex-1 text-left">
              {session?.user?.name || 'Profile'}
            </span>
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
            <Menu.Items className="absolute bottom-full left-0 mb-1 w-full rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/profile"
                    className={clsx(
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700'
                    )}
                  >
                    Your Profile
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => signOut()}
                    className={clsx(
                      active ? 'bg-gray-100' : '',
                      'block w-full px-4 py-2 text-left text-sm text-gray-700'
                    )}
                  >
                    Sign Out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default Sidebar;
