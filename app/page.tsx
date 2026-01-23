'use client';

import { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCardV2';
import PerformanceTable from '@/components/PerformanceTableV2';
import NewMembersSection from '@/components/NewMembersSection';
import DailyTargetsBox from '@/components/DailyTargetsBox';

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
      const response = await fetch('/api/dashboard-v2');
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

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Error loading dashboard</div>
      </div>
    );
  }

  const { monthName, year, workingDays, weekWorkingDays, config, teamTotals, teamMTDTargets, teamVariances, memberData, newMembers } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {monthName.toUpperCase()} {year}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Sales Team Scorecard</h2>
          
          <div className="flex gap-6 text-sm text-gray-600">
            <div>
              <span className="font-semibold">Working Days in Month:</span> {workingDays.total}
            </div>
            <div>
              <span className="font-semibold">Days Used:</span> {workingDays.used}
            </div>
            <div>
              <span className="font-semibold">Days Remaining:</span> {workingDays.remaining}
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            <span className="font-semibold">Total Team Members:</span> {config.teamSize}
          </div>
        </div>

        {/* MTD Team Performance + Daily Targets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4">MTD TEAM PERFORMANCE</h3>
            <div className="grid grid-cols-5 gap-3">
              <MetricCard
                title="Sales Rev"
                actual={teamTotals.revenue}
                target={teamMTDTargets.revenue}
                variance={teamVariances.revenue}
                format="currency"
              />
              <MetricCard
                title="Sales"
                actual={teamTotals.sales}
                target={teamMTDTargets.sales}
                variance={teamVariances.sales}
                format="number"
              />
              <MetricCard
                title="Attended"
                actual={teamTotals.attended}
                target={teamMTDTargets.attended}
                variance={teamVariances.attended}
                format="number"
              />
              <MetricCard
                title="Bookings"
                actual={teamTotals.bookings}
                target={teamMTDTargets.bookings}
                variance={teamVariances.bookings}
                format="number"
              />
              <MetricCard
                title="Calls"
                actual={teamTotals.calls}
                target={teamMTDTargets.calls}
                variance={teamVariances.calls}
                format="number"
              />
            </div>
          </div>
          
          <div>
            <DailyTargetsBox targets={config.targets} />
          </div>
        </div>

        {/* WTD Team Performance (if different from MTD) */}
        {weekWorkingDays.used < workingDays.used && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">WTD TEAM PERFORMANCE (Current Week)</h3>
            <div className="text-sm text-gray-600 mb-3">
              Week: {weekWorkingDays.used} days used of {weekWorkingDays.total} working days
            </div>
            {/* Could add WTD metrics here if needed */}
          </div>
        )}

        {/* Team Leaderboard */}
        <div className="mb-8">
          <PerformanceTable 
            members={memberData} 
            dailyTargets={config.targets}
          />
        </div>

        {/* New Members Section */}
        {newMembers.length > 0 && (
          <div className="mb-8">
            <NewMembersSection 
              members={newMembers}
              dailyTargets={config.targets}
            />
          </div>
        )}
      </div>
    </div>
  );
}
