'use client';

import { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCard';
import PerformanceTable from '@/components/PerformanceTable';
import StandardsComparison from '@/components/StandardsComparison';
import DailyChecklist from '@/components/DailyChecklist';
import PasswordProtection from '@/components/PasswordProtection';

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
                        <div className="text-xl text-gray-600">Loading dashboard...</div>div>
                </div>div>
              );
  }
  
    const mtdTargets = dashboardData?.mtdTargets || {};
    const teamVariances = dashboardData?.teamVariances || {};
    const teamTotals = dashboardData?.teamTotals || {};
    const teamMembers = dashboardData?.teamMembers || [];
    const workingDays = dashboardData?.workingDaysSinceMonthStart || 0;
  
    // Helper function to format percentage
    const formatPercent = (value: number) => {
          const sign = value >= 0 ? '↑' : '↓';
          return `${sign} ${Math.abs(value).toFixed(1)}%`;
    };
  
    // Sort team members by revenue (descending)
    const sortedTeamMembers = [...teamMembers].sort((a, b) => b.revenue - a.revenue);
  
    return (
          <PasswordProtection correctPassword="0101">
                <div className="min-h-screen bg-gray-50">
                        <div className="max-w-7xl mx-auto p-6">
                          {/* Header */}
                                  <div className="mb-8">
                                              <div className="flex items-center gap-3 mb-2">
                                                            <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                                                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                                            </svg>svg>
                                                            </div>div>
                                                            <div>
                                                                            <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>h1>
                                                                            <p className="text-gray-600 text-sm uppercase tracking-wide">Month-to-Date Performance Tracking (Day {workingDays})</p>p>
                                                            </div>div>
                                              </div>div>
                                  </div>div>
                        
                          {/* Team MTD Overview */}
                                  <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                                            <span className="text-2xl">🎯</span>span> Team MTD Overview
                                              </h2>h2>
                                              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                                                {/* Revenue */}
                                                            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border border-pink-200">
                                                                            <p className="text-gray-600 text-sm font-semibold uppercase mb-2">Revenue</p>p>
                                                                            <p className="text-2xl font-bold text-gray-900 mb-1">${teamTotals.revenue || 0}</p>p>
                                                                            <p className="text-sm text-gray-700">Target: ${mtdTargets.revenue || 0}</p>p>
                                                                            <p className="text-sm mt-2 font-semibold" style={{color: teamVariances.revenue?.absolute >= 0 ? '#10b981' : '#ef4444'}}>
                                                                                              ${teamVariances.revenue?.absolute || 0} {formatPercent(teamVariances.revenue?.percent || 0)}
                                                                            </p>p>
                                                            </div>div>
                                              
                                                {/* Sales */}
                                                            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
                                                                            <p className="text-gray-600 text-sm font-semibold uppercase mb-2">Sales</p>p>
                                                                            <p className="text-2xl font-bold text-gray-900 mb-1">{teamTotals.sales || 0}</p>p>
                                                                            <p className="text-sm text-gray-700">Target: {mtdTargets.sales || 0}</p>p>
                                                                            <p className="text-sm mt-2 font-semibold" style={{color: teamVariances.sales?.absolute >= 0 ? '#10b981' : '#ef4444'}}>
                                                                              {teamVariances.sales?.absolute || 0} {formatPercent(teamVariances.sales?.percent || 0)}
                                                                            </p>p>
                                                            </div>div>
                                              
                                                {/* Attended */}
                                                            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border border-pink-200">
                                                                            <p className="text-gray-600 text-sm font-semibold uppercase mb-2">Attended</p>p>
                                                                            <p className="text-2xl font-bold text-gray-900 mb-1">{teamTotals.attended || 0}</p>p>
                                                                            <p className="text-sm text-gray-700">Target: {mtdTargets.attended || 0}</p>p>
                                                                            <p className="text-sm mt-2 font-semibold" style={{color: teamVariances.attended?.absolute >= 0 ? '#10b981' : '#ef4444'}}>
                                                                              {teamVariances.attended?.absolute || 0} {formatPercent(teamVariances.attended?.percent || 0)}
                                                                            </p>p>
                                                            </div>div>
                                              
                                                {/* Bookings */}
                                                            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
                                                                            <p className="text-gray-600 text-sm font-semibold uppercase mb-2">Bookings</p>p>
                                                                            <p className="text-2xl font-bold text-gray-900 mb-1">{teamTotals.bookings || 0}</p>p>
                                                                            <p className="text-sm text-gray-700">Target: {mtdTargets.bookings || 0}</p>p>
                                                                            <p className="text-sm mt-2 font-semibold" style={{color: teamVariances.bookings?.absolute >= 0 ? '#10b981' : '#ef4444'}}>
                                                                              {teamVariances.bookings?.absolute || 0} {formatPercent(teamVariances.bookings?.percent || 0)}
                                                                            </p>p>
                                                            </div>div>
                                              
                                                {/* Calls */}
                                                            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border border-pink-200">
                                                                            <p className="text-gray-600 text-sm font-semibold uppercase mb-2">Calls</p>p>
                                                                            <p className="text-2xl font-bold text-gray-900 mb-1">{teamTotals.calls || 0}</p>p>
                                                                            <p className="text-sm text-gray-700">Target: {mtdTargets.calls || 0}</p>p>
                                                                            <p className="text-sm mt-2 font-semibold" style={{color: teamVariances.calls?.absolute >= 0 ? '#10b981' : '#ef4444'}}>
                                                                              {teamVariances.calls?.absolute || 0} {formatPercent(teamVariances.calls?.percent || 0)}
                                                                            </p>p>
                                                            </div>div>
                                              </div>div>
                                  </div>div>
                        
                          {/* Individual MTD Performance */}
                                  <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                                            <span className="text-2xl">👤</span>span> Individual MTD Targets & Performance
                                              </h2>h2>
                                              <div className="space-y-6">
                                                {teamMembers.map((member: any, index: number) => (
                            <div key={index} className="border-l-4 border-pink-500 bg-gray-50 p-6 rounded">
                                              <h3 className="text-lg font-bold text-gray-900 mb-4">{member.name}</h3>h3>
                                              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                                  <div>
                                                                                        <p className="text-xs uppercase text-gray-600 font-semibold mb-1">Revenue</p>p>
                                                                                        <p className="text-sm font-bold text-gray-900">${member.revenue || 0}</p>p>
                                                                                        <p className="text-xs text-gray-600">Tgt: ${member.mtdTargets?.revenue || 0}</p>p>
                                                                  </div>div>
                                                                  <div>
                                                                                        <p className="text-xs uppercase text-gray-600 font-semibold mb-1">Sales</p>p>
                                                                                        <p className="text-sm font-bold text-gray-900">{member.sales || 0}</p>p>
                                                                                        <p className="text-xs text-gray-600">Tgt: {member.mtdTargets?.sales || 0}</p>p>
                                                                  </div>div>
                                                                  <div>
                                                                                        <p className="text-xs uppercase text-gray-600 font-semibold mb-1">Attended</p>p>
                                                                                        <p className="text-sm font-bold text-gray-900">{member.attended || 0}</p>p>
                                                                                        <p className="text-xs text-gray-600">Tgt: {member.mtdTargets?.attended || 0}</p>p>
                                                                  </div>div>
                                                                  <div>
                                                                                        <p className="text-xs uppercase text-gray-600 font-semibold mb-1">Bookings</p>p>
                                                                                        <p className="text-sm font-bold text-gray-900">{member.bookings || 0}</p>p>
                                                                                        <p className="text-xs text-gray-600">Tgt: {member.mtdTargets?.bookings || 0}</p>p>
                                                                  </div>div>
                                                                  <div>
                                                                                        <p className="text-xs uppercase text-gray-600 font-semibold mb-1">Calls</p>p>
                                                                                        <p className="text-sm font-bold text-gray-900">{member.calls || 0}</p>p>
                                                                                        <p className="text-xs text-gray-600">Tgt: {member.mtdTargets?.calls || 0}</p>p>
                                                                  </div>div>
                                              </div>div>
                            </div>div>
                          ))}
                                              </div>div>
                                  </div>div>
                        
                          {/* Leaderboard - Ranked by Sales Revenue */}
                                  <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                                            <span className="text-2xl">🏆</span>span> Leaderboard - Sales Revenue
                                              </h2>h2>
                                              <div className="overflow-x-auto">
                                                            <table className="w-full">
                                                                            <thead>
                                                                                              <tr className="border-b-2 border-gray-200">
                                                                                                                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>th>
                                                                                                                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Team Member</th>th>
                                                                                                                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>th>
                                                                                                                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Target</th>th>
                                                                                                                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Variance</th>th>
                                                                                                                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Sales</th>th>
                                                                                                                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Attended</th>th>
                                                                                                                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Bookings</th>th>
                                                                                                                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Calls</th>th>
                                                                                                </tr>tr>
                                                                            </thead>thead>
                                                                            <tbody>
                                                                              {sortedTeamMembers.map((member: any, index: number) => {
                                const varianceAmount = member.revenue - (member.mtdTargets?.revenue || 0);
                                const variancePercent = member.mtdTargets?.revenue ? ((varianceAmount / member.mtdTargets.revenue) * 100) : 0;
                                const isPositive = varianceAmount >= 0;
            
                                return (
                                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                                                                <td className="py-4 px-4">
                                                                                                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-pink-500 text-white font-bold">
                                                                                                            {index + 1}
                                                                                                            </span>span>
                                                                                  </td>td>
                                                                                <td className="py-4 px-4 font-semibold text-gray-900">{member.name}</td>td>
                                                                                <td className="py-4 px-4 text-right font-bold text-gray-900">${member.revenue || 0}</td>td>
                                                                                <td className="py-4 px-4 text-right text-gray-600">${member.mtdTargets?.revenue || 0}</td>td>
                                                                                <td className="py-4 px-4 text-right font-semibold" style={{color: isPositive ? '#10b981' : '#ef4444'}}>
                                                                                                          ${varianceAmount} ({variancePercent.toFixed(1)}%)
                                                                                  </td>td>
                                                                                <td className="py-4 px-4 text-right text-gray-900">{member.sales || 0}</td>td>
                                                                                <td className="py-4 px-4 text-right text-gray-900">{member.attended || 0}</td>td>
                                                                                <td className="py-4 px-4 text-right text-gray-900">{member.bookings || 0}</td>td>
                                                                                <td className="py-4 px-4 text-right text-gray-900">{member.calls || 0}</td>td>
                                                        </tr>tr>
                                                      );
          })}
                                                                            </tbody>tbody>
                                                            </table>table>
                                              </div>div>
                                  </div>div>
                        
                          {/* Bottom Section */}
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                                              <StandardsComparison totals={teamTotals} />
                                              <DailyChecklist />
                                  </div>div>
                        </div>div>
                </div>div>
          </PasswordProtection>PasswordProtection>
        );
}</div>
