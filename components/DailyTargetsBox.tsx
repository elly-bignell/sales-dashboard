interface DailyTargetsBoxProps {
  targets: {
    revenue: number;
    sales: number;
    attended: number;
    bookings: number;
    calls: number;
  };
}

export default function DailyTargetsBox({ targets }: DailyTargetsBoxProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg p-6 text-white">
      <h3 className="text-lg font-bold mb-2 italic">DAILY TARGETS</h3>
      <p className="text-gray-300 text-xs mb-4 uppercase tracking-wide">
        Every team member must hit these numbers daily:
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
              $
            </div>
            <div>
              <div className="font-bold">SALES REVENUE</div>
              <div className="text-xs text-gray-300">Standard per person per day</div>
            </div>
          </div>
          <div className="text-xl font-bold">${targets.revenue}</div>
        </div>

        <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
              2
            </div>
            <div>
              <div className="font-bold">SALES</div>
              <div className="text-xs text-gray-300">Standard per person per day</div>
            </div>
          </div>
          <div className="text-xl font-bold">{targets.sales}</div>
        </div>

        <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <div className="font-bold">ATTENDED</div>
              <div className="text-xs text-gray-300">Standard per person per day</div>
            </div>
          </div>
          <div className="text-xl font-bold">{targets.attended}</div>
        </div>

        <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
              4
            </div>
            <div>
              <div className="font-bold">BOOKINGS</div>
              <div className="text-xs text-gray-300">Standard per person per day</div>
            </div>
          </div>
          <div className="text-xl font-bold">{targets.bookings}</div>
        </div>

        <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
              5
            </div>
            <div>
              <div className="font-bold">CALLS</div>
              <div className="text-xs text-gray-300">Standard per person per day</div>
            </div>
          </div>
          <div className="text-xl font-bold">{targets.calls}</div>
        </div>
      </div>
    </div>
  );
}
