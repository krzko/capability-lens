'use client';

import { useSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';

export default function Profile() {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:space-x-4">
                <div className="flex-shrink-0">
                  {session?.user?.image ? (
                    <img
                      className="mx-auto h-20 w-20 rounded-full"
                      src={session.user.image}
                      alt=""
                    />
                  ) : (
                    <div className="mx-auto h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl font-medium text-gray-500">
                        {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                  <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                    {session?.user?.name || 'User'}
                  </p>
                  <p className="text-sm font-medium text-gray-600">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
