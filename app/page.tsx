'use client';

import { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCard';
import PerformanceTable from '@/components/PerformanceTable';
import StandardsComparison from '@/components/StandardsComparison';
import DailyChecklist from '@/components/DailyChecklist';

export default function Home() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  const teamTotals = dashboardData?.teamTotals || {
    revenue: 0,
    sales: 0,
    attended: 0,
    bookings: 0,
    calls: 0
  };

  const teamMembers = dashboardData?.teamMembers || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sales Standard Scorecard</h1>
              <p className="text-gray-600 text-sm uppercase tracking-wide">Monitoring Weekly Targets & Variances</p>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <MetricCard
            title="SALES REVENUE"
            value={`$${teamTotals.revenue}`}
            variance={teamTotals.revenue - 7500}
            target={7500}
            color="pink"
          />
          <MetricCard
            title="SALES"
            value={teamTotals.sales}
            variance={teamTotals.sales - 15}
            target={15}
            color="teal"
          />
          <MetricCard
            title="ATTENDED"
            value={teamTotals.attended}
            variance={teamTotals.attended - 30}
            target={30}
            color="pink"
          />
          <MetricCard
            title="BOOKINGS"
            value={teamTotals.bookings}
            variance={teamTotals.bookings - 60}
            target={60}
            color="teal"
          />
          <MetricCard
            title="CALLS"
            value={teamTotals.calls}
            variance={teamTotals.calls - 600}
            target={600}
            color="pink"
          />
        </div>

        {/* Performance Table */}
        <PerformanceTable teamMembers={teamMembers} />

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <StandardsComparison totals={teamTotals} />
          <DailyChecklist />
        </div>
      </div>
    </div>
  );
}
