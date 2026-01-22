interface StandardsComparisonProps {
  totals: {
    revenue: number;
    sales: number;
    attended: number;
    bookings: number;
    calls: number;
  };
}

export default function StandardsComparison({ totals }: StandardsComparisonProps) {
  const standards = [
    { label: 'SALES REVENUE', current: totals.revenue, target: 7500, unit: '$' },
    { label: 'SALES', current: totals.sales, target: 15, unit: '' },
    { label: 'ATTENDED', current: totals.attended, target: 30, unit: '' },
    { label: 'BOOKINGS', current: totals.bookings, target: 60, unit: '' },
    { label: 'CALLS', current: totals.calls, target: 600, unit: '' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">STANDARD VS ACHIEVEMENT</h2>
      
      <div className="space-y-6">
        {standards.map((standard) => {
          const percentage = standard.target > 0 ? Math.round((standard.current / standard.target) * 100) : 0;
          
          return (
            <div key={standard.label}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-700">{standard.label}</h3>
                <span className={`text-lg font-bold ${percentage >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                  {percentage}%
                </span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-2xl font-bold text-gray-900">
                  {standard.unit}{standard.current} / {standard.unit}{standard.target}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${percentage >= 100 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
