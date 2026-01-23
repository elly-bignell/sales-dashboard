'use client';

import { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCardV2';
import PerformanceTable from '@/components/PerformanceTableV2';
import NewMembersSection from '@/components/NewMembersSection';

export default function Home() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000);
    return function() { clearInterval(interval); };
  }, []);

  const fetchDashboardData = async function() {
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Error loading dashboard</div>
      </div>
    );
  }

  const { 
    monthName, 
    year, 
    workingDays, 
    weekWorkingDays, 
    config, 
    activeTeamMembers,
    teamDailyStandards,
    teamMTDTotals, 
    teamMTDTargets, 
    teamMTDVariances,
    teamWTDTotals,
    teamWTDTargets,
    teamWTDVariances,
    memberData, 
    newMembers 
  } = dashboardData;

  const allMembers = [...memberData, ...newMembers];
  const attentionRequired = allMembers.filter(function(m) { return m.status === 'Underperforming'; });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {monthName.toUpperCase()} {year}
          </h1>
          <p className="text-gray-500">Sales Team Scorecard</p>
        </div>

        {/* Scoreboard Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
          
          {/* Row 1: Month Progress */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Month Progress</div>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-100">
                <div className="text-2xl font-semibold text-gray-900">{workingDays.total}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Working Days</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-100">
                <div className="text-2xl font-semibold text-gray-900">{workingDays.used}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Days Used</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-100">
                <div className="text-2xl font-semibold text-gray-900">{workingDays.remaining}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Days Remaining</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-100">
                <div className="text-2xl font-semibold text-gray-900">{activeTeamMembers}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Team Members</div>
              </div>
            </div>
          </div>

          {/* Row 2: Individual Daily Standards */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Individual Daily Standards</div>
            <div className="grid grid-cols-5 gap-3">
              <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                <div className="text-lg font-semibold text-gray-900">${config.targets.revenue}</div>
                <div className="text-xs text-gray-500">Revenue</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                <div className="text-lg font-semibold text-gray-900">{config.targets.sales}</div>
                <div className="text-xs text-gray-500">Sales</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                <div className="text-lg font-semibold text-gray-900">{config.targets.attended}</div>
                <div className="text-xs text-gray-500">Attended</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                <div className="text-lg font-semibold text-gray-900">{config.targets.bookings}</div>
                <div className="text-xs text-gray-500">Bookings</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                <div className="text-lg font-semibold text-gray-900">{config.targets.calls}</div>
                <div className="text-xs text-gray-500">Calls</div>
              </div>
            </div>
          </div>

          {/* Row 3: Team Daily Standards */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Team Daily Standards</div>
            <p className="text-xs text-gray-400 mb-3">Individual standard × {activeTeamMembers} active team members</p>
            <div className="grid grid-cols-5 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                <div className="text-lg font-semibold text-blue-900">${teamDailyStandards.revenue}</div>
                <div className="text-xs text-blue-600">Revenue</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                <div className="text-lg font-semibold text-blue-900">{teamDailyStandards.sales}</div>
                <div className="text-xs text-blue-600">Sales</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                <div className="text-lg font-semibold text-blue-900">{teamDailyStandards.attended}</div>
                <div className="text-xs text-blue-600">Attended</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                <div className="text-lg font-semibold text-blue-900">{teamDailyStandards.bookings}</div>
                <div className="text-xs text-blue-600">Bookings</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                <div className="text-lg font-semibold text-blue-900">{teamDailyStandards.calls}</div>
                <div className="text-xs text-blue-600">Calls</div>
              </div>
            </div>
          </div>

        </div>

        {/* MTD Team Performance */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">MTD Team Performance</h3>
          <div className="grid grid-cols-5 gap-4">
            <MetricCard
              title="Revenue"
              actual={teamMTDTotals.revenue}
              target={teamMTDTargets.revenue}
              variance={teamMTDVariances.revenue}
              format="currency"
            />
            <MetricCard
              title="Sales"
              actual={teamMTDTotals.sales}
              target={teamMTDTargets.sales}
              variance={teamMTDVariances.sales}
              format="number"
            />
            <MetricCard
              title="Attended"
              actual={teamMTDTotals.attended}
              target={teamMTDTargets.attended}
              variance={teamMTDVariances.attended}
              format="number"
            />
            <MetricCard
              title="Bookings"
              actual={teamMTDTotals.bookings}
              target={teamMTDTargets.bookings}
              variance={teamMTDVariances.bookings}
              format="number"
            />
            <MetricCard
              title="Calls"
              actual={teamMTDTotals.calls}
              target={teamMTDTargets.calls}
              variance={teamMTDVariances.calls}
              format="number"
            />
          </div>
        </div>

        {/* WTD Team Performance */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">WTD Team Performance</h3>
          <p className="text-xs text-gray-400 mb-3">Week to date (Mon–Today): {weekWorkingDays.used} working days used</p>
          <div className="grid grid-cols-5 gap-4">
            <MetricCard
              title="Revenue"
              actual={teamWTDTotals.revenue}
              target={teamWTDTargets.revenue}
              variance={teamWTDVariances.revenue}
              format="currency"
            />
            <MetricCard
              title="Sales"
              actual={teamWTDTotals.sales}
              target={teamWTDTargets.sales}
              variance={teamWTDVariances.sales}
              format="number"
            />
            <MetricCard
              title="Attended"
              actual={teamWTDTotals.attended}
              target={teamWTDTargets.attended}
              variance={teamWTDVariances.attended}
              format="number"
            />
            <MetricCard
              title="Bookings"
              actual={teamWTDTotals.bookings}
              target={teamWTDTargets.bookings}
              variance={teamWTDVariances.bookings}
              format="number"
            />
            <MetricCard
              title="Calls"
              actual={teamWTDTotals.calls}
              target={teamWTDTargets.calls}
              variance={teamWTDVariances.calls}
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
              {attentionRequired.map(function(member) {
                return (
                  <div key={member.name} className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-100">
                    <div>
                      <span className="font-semibold text-gray-900">{member.displayName}</span>
                      {member.isNew && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">NEW</span>}
                    </div>
                    <div className="text-sm text-red-600">
                      Biggest gap: <span className="font-semibold capitalize">{member.biggestShortfall}</span> ({member.biggestShortfallDays ? member.biggestShortfallDays.toFixed(1) : '0'}d behind)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Team Leaderboard */}
        <PerformanceTable 
          members={memberData} 
          dailyTargets={config.targets}
        />

        {/* New Members Section */}
        {newMembers.length > 0 && (
          <NewMembersSection 
            members={newMembers}
            dailyTargets={config.targets}
          />
        )}

      </div>
    </div>
  );
}
