'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import Layout from '@/components/layout/Layout';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [autoArchive, setAutoArchive] = useState(false);
  const [defaultMaturityTemplate, setDefaultMaturityTemplate] = useState('default');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <p className="mt-2 text-sm text-gray-600">
              Configure your application settings and preferences
            </p>
          </div>
        </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-archive">Auto-archive old assessments</Label>
                <Switch
                  id="auto-archive"
                  checked={autoArchive}
                  onCheckedChange={setAutoArchive}
                />
              </div>
              <div className="space-y-2">
                <Label>Default Maturity Template</Label>
                <select
                  value={defaultMaturityTemplate}
                  onChange={(e) => setDefaultMaturityTemplate(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="default">Default Template</option>
                  <option value="custom1">Custom Template 1</option>
                  <option value="custom2">Custom Template 2</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="slack-notifications">Slack Notifications</Label>
                <Switch
                  id="slack-notifications"
                  checked={slackNotifications}
                  onCheckedChange={setSlackNotifications}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Management</CardTitle>
              <CardDescription>Manage assessment templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  Create New Template
                </button>
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">Available Templates</h3>
                  {/* Template list would go here */}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Configure external integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded p-4">
                  <h3 className="font-semibold">Slack Integration</h3>
                  <p className="text-sm text-gray-600 mt-1">Connect to Slack for notifications</p>
                  <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
                    Connect Slack
                  </button>
                </div>
                <div className="border rounded p-4">
                  <h3 className="font-semibold">JIRA Integration</h3>
                  <p className="text-sm text-gray-600 mt-1">Connect to JIRA for task tracking</p>
                  <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
                    Connect JIRA
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Manage team members and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Team Members</h3>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    Invite Member
                  </button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Role</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="px-4 py-2">John Doe</td>
                        <td className="px-4 py-2">Admin</td>
                        <td className="px-4 py-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Active</span>
                        </td>
                        <td className="px-4 py-2">
                          <button className="text-red-600 hover:text-red-800">Remove</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>Manage your subscription and billing details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800">Current Plan: Professional</h3>
                  <p className="text-sm text-blue-600 mt-1">$49/month • Billed monthly</p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Payment Method</h3>
                  <div className="flex items-center space-x-4 border rounded p-4">
                    <div className="flex-1">
                      <p>•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-500">Expires 12/2024</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">Update</button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Billing History</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-left">Amount</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="px-4 py-2">Jan 1, 2024</td>
                          <td className="px-4 py-2">$49.00</td>
                          <td className="px-4 py-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Paid</span>
                          </td>
                          <td className="px-4 py-2">
                            <button className="text-blue-600 hover:text-blue-800">Download</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage API keys and access tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">API Keys</h3>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    Generate New Key
                  </button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Key Name</th>
                        <th className="px-4 py-2 text-left">Created</th>
                        <th className="px-4 py-2 text-left">Last Used</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="px-4 py-2">Production API Key</td>
                        <td className="px-4 py-2">Jan 1, 2024</td>
                        <td className="px-4 py-2">2 hours ago</td>
                        <td className="px-4 py-2">
                          <button className="text-red-600 hover:text-red-800 mr-2">Revoke</button>
                          <button className="text-blue-600 hover:text-blue-800">View</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">API Documentation</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">Access our comprehensive API documentation to integrate Capability Lens with your systems.</p>
                    <button className="mt-2 text-blue-600 hover:text-blue-800">View Documentation →</button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Rate Limits</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>API Calls (Today)</span>
                      <span>1,234 / 10,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </Layout>
  );
}
