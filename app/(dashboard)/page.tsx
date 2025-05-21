'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CreditCard, Database, ClipboardList, Settings, FileText, Download, Key, UserPlus, FileEdit } from 'lucide-react';
import { Terminal } from './terminal';
import { User, userRole } from '@/lib/db/schema';
import useSWR from 'swr';
import { validateUserRole } from '@/lib/db/queries';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  return (
    <main>
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                Welcome to MiQ People Portal
                <span className="block text-orange-500 mt-4 text-3xl sm:text-4xl">
                  {user?.name || ''}
                </span>
              </h1>


              {user && (

              <div className="mt-6 space-y-2">
                <p className="text-lg text-gray-600">
                  {'Employee ID: ' + user?.id || ''}
                </p>
                <p className="text-lg text-gray-600">
                  {'Position: ' + user?.jobTitle || ''}
                </p>
                <p className="text-lg text-gray-600">
                  {'Department: ' + user?.department || ''}
                </p>
              </div>
              )}
              {user && (
                <div className="mt-6 flex gap-4">
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full">
                    Onboarding Status: 60% Complete {/* //todo: make this programatic */}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                    Employment Status: Active
                  </span>
                </div>
              )}
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">
                {user && ('Upcoming Requirements') || ('Sign Up Today to') }
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Submit Tax Declaration Forms
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Complete Benefits Enrollment
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Attend Orientation Session
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {user && (
      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Personal Details Card */}

            <div>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <UserPlus className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Personal Information
                </h2>
                <div className="mt-4 space-y-2">
                  <p className="text-gray-600">Email: {user.email}</p>
                  <p className="text-gray-600">Phone: {user.phone}</p>
                  <p className="text-gray-600">Address: {user.address}</p>
                </div>
                <Button className="mt-4" variant="outline">
                  Update Details
                </Button>
              </div>
            </div>


            {/* Onboarding Progress Card 
            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Onboarding Checklist
                </h2>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Documentation</span>
                    <span className="text-orange-600">3/5 completed</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-orange-500 rounded-full"
                      style={{ width: '60%' }}
                    ></div>
                  </div>
                </div>
                <Button className="mt-4" variant="outline">
                  View Full Checklist
                </Button>
              </div>
            </div>
            */}

            {/* Quick Actions Card */}
            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <Settings className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Quick Actions
                </h2>
                <div className="mt-4 space-y-3">
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    View Employment Contract
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Download Onboarding Package
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Key className="mr-2 h-4 w-4" />
                    Reset Password
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )}
      {/* HR Section - Only visible to authorized roles */}
      {user?.jobTitle === 'hr' && (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              HR Management Portal
            </h2>
            <p className="mb-8 text-gray-600">
              Manage employee records, compensation, and confidential information
            </p>
            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Button className="h-24 flex-col gap-2">
                <UserPlus className="h-6 w-6" />
                Add New Employee
              </Button>
              <Button className="h-24 flex-col gap-2">
                <FileEdit className="h-6 w-6" />
                Update Employee Records
              </Button>
            </div>
          </div>
        </div>
      </section>
      )}
    </main>
  );
}
