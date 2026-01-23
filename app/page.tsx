'use client';

import { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCardV2';
import PerformanceTable from '@/components/PerformanceTableV2';
import NewMembersSection from '@/components/NewMembersSection';
import DailyStandardsStrip from '@/components/DailyStandardsStrip';

export default function Home() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
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

  // Find members needing attention (Underperforming)
  const attentionRequired = [...memberData, ...newMembers].filter(m => m.status === 'Underperforming');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {monthName.toUpperCase()} {year}
          </h1>
          <h2 className="text-lg text-gray-500 font-medium">Sales Team Scorecard</h2>
        </div>

        {/* Scoreboard Bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="grid grid-cols-12 gap-4">
            
            {/* LEFT SIDE - Context Stats */}
            <div className="col-span-7">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-semibold text-gray-900">{workingDays.total}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Working Days</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-semibold text-gray-900">{workingDays.used}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Days Used</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-semibold text-gray-900">{workingDays.remaining}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Days Remaining</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-semibold text-gray-900">{config.teamSize}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Team Members</div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Daily Standards Strip */}
            <div className="col-span-5">
              <DailyStandardsStrip targets={config.targets} />
            </div>

          </div>
        </div>

        {/* MTD Team Performance */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">MTD Team Performance</h3>
          <div className="grid grid-cols-5 gap-4">
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

        {/* Attention Required */}
        {attentionRequired.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-red-600 text-lg">⚠️</span>
              <h3 className="text-sm font-semibold text-red-800 uppercase tracking-wide">Attention Required</h3>
            </div>
            <div className="space-y-2">
              {attentionRequired.map(member => (
                <div key={member.name} className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-100">
                  <div>
                    <span className="font-semibold text-gray-900">{member.name}</span>
                    {member.isNew && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">NEW</span>}
                  </div>
                  <div className="text-
