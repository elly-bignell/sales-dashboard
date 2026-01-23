interface TeamMember {
  name: string;
  displayName: string;
  startDate: string;
  workingDays: number;
  data: {
    revenue: number;
    sales: number;
    attended: number;
    bookings: number;
    calls: number;
  };
  variances: {
    revenue: { diff: number; percentage: number; daysAheadBehind: number };
  };
  progress: number;
  status: 'Underperforming' | 'On Standard' | 'Overperforming';
  biggestShortfall?: string;
}

interface NewMembersSectionProps {
  members: TeamMember[];
  dailyTargets: any;
}

export default function NewMembersSection({ members, dailyTargets }: NewMembersSectionProps) {
  if (members.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🆕</span>
        <h2 className="text-lg font-semibold text-gray-900">New Team Members</h2>
      </div>
      <p className="text-gray-500 text-sm mb-5">
        Joined this month. Pro-rated targets based on start date.
      </p>

      <div className="space-y-4">
        {members.map(function(member) {
          const startDate = new Date(member.startDate);
          const formattedDate = startDate.toLocaleDateString('en-AU', { 
            month: 'short', 
            day: 'numeric' 
          });
          
          const isPositive = member.variances.revenue.diff >= 0;
          
          return (
            <div key={member.name} className="bg-slate-50 rounded-lg p-5 border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{member.displayName}</h3>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">NEW</span>
                    <span className={'px-2 py-0.5 text-xs font-medium rounded ' + (
                      member.status === 'Overperforming' ? 'bg-green-100 text-green-700' :
                      member.status === 'Underperforming' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    )}>
                      {member.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Started {formattedDate} • {member.workingDays} working day{member.workingDays !== 1 ? 's' : ''} tracked
                  </p>
                </div>
                <div className="text-right">
                  <div className={'text-2xl font-bold ' + (member.progress >= 100 ? 'text-green-600' : member.progress >= 70 ? 'text-gray-900' : 'text-red-600')}>
                    {member.progress}%
                  </div>
                  <div className="text-xs text-gray-500">Progress</div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">
                <div className="bg-white rounded-lg p-3 text-center border border-slate-200">
                  <div className="text-xs text-gray-500 mb-1">Revenue</div>
                  <div className="font-semibold text-gray-900">${Math.round(member.data.revenue).toLocaleString()}</div>
                  <div className={'text-xs mt-1 ' + (isPositive ? 'text-green-600' : 'text-red-600')}>
                    {isPositive ? '+' : ''}{member.variances.revenue.daysAheadBehind.toFixed(1)}d
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-slate-200">
                  <div className="text-xs text-gray-500 mb-1">Sales</div>
                  <div className="font-semibold text-gray-900">{member.data.sales}</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-slate-200">
                  <div className="text-xs text-gray-500 mb-1">Attended</div>
                  <div className="font-semibold text-gray-900">{member.data.attended}</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-slate-200">
                  <div className="text-xs text-gray-500 mb-1">Bookings</div>
                  <div className="font-semibold text-gray-900">{member.data.bookings}</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-slate-200">
                  <div className="text-xs text-gray-500 mb-1">Calls</div>
                  <div className="font-semibold text-gray-900">{member.data.calls}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
