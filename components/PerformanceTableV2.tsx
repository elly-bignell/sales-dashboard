import Link from 'next/link';

interface TeamMember {
  name: string;
  displayName: string;
  startDate: string;
  isNew: boolean;
  workingDays: number;
  data: {
    revenue: number;
    sales: number;
    attended: number;
    bookings: number;
    calls: number;
  };
  mtdTargets: {
    revenue: number;
    sales: number;
    attended: number;
    bookings: number;
    calls: number;
  };
  variances: {
    revenue: { diff: number; percentage: number; daysAheadBehind: number };
    sales: { diff: number; percentage: number; daysAheadBehind: number };
    attended: { diff: number; percentage: number; daysAheadBehind: number };
    bookings: { diff: number; percentage: number; daysAheadBehind: number };
    calls: { diff: number; percentage: number; daysAheadBehind: number };
  };
  progress: number;
  status: 'Underperforming' | 'On Standard' | 'Overperforming';
  biggestShortfall: 'revenue' | 'sales' | 'attended' | 'bookings' | 'calls';
  biggestShortfallDays: number;
}

interface PerformanceTableProps {
  members: TeamMember[];
  dailyTargets: any;
}

export default function PerformanceTableV2({ members, dailyTargets }: PerformanceTableProps) {
  if (members.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🏆</span>
          <h2 className="text-lg font-semibold text-gray-900">Team Leaderboard</h2>
        </div>
        <p className="text-gray-500 text-sm">No team members to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🏆</span>
        <h2 className="text-lg font-semibold text-gray-900">Team Leaderboard</h2>
      </div>
      <p className="text-gray-500 text-sm mb-5">
        Ranked by Sales Revenue. Click a name to view detailed breakdown.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-12">#</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Revenue</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Sales</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Attended</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Bookings</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Calls</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-32">Progress</th>
            </tr>
          </thead>
          <tbody>
            {members.map(function(member, index) {
              const revenueVar = member.variances.revenue;
              const isRevenuePositive = revenueVar.diff >= 0;
              
              return (
                <tr key={member.name} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-3">
                    <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <Link 
                      href={'/team-member?name=' + encodeURIComponent(member.name)}
                      className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {member.displayName}
                    </Link>
                    <div className="mt-1">
                      <span className={'inline-block px-2 py-0.5 text-xs font-medium rounded ' + (
                        member.status === 'Overperforming' ? 'bg-green-100 text-green-700' :
                        member.status === 'Underperforming' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      )}>
                        {member.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="font-semibold text-gray-900">
                      ${Math.round(member.data.revenue).toLocaleString()}
                    </div>
                    <div className={'text-xs ' + (isRevenuePositive ? 'text-green-600' : 'text-red-600')}>
                      {isRevenuePositive ? '+' : ''}{revenueVar.daysAheadBehind.toFixed(1)}d
                    </div>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="font-semibold text-gray-900">{member.data.sales}</div>
                    <div className={'text-xs ' + (member.variances.sales.diff >= 0 ? 'text-green-600' : 'text-red-600')}>
                      {member.variances.sales.diff >= 0 ? '+' : ''}{member.variances.sales.daysAheadBehind.toFixed(1)}d
                    </div>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="font-semibold text-gray-900">{member.data.attended}</div>
                    <div className={'text-xs ' + (member.variances.attended.diff >= 0 ? 'text-green-600' : 'text-red-600')}>
                      {member.variances.attended.diff >= 0 ? '+' : ''}{member.variances.attended.daysAheadBehind.toFixed(1)}d
                    </div>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="font-semibold text-gray-900">{member.data.bookings}</div>
                    <div className={'text-xs ' + (member.variances.bookings.diff >= 0 ? 'text-green-600' : 'text-red-600')}>
                      {member.variances.bookings.diff >= 0 ? '+' : ''}{member.variances.bookings.daysAheadBehind.toFixed(1)}d
                    </div>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="font-semibold text-gray-900">{member.data.calls}</div>
                    <div className={'text-xs ' + (member.variances.calls.diff >= 0 ? 'text-green-600' : 'text-red-600')}>
                      {member.variances.calls.diff >= 0 ? '+' : ''}{member.variances.calls.daysAheadBehind.toFixed(1)}d
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="w-16 bg-gray-100 rounded-full h-2">
                        <div 
                          className={'h-2 rounded-full transition-all duration-300 ' + (
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
  );
}
