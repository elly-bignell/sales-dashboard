'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PersonPage() {
  const params = useParams();
  const personKey = decodeURIComponent(params.personKey as string);
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'mtd' | 'wtd'>('mtd');
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'notes'>('overview');
  const [notes, setNotes] = useState<{ date: string; text: string }[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(function() {
    fetchPersonData();
  }, [personKey]);

  const fetchPersonData = async function() {
    try {
      const response = await fetch('/api/person/' + encodeURIComponent(personKey));
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching person data:', error);
      setLoading(false);
    }
  };

  const addNote = function() {
    if (newNote.trim()) {
      const today = new Date().toISOString().split('T')[0];
      setNotes([{ date: today, text: newNote.trim() }, ...notes]);
      setNewNote('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Person not found</div>
      </div>
    );
  }

  const currentPeriod = period === 'mtd' ? data.mtd : data.wtd;
  const periodLabel = period === 'mtd' ? 'Month to Date' : 'Week to Date';

  const kpis = [
    { key: 'revenue', label: 'Revenue', format: 'currency' },
    { key: 'sales', label: 'Sales', format: 'number' },
    { key: 'attended', label: 'Attended', format: 'number' },
    { key: 'bookings', label: 'Bookings', format: 'number' },
    { key: 'calls', label: 'Calls', format: 'number' },
  ];

  const formatValue = function(value: number, format: string) {
    if (format === 'currency') return '$' + Math.round(value).toLocaleString();
    return Math.round(value).toString();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Link href="/people" className="text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2 inline-block">
              ← Back to Team Directory
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{data.displayName}</h1>
              <span className={'px-3 py-1 text-sm font-medium rounded-full ' + (
                currentPeriod.status === 'Overperforming' ? 'bg-green-100 text-green-700' :
                currentPeriod.status === 'Underperforming' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-600'
              )}>
                {currentPeriod.status}
              </span>
              {data.isNew && <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">NEW</span>}
            </div>
            <p className="text-gray-500 mt-1">
              Started {new Date(data.startDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })} • {data.daysOnBoard} days on board • {data.weeksOnBoard} weeks
            </p>
          </div>
          
          {/* Period Toggle */}
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={function() { setPeriod('mtd'); }}
              className={'px-4 py-2 text-sm font-medium rounded-md transition-colors ' + (period === 'mtd' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50')}
            >
              MTD
            </button>
            <button
              onClick={function() { setPeriod('wtd'); }}
              className={'px-4 py-2 text-sm font-medium rounded-md transition-colors ' + (period === 'wtd' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50')}
            >
              WTD
            </button>
          </div>
        </div>

        {/* At a Glance */}
        <div className="grid grid-cols-3 gap-6">
          {/* KPI Cards */}
          <div className="col-span-2 grid grid-cols-5 gap-3">
            {kpis.map(function(kpi) {
              const actual = currentPeriod.data[kpi.key];
              const target = currentPeriod.targets[kpi.key];
              const variance = currentPeriod.variances[kpi.key];
              const progress = target > 0 ? Math.min((actual / target) * 100, 100) : 0;
              const isPositive = variance.diff >= 0;

              return (
                <div key={kpi.key} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{kpi.label}</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{formatValue(actual, kpi.format)}</div>
                  <div className="text-xs text-gray-500 mb-2">Target: {formatValue(target, kpi.format)}</div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                    <div 
                      className={'h-1.5 rounded-full ' + (isPositive ? 'bg-green-500' : 'bg-red-500')}
                      style={{ width: progress + '%' }}
                    />
                  </div>
                  <div className={'text-xs font-medium ' + (isPositive ? 'text-green-600' : 'text-red-600')}>
                    {isPositive ? '+' : ''}{variance.daysAheadBehind.toFixed(1)}d {isPositive ? 'ahead' : 'behind'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* What's Driving the Result */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">What's Driving the Result</h3>
            {currentPeriod.status === 'Overperforming' ? (
              <p className="text-sm text-green-600">✓ Ahead on all KPIs</p>
            ) : currentPeriod.shortfalls && currentPeriod.shortfalls.length > 0 ? (
              <ul className="space-y-2">
                {currentPeriod.shortfalls.map(function(shortfall: any) {
                  return (
                    <li key={shortfall.name} className="text-sm text-red-600 capitalize">
                      • {shortfall.name}: {shortfall.value.toFixed(1)} days behind
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No significant shortfalls detected</p>
            )}
          </div>
        </div>

        {/* Personal Bests */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Personal Bests</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="text-xs text-gray-500 mb-1">Best Revenue Week</div>
              <div className="text-xl font-bold text-gray-900">
                {data.personalBests.bestRevenueWeek ? '$' + Math.round(data.personalBests.bestRevenueWeek.revenue).toLocaleString() : '—'}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="text-xs text-gray-500 mb-1">Best Sales Week</div>
              <div className="text-xl font-bold text-gray-900">
                {data.personalBests.bestSalesWeek ? data.personalBests.bestSalesWeek.sales : '—'}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="text-xs text-gray-500 mb-1">Best Revenue Month</div>
              <div className="text-xl font-bold text-gray-900">
                {data.personalBests.bestRevenueMonth ? '$' + Math.round(data.personalBests.bestRevenueMonth.revenue).toLocaleString() : '—'}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="text-xs text-gray-500 mb-1">Best Sales Month</div>
              <div className="text-xl font-bold text-gray-900">
                {data.personalBests.bestSalesMonth ? data.personalBests.bestSalesMonth.sales : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex gap-0">
              <button
                onClick={function() { setActiveTab('overview'); }}
                className={'px-6 py-3 text-sm font-medium border-b-2 transition-colors ' + (activeTab === 'overview' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700')}
              >
                Overview
              </button>
              <button
                onClick={function() { setActiveTab('activity'); }}
                className={'px-6 py-3 text-sm font-medium border-b-2 transition-colors ' + (activeTab === 'activity' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700')}
              >
                Activity
              </button>
              <button
                onClick={function() { setActiveTab('notes'); }}
                className={'px-6 py-3 text-sm font-medium border-b-2 transition-colors ' + (activeTab === 'notes' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700')}
              >
                Notes
              </button>
            </div>
          </div>

          <div className="p-5">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">KPI Summary ({periodLabel})</h4>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase">KPI</th>
                        <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Actual</th>
                        <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Target</th>
                        <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Variance</th>
                        <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Days +/-</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kpis.map(function(kpi) {
                        const actual = currentPeriod.data[kpi.key];
                        const target = currentPeriod.targets[kpi.key];
                        const variance = currentPeriod.variances[kpi.key];
                        const isPositive = variance.diff >= 0;
                        return (
                          <tr key={kpi.key} className="border-b border-gray-50">
                            <td className="py-3 text-sm font-medium text-gray-900">{kpi.label}</td>
                            <td className="py-3 text-sm text-right text-gray-900">{formatValue(actual, kpi.format)}</td>
                            <td className="py-3 text-sm text-right text-gray-500">{formatValue(target, kpi.format)}</td>
                            <td className={'py-3 text-sm text-right ' + (isPositive ? 'text-green-600' : 'text-red-600')}>
                              {isPositive ? '+' : ''}{formatValue(variance.diff, kpi.format)}
                            </td>
                            <td className={'py-3 text-sm text-right font-medium ' + (isPositive ? 'text-green-600' : 'text-red-600')}>
                              {isPositive ? '+' : ''}{variance.daysAheadBehind.toFixed(1)}d
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Individual Daily Standards</h4>
                  <div className="flex gap-3">
                    {kpis.map(function(kpi) {
                      return (
                        <div key={kpi.key} className="bg-slate-50 rounded-lg px-4 py-2 text-center border border-slate-100">
                          <div className="text-sm font-semibold text-gray-900">{formatValue(data.dailyTargets[kpi.key], kpi.format)}</div>
                          <div className="text-xs text-gray-500">{kpi.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Daily Activity ({periodLabel})</h4>
                {currentPeriod.data.dailyData && currentPeriod.data.dailyData.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase">Date</th>
                        <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Revenue</th>
                        <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Sales</th>
                        <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Attended</th>
                        <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Bookings</th>
                        <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Calls</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPeriod.data.dailyData.slice().reverse().map(function(day: any) {
                        const dateObj = new Date(day.date);
                        const formattedDate = dateObj.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
                        return (
                          <tr key={day.date} className="border-b border-gray-50">
                            <td className="py-3 text-sm text-gray-900">{formattedDate}</td>
                            <td className="py-3 text-sm text-right text-gray-900">${Math.round(day.revenue).toLocaleString()}</td>
                            <td className="py-3 text-sm text-right text-gray-900">{day.sales}</td>
                            <td className="py-3 text-sm text-right text-gray-900">{day.attended}</td>
                            <td className="py-3 text-sm text-right text-gray-900">{day.bookings}</td>
                            <td className="py-3 text-sm text-right text-gray-900">{day.calls}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-gray-500">No activity data for this period.</p>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Add Note</h4>
                  <div className="flex gap-3">
                    <textarea
                      value={newNote}
                      onChange={function(e) { setNewNote(e.target.value); }}
                      placeholder="Add a note about this team member..."
                      className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                      rows={2}
                    />
                    <button
                      onClick={addNote}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors self-end"
                    >
                      Add Note
                    </button>
                  </div>
                </div>

                {notes.length > 0 ? (
                  <div className="space-y-3">
                    {notes.map(function(note, index) {
                      return (
                        <div key={index} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                          <div className="text-xs text-gray-500 mb-1">{note.date}</div>
                          <div className="text-sm text-gray-900">{note.text}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No notes yet.</p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
