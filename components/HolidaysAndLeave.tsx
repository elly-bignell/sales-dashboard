'use client';

import { australianHolidays2026 } from '@/lib/australianHolidays';

interface HolidaysAndLeaveProps {
  currentMonth: number;
  currentYear: number;
  nextMonth: number;
  nextYear: number;
  approvedLeave?: Array<{ teamMember: string; date: string }>;
}

export default function HolidaysAndLeave({
  currentMonth,
  currentYear,
  nextMonth,
  nextYear,
  approvedLeave = [],
}: HolidaysAndLeaveProps) {
  const currentMonthHolidays = australianHolidays2026.filter(function(h) {
    const parts = h.date.split('-').map(Number);
    return parts[0] === currentYear && parts[1] === currentMonth;
  });

  const nextMonthHolidays = australianHolidays2026.filter(function(h) {
    const parts = h.date.split('-').map(Number);
    return parts[0] === nextYear && parts[1] === nextMonth;
  });

  const groupHolidaysByType = function(holidays: typeof australianHolidays2026) {
    const grouped: { [key: string]: typeof australianHolidays2026 } = {};
    holidays.forEach(function(h) {
      if (!grouped[h.type]) {
        grouped[h.type] = [];
      }
      grouped[h.type].push(h);
    });
    return grouped;
  };

  const renderHolidaysSection = function(holidays: typeof australianHolidays2026, monthName: string) {
    if (holidays.length === 0) {
      return (
        <div className="text-xs text-gray-400 italic">
          No public holidays in {monthName}
        </div>
      );
    }

    const grouped = groupHolidaysByType(holidays);
    const typeOrder = ['National', 'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
    const sortedTypes = Object.keys(grouped).sort(
      function(a, b) { return typeOrder.indexOf(a) - typeOrder.indexOf(b); }
    );

    return (
      <div className="space-y-2">
        {sortedTypes.map(function(type) {
          return (
            <div key={type}>
              <div
                className={'text-xs font-semibold uppercase tracking-wide ' + (
                  type === 'National'
                    ? 'text-red-600 bg-red-50 px-2 py-1 rounded'
                    : 'text-gray-500'
                )}
              >
                {type === 'National' ? '\uD83C\uDDE6\uD83C\uDDFA ' : ''}{type}
              </div>
              <div className="ml-2 space-y-1">
                {grouped[type].map(function(holiday) {
                  return (
                    <div key={holiday.date + holiday.name} className="text-xs text-gray-700">
                      <span className="font-medium">{holiday.date.split('-')[2]}</span>
                      {' — '}
                      <span>{holiday.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const leaveInMonth = function(month: number, year: number) {
    return approvedLeave.filter(function(leave) {
      var parts = leave.date.split('-').map(Number);
      return parts[0] === year && parts[1] === month;
    });
  };

  const currentMonthLeave = leaveInMonth(currentMonth, currentYear);
  const nextMonthLeave = leaveInMonth(nextMonth, nextYear);

  const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-6 h-fit sticky top-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
          {'\uD83D\uDCC5'} Holidays &amp; Leave
        </h3>

        {/* Current Month */}
        <div className="mb-5">
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
            {monthNames[currentMonth]} {currentYear}
          </div>
          <div className="pl-3 border-l-2 border-blue-200">
            {renderHolidaysSection(currentMonthHolidays, monthNames[currentMonth])}
          </div>
          {currentMonthLeave.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">
                Team Leave
              </div>
              <div className="space-y-1">
                {currentMonthLeave.map(function(leave) {
                  return (
                    <div key={leave.teamMember + '-' + leave.date} className="text-xs">
                      <span className="font-medium text-amber-700">{leave.teamMember}</span>
                      <span className="text-gray-500 text-xs"> — {leave.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Next Month */}
        <div>
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
            {monthNames[nextMonth]} {nextYear}
          </div>
          <div className="pl-3 border-l-2 border-green-200">
            {renderHolidaysSection(nextMonthHolidays, monthNames[nextMonth])}
          </div>
          {nextMonthLeave.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">
                Team Leave
              </div>
              <div className="space-y-1">
                {nextMonthLeave.map(function(leave) {
                  return (
                    <div key={leave.teamMember + '-' + leave.date} className="text-xs">
                      <span className="font-medium text-amber-700">{leave.teamMember}</span>
                      <span className="text-gray-500 text-xs"> — {leave.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
