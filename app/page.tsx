'use client';

import { useEffect, useState } from 'react';
import StandardsComparison from '@/components/StandardsComparison';
import DailyChecklist from '@/components/DailyChecklist';
import PasswordProtection from '@/components/PasswordProtection';

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
                                                                                                        
                                                                                                          const teamTotals = dashboardData?.teamTotals || {};
                                                                                                            const mtdTargets = dashboardData?.mtdTargets || {};
                                                                                                              const workingDays = dashboardData?.workingDaysSinceMonthStart || 0;
                                                                                                              
                                                                                                                return (
                                                                                                                    <PasswordProtection correctPassword="0101">
                                                                                                                          <div className="min-h-screen bg-gray-50">
                                                                                                                                  <div className="max-w-7xl mx-auto p-6">
                                                                                                                                            <div className="mb-8">
                                                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                                      <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                                                                                                                                                                                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                                                                                                                                                                        </svg>
                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                    <div>
                                                                                                                                                                                                                                                                    <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
                                                                                                                                                                                                                                                                                    <p className="text-gray-600 text-sm uppercase tracking-wide">Month-to-Date Performance (Day {workingDays})</p>
                                                                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                  <StandardsComparison totals={teamTotals} />
                                                                                                                                                                                                                                                                                                                                            <DailyChecklist />
                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                                                                                              </PasswordProtection>
                                                                                                                                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                                                                                                                                }'