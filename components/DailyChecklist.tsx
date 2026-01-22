export default function DailyChecklist() {
  const checklist = [
    { id: 1, label: 'SALES REVENUE', target: '$500', color: 'bg-pink-500' },
    { id: 2, label: 'SALES', target: '1', color: 'bg-teal-500' },
    { id: 3, label: 'ATTENDED', target: '2', color: 'bg-pink-500' },
    { id: 4, label: 'BOOKINGS', target: '4', color: 'bg-teal-500' },
    { id: 5, label: 'CALLS', target: '40', color: 'bg-pink-500' },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg p-8 text-white relative overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-8 border-gray-700 opacity-30"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2 italic">DAILY FOCUS CHECKLIST</h2>
        <p className="text-gray-300 text-sm mb-6">EVERY TEAM MEMBER MUST HIT THESE NUMBERS DAILY:</p>

        <div className="space-y-3">
          {checklist.map((item) => (
            <div key={item.id} className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-4">
              <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                {item.id === 1 ? '$' : item.id}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">{item.label}</h3>
                <p className="text-gray-300 text-sm">Standard per person per day</p>
              </div>
              <div className="text-2xl font-bold text-white">{item.target}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
