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
    // Filter holidays for current month
  const currentMonthHolidays = australianHolidays2026.filter((h) => {
        const [year, month] = h.date.split('-').map(Number);
        return year === currentYear && month === currentMonth;
  });

  // Filter holidays for next month
  const nextMonthHolidays = australianHolidays2026.filter((h) => {
        const [year, month] = h.date.split('-').map(Number);
        return year === nextYear && month === nextMonth;
  });

  // Group holidays by type
  const groupHolidaysByType = (holidays: typeof australianHolidays2026) => {
        const grouped: { [key: string]: typeof australianHolidays2026 } = {};
        holidays.forEach((h) => {
                if (!grouped[h.type]) {
                          grouped[h.type] = [];
                }
                grouped[h.type].push(h);
        });
        return grouped;
  };

  const renderHolidaysSection = (
        holidays: typeof australianHolidays2026,
        monthName: string
      ) => {
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
                    (a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b)
                          );
        
            return (
                    <div className="space-y-2">
                      {sortedTypes.map((type) => (
                                <div key={type}>
                                            <div
                                                            className={`text-xs font-semibold uppercase tracking-wide ${
                                                                              type === 'National'
                                                                                ? 'text-red-600 bg-red-50 px-2 py-1 rounded'
                                                                                : 'text-gray-500'
                                                            }`}
                                                          >
                                              {type === 'National' ? '🇦🇺 ' : ''}{type}
                                            </div>div>
                                            <div className="ml-2 space-y-1">
                                              {grouped[type].map((holiday) => (
                                                  <div key={holiday.date} className="text-xs text-gray-700">
                                                                    <span className="font-medium">{holiday.date.split('-')[2]}</span>span>
                                                    {' - '}
                                                                    <span>{holiday.name}</span>span>
                                                  </div>div>
                                                ))}
                                            </div>div>
                                </div>div>
                              ))}
                    </div>div>
                  );
      };
  
    // Get unique team members on leave in current and next month
    const leaveInMonth = (month: number, year: number) => {
          return approvedLeave.filter((leave) => {
                  const [leaveYear, leaveMonth] = leave.date.split('-').map(Number);
                  return leaveYear === year && leaveMonth === month;
          });
    };
  
    const currentMonthLeave = leaveInMonth(currentMonth, currentYear);
    const nextMonthLeave = leaveInMonth(nextMonth, nextYear);
  
    return (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-6 h-fit sticky top-6">
                <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                                  📅 Holidays & Leave
                        </h3>h3>
                
                  {/* Current Month */}
                        <div className="mb-5">
                                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                                              This Month
                                  </div>div>
                                  <div className="pl-3 border-l-2 border-blue-200">
                                    {renderHolidaysSection(currentMonthHolidays, 'This Month')}
                                    {currentMonthLeave.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                                          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">
                                                            Team Leave
                                          </div>div>
                                          <div className="space-y-1">
                                            {currentMonthLeave.map((leave) => (
                                                <div key={`${leave.teamMember}-${leave.date}`} className="text-xs">
                                                                      <span className="font-medium text-amber-700">{leave.teamMember}</span>span>
                                                                      <span className="text-gray-500 text-xs"> - {leave.date}</span>span>
                                                </div>div>
                                              ))}
                                          </div>div>
                          </div>div>
                                              )}
                                  </div>div>
                        </div>div>
                
                  {/* Next Month */}
                        <div>
                                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                                              Next Month
                                  </div>div>
                                  <div className="pl-3 border-l-2 border-green-200">
                                    {renderHolidaysSection(nextMonthHolidays, 'Next Month')}
                                    {nextMonthLeave.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                                          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">
                                                            Team Leave
                                          </div>div>
                                          <div className="space-y-1">
                                            {nextMonthLeave.map((leave) => (
                                                <div key={`${leave.teamMember}-${leave.date}`} className="text-xs">
                                                                      <span className="font-medium text-amber-700">{leave.teamMember}</span>span>
                                                                      <span className="text-gray-500 text-xs"> - {leave.date}</span>span>
                                                </div>div>
                                              ))}
                                          </div>div>
                          </div>div>
                                              )}
                                  </div>div>
                        </div>div>
                </div>div>
          </div>div>
        );
}</div>
