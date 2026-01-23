interface TeamMember {
  name: string;
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
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6 border-2 border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🆕</span>
        <h2 className="text-xl font-bold text-gray-900">New Team Members (Joined This Month)</h2>
      </div>
      <p className="text-gray-600 text-sm mb-6">
        Pro-rated targets based on their start date. Tracking separately during onboarding period.
      </p>

      <div className="space-y-4">
        {members.map((member) => {
          const startDate = new Date(member.startDate);
          const formattedDate = startDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
          
          const isPositive = member.variances.revenue.diff >= 0;
          
          return (
            <div key={member.name} className="bg-white rounded-lg p-5 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">NEW</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      member.status === 'Overperforming' ? 'bg-green-100 text-green-800' :
                      member.status === 'Underperforming' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Started: {formattedDate} • {member.workingDays} day{member.workingDays !== 1 ? 's' : ''} tracked
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {member.progress}%
                  </div>
                  <div className="text-xs text-gray-600">Progress</div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Revenue</div>
                  <div className="font-bold text-gray-900">${Math.round(member.data.revenue).toLocaleString()}</div>
                  <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{member.variances.revenue.daysAheadBehind.toFixed(1)}d
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Sales</div>
                  <div className="font-bold text-gray-900">{member.data.sales}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Attended</div>
                  <div className="font-bold text-gray-900">{member.data.attended}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Bookings</div>
                  <div className="font-bold text-gray-900">{member.data.bookings}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Calls</div>
                  <div className="font-bold text-gray-900">{member.data.calls}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
