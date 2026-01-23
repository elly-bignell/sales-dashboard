interface DailyStandardsStripProps {
  targets: {
    revenue: number;
    sales: number;
    attended: number;
    bookings: number;
    calls: number;
  };
}

export default function DailyStandardsStrip({ targets }: DailyStandardsStripProps) {
  return (
    <div className="h-full flex flex-col justify-center">
      <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">Daily Standards</div>
      <div className="flex gap-2">
        <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-center border border-gray-100">
          <div className="text-sm font-semibold text-gray-900">${targets.revenue}</div>
          <div className="text-xs text-gray-500">Revenue</div>
        </div>
        <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-center border border-gray-100">
          <div className="text-sm font-semibold text-gray-900">{targets.sales}</div>
          <div className="text-xs text-gray-500">Sales</div>
        </div>
        <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-center border border-gray-100">
          <div className="text-sm font-semibold text-gray-900">{targets.attended}</div>
          <div className="text-xs text-gray-500">Attended</div>
        </div>
        <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-center border border-gray-100">
          <div className="text-sm font-semibold text-gray-900">{targets.bookings}</div>
          <div className="text-xs text-gray-500">Bookings</div>
        </div>
        <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-center border border-gray-100">
          <div className="text-sm font-semibold text-gray-900">{targets.calls}</div>
          <div className="text-xs text-gray-500">Calls</div>
        </div>
      </div>
    </div>
  );
}
