'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MetricCard from '@/components/MetricCardV2';

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
        
        {/* Header with Logos */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {monthName.toUpperCase()} {year}
            </h1>
            <p className="text-gray-500">Sales Team Scorecard</p>
          </div>
          <div className="flex items-center gap-6">
            <img 
              src="/MS_Logo.png" 
              alt="Marketing Sweet" 
              className="h-10 object-contain"
            />
            <img 
              src="/Quodo_logo_option_1_text_and_animal.png" 
              alt="Quodo" 
              className="h-12 object-contain"
            />
          </div>
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
                      <Link 
                        href={'/people/' + encodeURIComponent(member.name)}
                        className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {member.displayName}
                      </Link>
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

        {/* Team Directory */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <h2 className="text-lg font-semibold text-gray-900">Team Directory</h2>
            </div>
            <Link 
              href="/people"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              View Full Directory →
            </Link>
          </div>
          
          <div className={allMembers.length > 10 ? "max-h-96 overflow-y-auto" : ""}>
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Revenue MTD</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Sales</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Attended</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Bookings</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Calls</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Progress</th>
                </tr>
              </thead>
              <tbody>
                {allMembers.map(function(member) {
                  return (
                    <tr key={member.name} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <Link 
                          href={'/people/' + encodeURIComponent(member.name)}
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {member.displayName}
                        </Link>
                        {member.isNew && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">NEW</span>}
                      </td>
                      <td className="py-3 px-3">
                        <span className={'inline-block px-2 py-0.5 text-xs font-medium rounded ' + (
                          member.status === 'Overperforming' ? 'bg-green-100 text-green-700' :
                          member.status === 'Underperforming' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-600'
                        )}>
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-gray-900">
                        ${Math.round(member.data.revenue).toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right text-gray-900">{member.data.sales}</td>
                      <td className="py-3 px-3 text-right text-gray-900">{member.data.attended}</td>
                      <td className="py-3 px-3 text-right text-gray-900">{member.data.bookings}</td>
                      <td className="py-3 px-3 text-right text-gray-900">{member.data.calls}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2 justify-end">
                          <div className="w-16 bg-gray-100 rounded-full h-2">
                            <div 
                              className={'h-2 rounded-full ' + (
                                member.progress >= 90 ? 'bg-green-500' : 
                                member.progress >= 70 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              )}
                              style={{ width: Math.min(member.progress, 100) + '%' }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700 w-10 text-right">{member.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
