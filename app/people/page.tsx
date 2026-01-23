'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Person {
  personKey: string;
  displayName: string;
  startDate: string;
  weeksOnBoard: number;
  isNew: boolean;
  revenueMTD: number;
  status: 'Underperforming' | 'On Standard' | 'Overperforming';
  biggestShortfall: string;
  biggestShortfallDays: number;
}

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(function() {
    fetchPeople();
  }, []);

  const fetchPeople = async function() {
    try {
      const response = await fetch('/api/people');
      const data = await response.json();
      setPeople(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching people:', error);
      setLoading(false);
    }
  };

  const filteredPeople = people.filter(function(person) {
    if (filter === 'all') return true;
    if (filter === 'under') return person.status === 'Underperforming';
    if (filter === 'on') return person.status === 'On Standard';
    if (filter === 'over') return person.status === 'Overperforming';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading team...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        
        {/* Header with Logos */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Team Directory</h1>
            <p className="text-gray-500">Click a name to view detailed performance</p>
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

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={function() { setFilter('all'); }}
            className={'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' + (filter === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}
          >
            All ({people.length})
          </button>
          <button
            onClick={function() { setFilter('under'); }}
            className={'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' + (filter === 'under' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}
          >
            Underperforming ({people.filter(function(p) { return p.status === 'Underperforming'; }).length})
          </button>
          <button
            onClick={function() { setFilter('on'); }}
            className={'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' + (filter === 'on' ? 'bg-gray-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}
          >
            On Standard ({people.filter(function(p) { return p.status === 'On Standard'; }).length})
          </button>
          <button
            onClick={function() { setFilter('over'); }}
            className={'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' + (filter === 'over' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}
          >
            Overperforming ({people.filter(function(p) { return p.status === 'Overperforming'; }).length})
          </button>
        </div>

        {/* People Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-slate-50">
                <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Start Date</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Weeks</th>
                <th className="text-right py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Revenue MTD</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Biggest Gap</th>
              </tr>
            </thead>
            <tbody>
              {filteredPeople.map(function(person) {
                const startDate = new Date(person.startDate);
                const formattedDate = startDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
                
                return (
                  <tr key={person.personKey} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-5">
                      <Link 
                        href={'/people/' + encodeURIComponent(person.personKey)}
                        className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {person.displayName}
                      </Link>
                      {person.isNew && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">NEW</span>}
                    </td>
                    <td className="py-4 px-5">
                      <span className={'inline-block px-2 py-1 text-xs font-medium rounded ' + (
                        person.status === 'Overperforming' ? 'bg-green-100 text-green-700' :
                        person.status === 'Underperforming' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      )}>
                        {person.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-sm text-gray-600">{formattedDate}</td>
                    <td className="py-4 px-5 text-sm text-gray-600">{person.weeksOnBoard}w</td>
                    <td className="py-4 px-5 text-right font-medium text-gray-900">${Math.round(person.revenueMTD).toLocaleString()}</td>
                    <td className="py-4 px-5">
                      {person.biggestShortfallDays < 0 ? (
                        <span className="text-sm text-red-600 capitalize">
                          {person.biggestShortfall} ({person.biggestShortfallDays.toFixed(1)}d)
                        </span>
                      ) : (
                        <span className="text-sm text-green-600">All on track</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
