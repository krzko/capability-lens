'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data - replace with real data from your API
const maturityData = [
  { name: 'Team A', score: 3.5 },
  { name: 'Team B', score: 4.2 },
  { name: 'Team C', score: 2.8 },
  { name: 'Team D', score: 3.9 },
];

const trendData = [
  { month: 'Jan', avgScore: 2.8 },
  { month: 'Feb', avgScore: 3.1 },
  { month: 'Mar', avgScore: 3.3 },
  { month: 'Apr', avgScore: 3.6 },
  { month: 'May', avgScore: 3.8 },
];

import Layout from '@/components/layout/Layout';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('last30');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
            <p className="mt-2 text-sm text-gray-600">
              View insights and analytics about your services and teams
            </p>
          </div>
          <div className="space-x-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="last30">Last 30 Days</option>
            <option value="last90">Last 90 Days</option>
            <option value="lastYear">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Export Report
          </button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="maturity">Maturity Scores</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Team Comparison</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Average Maturity Score</CardTitle>
                <CardDescription>Across all teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3.6</div>
                <div className="text-sm text-green-600">↑ 0.3 from last month</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Total Assessments</CardTitle>
                <CardDescription>In selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">47</div>
                <div className="text-sm text-blue-600">12 pending reviews</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Teams Improved</CardTitle>
                <CardDescription>Teams with higher scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">76%</div>
                <div className="text-sm text-green-600">19 of 25 teams</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maturity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maturity Scores by Team</CardTitle>
              <CardDescription>Current maturity levels across teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={maturityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maturity Score Trends</CardTitle>
              <CardDescription>Score progression over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgScore" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Comparison</CardTitle>
              <CardDescription>Compare maturity across teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {['Team A', 'Team B', 'Team C', 'Team D'].map((team) => (
                    <label key={team} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTeams.includes(team)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTeams([...selectedTeams, team]);
                          } else {
                            setSelectedTeams(selectedTeams.filter(t => t !== team));
                          }
                        }}
                        className="rounded"
                      />
                      <span>{team}</span>
                    </label>
                  ))}
                </div>
                
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-4">Comparison Results</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Team</th>
                        <th className="text-left py-2">Current Score</th>
                        <th className="text-left py-2">Previous Score</th>
                        <th className="text-left py-2">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTeams.map(team => (
                        <tr key={team} className="border-b">
                          <td className="py-2">{team}</td>
                          <td className="py-2">3.8</td>
                          <td className="py-2">3.5</td>
                          <td className="py-2 text-green-600">+0.3</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Overview</CardTitle>
              <CardDescription>Track compliance status and requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800">Compliant Services</h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">85%</p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800">Pending Reviews</h3>
                    <p className="text-2xl font-bold text-yellow-600 mt-2">8</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800">Critical Issues</h3>
                    <p className="text-2xl font-bold text-red-600 mt-2">2</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Compliance Requirements</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Requirement</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Last Check</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="px-4 py-2">Security Controls</td>
                          <td className="px-4 py-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Compliant</span>
                          </td>
                          <td className="px-4 py-2">2 days ago</td>
                          <td className="px-4 py-2">
                            <button className="text-blue-600 hover:text-blue-800">View Details</button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="px-4 py-2">Data Privacy</td>
                          <td className="px-4 py-2">
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">Review Needed</span>
                          </td>
                          <td className="px-4 py-2">5 days ago</td>
                          <td className="px-4 py-2">
                            <button className="text-blue-600 hover:text-blue-800">Review Now</button>
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

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Track all assessment and compliance activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-x-2">
                    <select className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                      <option value="all">All Activities</option>
                      <option value="assessments">Assessments</option>
                      <option value="compliance">Compliance</option>
                      <option value="settings">Settings</option>
                    </select>
                    <select className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                      <option value="30">Last 30 days</option>
                      <option value="60">Last 60 days</option>
                      <option value="90">Last 90 days</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Export Log
                  </button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Timestamp</th>
                        <th className="px-4 py-2 text-left">User</th>
                        <th className="px-4 py-2 text-left">Activity</th>
                        <th className="px-4 py-2 text-left">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="px-4 py-2">2024-02-07 15:30:00</td>
                        <td className="px-4 py-2">John Doe</td>
                        <td className="px-4 py-2">Assessment Updated</td>
                        <td className="px-4 py-2">Updated security controls assessment for Service A</td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-2">2024-02-07 14:15:00</td>
                        <td className="px-4 py-2">Jane Smith</td>
                        <td className="px-4 py-2">Compliance Check</td>
                        <td className="px-4 py-2">Completed quarterly compliance review</td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-2">2024-02-07 13:00:00</td>
                        <td className="px-4 py-2">System</td>
                        <td className="px-4 py-2">Automated Scan</td>
                        <td className="px-4 py-2">Scheduled security scan completed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button className="px-3 py-1 rounded border">Previous</button>
                    <button className="px-3 py-1 rounded bg-blue-50 border border-blue-200">1</button>
                    <button className="px-3 py-1 rounded border">2</button>
                    <button className="px-3 py-1 rounded border">3</button>
                    <button className="px-3 py-1 rounded border">Next</button>
                  </nav>
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
