import Link from 'next/link';

interface TeamMember {
  name: string;
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
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🏆</span>
        <h2 className="text-xl font-bold text-gray-900">Team Leaderboard</h2>
      </div>
      <p className="text-gray-600 text-sm mb-6">
        Ordered by Sales Revenue (highest to lowest). Click a name to view detailed breakdown.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Rank</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Staff Member</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Sales Revenue</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Sales</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Attended</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Bookings</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Calls</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Progress</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => {
              const revenueVar = member.variances.revenue;
              const isRevenuePositive = revenueVar.diff >= 0;
              
              return (
                <tr key={member.name} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Link 
                      href={`/team-member?name=${encodeURIComponent(member.name)}`}
                      className="font-semibold text-gray-900 hover:text-pink-600 transition-colors block"
                    >
                      {member.name}
                    </Link>
                    <div className="mt-1">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                        member.status === 'Overperforming' ? 'bg-green-100 text-green-800' :
                        member.status === 'Underperforming' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-900">
                      ${Math.round(member.data.revenue).toLocaleString()}
                    </div>
                    <div className={`text-xs ${isRevenuePositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isRevenuePositive ? '+' : ''}{revenueVar.percentage}% 
                      <span className="ml-1">({isRevenuePositive ? '+' : ''}{revenueVar.daysAheadBehind.toFixed(1)}d)</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-900">{member.data.sales}</div>
                    <div className={`text-xs ${member.variances.sale
