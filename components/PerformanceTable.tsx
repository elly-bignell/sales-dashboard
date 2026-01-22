interface TeamMember {
  name: string;
  revenue: number;
  sales: number;
  attended: number;
  bookings: number;
  calls: number;
  progress: number;
}

interface PerformanceTableProps {
  teamMembers: TeamMember[];
}

export default function PerformanceTable({ teamMembers }: PerformanceTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🏆</span>
        <h2 className="text-xl font-bold text-gray-900">Staff Performance Standings</h2>
      </div>
      <p className="text-gray-600 text-sm mb-6">Ranking team members based on total weekly volume across all metrics.</p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
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
            {teamMembers.map((member, index) => (
              <tr key={member.name} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-gray-900">{member.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold text-gray-900">${member.revenue}</td>
                <td className="py-4 px-4 font-semibold text-gray-900">{member.sales}</td>
                <td className="py-4 px-4 font-semibold text-gray-900">{member.attended}</td>
                <td className="py-4 px-4 font-semibold text-gray-900">{member.bookings}</td>
                <td className="py-4 px-4 font-semibold text-gray-900">{member.calls}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                      <div 
                        className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(member.progress, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{member.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
