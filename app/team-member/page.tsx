'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TeamMemberPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get('name');
  
  const [memberData, setMemberData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) {
      router.push('/');
      return;
    }
    
    fetchMemberData();
  }, [name]);

  const fetchMemberData = async () => {
    try {
      const response = await fetch(`/api/team-member?name=${encodeURIComponent(name || '')}`);
      const data = await response.json();
      setMemberData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching member data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading {name}'s data...</div>
      </div>
    );
  }

  if (!memberData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">No data found</div>
      </div>
    );
  }

  const targets = {
    revenue: 2500,
    sales: 5,
    attended: 10,
    bookings: 20,
    calls: 200,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{memberData.name}</h1>
          <p className="text-gray-600">Performance Overview & Weekly Breakdown</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Overall Performance */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-600 mb-4 uppercase">Overall Performance</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Total Revenue</div>
                <div className="text-2xl font-bold text-gray-900">${memberData.totalData.revenue}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Sales</div>
                <div className="text-2xl font-bold text-gray-900">{memberData.totalData.sales}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Days Tracked</div>
                <div className="text-2xl font-bold text-gray-900">{memberData.totalDays}</div>
              </div>
            </div>
          </div>

          {/* Daily Averages */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-600 mb-4 uppercase">Daily Averages (WTD)</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Revenue:</span>
                <span className="font-semibold">${memberData.overallAvg.revenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sales:</span>
                <span className="font-semibold">{memberData.overallAvg.sales}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Attended:</span>
                <span className="font-semibold">{memberData.overallAvg.attended}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bookings:</span>
                <span className="font-semibold">{memberData.overallAvg.bookings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Calls:</span>
                <span className="font-semibold">{memberData.overallAvg.calls}</span>
              </div>
            </div>
          </div>

          {/* YTD Totals */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-600 mb-4 uppercase">Year to Date (2026)</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Revenue:</span>
                <span className="font-semibold">${memberData.ytdData.revenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sales:</span>
                <span className="font-semibold">{memberData.ytdData.sales}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Attended:</span>
                <span className="font-semibold">{memberData.ytdData.attended}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bookings:</span>
                <span className="font-semibold">{memberData.ytdData.bookings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Calls:</span>
                <span className="font-semibold">{memberData.ytdData.calls}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Breakdown */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Weekly Performance</h2>
          
          {memberData.weeklyData.map((week: any, index: number) => (
            <div key={week.week} className="bg-white rounded-lg shadow-sm p-6">
              {/* Week Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{week.week}</h3>
                  <p className="text-sm text-gray-600">
                    {index === 0 ? 'Current Week' : `${index} week${index > 1 ? 's' : ''} ago`}
                    {' • '}
                    {week.days.length} day{week.days.length !== 1 ? 's' : ''} tracked
                  </p>
                </div>
                <div className={`text-2xl font-bold ${week.progress >= 100 ? 'text-green-600' : week.progress >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {week.progress}%
                </div>
              </div>

              {/* Week Metrics */}
              <div className="grid grid-cols-5 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Revenue</div>
                  <div className="text-lg font-bold text-gray-900">${week.revenue}</div>
                  <div className="text-xs text-gray-500">Target: ${targets.revenue}</div>
                  <div className="text-xs text-gray-500">Avg: ${week.avgRevenue}/day</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Sales</div>
                  <div className="text-lg font-bold text-gray-900">{week.sales}</div>
                  <div className="text-xs text-gray-500">Target: {targets.sales}</div>
                  <div className="text-xs text-gray-500">Avg: {week.avgSales}/day</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Attended</div>
                  <div className="text-lg font-bold text-gray-900">{week.attended}</div>
                  <div className="text-xs text-gray-500">Target: {targets.attended}</div>
                  <div className="text-xs text-gray-500">Avg: {week.avgAttended}/day</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Bookings</div>
                  <div className="text-lg font-bold text-gray-900">{week.bookings}</div>
                  <div className="text-xs text-gray-500">Target: {targets.bookings}</div>
                  <div className="text-xs text-gray-500">Avg: {week.avgBookings}/day</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Calls</div>
                  <div className="text-lg font-bold text-gray-900">{week.calls}</div>
                  <div className="text-xs text-gray-500">Target: {targets.calls}</div>
                  <div className="text-xs text-gray-500">Avg: {week.avgCalls}/day</div>
                </div>
              </div>

              {/* Daily Breakdown */}
              {week.days.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Daily Breakdown</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-600">
                          <th className="pb-2">Date</th>
                          <th className="pb-2">Revenue</th>
                          <th className="pb-2">Sales</th>
                          <th className="pb-2">Attended</th>
                          <th className="pb-2">Bookings</th>
                          <th className="pb-2">Calls</th>
                        </tr>
                      </thead>
                      <tbody>
                        {week.days.map((day: any) => (
                          <tr key={day.date} className="border-t border-gray-100">
                            <td className="py-2 font-medium">{new Date(day.date).toLocaleDateString()}</td>
                            <td className="py-2">${day.revenue}</td>
                            <td className="py-2">{day.sales}</td>
                            <td className="py-2">{day.attended}</td>
                            <td className="py-2">{day.bookings}</td>
                            <td className="py-2">{day.calls}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}

          {memberData.weeklyData.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-600">No weekly data available yet.</p>
              <p className="text-sm text-gray-500 mt-2">Data will appear once entries are added to the Google Sheet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
