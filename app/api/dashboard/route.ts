import { NextResponse } from 'next/server';
import { getDashboardData } from '@/lib/googleSheets';

// Daily targets per person
const DAILY_TARGETS = {
    revenue: 500,
    sales: 1,
    attended: 2,
    bookings: 4,
    calls: 40,
};

const TEAM_SIZE = 3;

// Calculate working days since start of month
function getWorkingDaysSinceMonthStart(): number {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
    let workingDays = 0;

  for (let d = new Date(firstDay); d <= today; d.setDate(d.getDate() + 1)) {
        const day = d.getDay();
        // Count Monday-Friday (1-5)
      if (day !== 0 && day !== 6) {
              workingDays++;
      }
  }

  return workingDays;
}

// Calculate MTD targets
function calculateMTDTargets() {
    const workingDays = getWorkingDaysSinceMonthStart();

  return {
        revenue: DAILY_TARGETS.revenue * TEAM_SIZE * workingDays,
        sales: DAILY_TARGETS.sales * TEAM_SIZE * workingDays,
        attended: DAILY_TARGETS.attended * TEAM_SIZE * workingDays,
        bookings: DAILY_TARGETS.bookings * TEAM_SIZE * workingDays,
        calls: DAILY_TARGETS.calls * TEAM_SIZE * workingDays,
  };
}

// Calculate variance percentage
function calculateVariancePercent(actual: number, target: number): number {
    if (target === 0) return 0;
    return ((actual - target) / target) * 100;
}

export async function GET() {
    try {
          // Check if Google Sheets is configured
      if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID ||
                  !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
                  !process.env.GOOGLE_PRIVATE_KEY) {
              // Return mock data if not configured
            console.warn('Google Sheets not configured, using mock data');

            const mockTeamTotals = {
                      revenue: 7150,
                      sales: 18,
                      attended: 33,
                      bookings: 69,
                      calls: 590,
            };

            const mtdTargets = calculateMTDTargets();

            const mockData = {
                      workingDaysSinceMonthStart: getWorkingDaysSinceMonthStart(),
                      mtdTargets,
                      teamTotals: mockTeamTotals,
                      teamVariances: {
                                  revenue: {
                                                absolute: mockTeamTotals.revenue - mtdTargets.revenue,
                                                percent: calculateVariancePercent(mockTeamTotals.revenue, mtdTargets.revenue),
                                  },
                                  sales: {
                                                absolute: mockTeamTotals.sales - mtdTargets.sales,
                                                percent: calculateVariancePercent(mockTeamTotals.sales, mtdTargets.sales),
                                  },
                                  attended: {
                                                absolute: mockTeamTotals.attended - mtdTargets.attended,
                                                percent: calculateVariancePercent(mockTeamTotals.attended, mtdTargets.attended),
                                  },
                                  bookings: {
                                                absolute: mockTeamTotals.bookings - mtdTargets.bookings,
                                                percent: calculateVariancePercent(mockTeamTotals.bookings, mtdTargets.bookings),
                                  },
                                  calls: {
                                                absolute: mockTeamTotals.calls - mtdTargets.calls,
                                                percent: calculateVariancePercent(mockTeamTotals.calls, mtdTargets.calls),
                                  },
                      },
                      teamMembers: [
                        {
                                      name: 'Team Member 3',
                                      revenue: 4050,
                                      sales: 10,
                                      attended: 19,
                                      bookings: 39,
                                      calls: 336,
                                      progress: 183,
                                      mtdTargets: {
                                                      revenue: DAILY_TARGETS.revenue * getWorkingDaysSinceMonthStart(),
                                                      sales: DAILY_TARGETS.sales * getWorkingDaysSinceMonthStart(),
                                                      attended: DAILY_TARGETS.attended * getWorkingDaysSinceMonthStart(),
                                                      bookings: DAILY_TARGETS.bookings * getWorkingDaysSinceMonthStart(),
                                                      calls: DAILY_TARGETS.calls * getWorkingDaysSinceMonthStart(),
                                      },
                        },
                        {
                                      name: 'Team Member 1',
                                      revenue: 1550,
                                      sales: 4,
                                      attended: 7,
                                      bookings: 15,
                                      calls: 127,
                                      progress: 70,
                                      mtdTargets: {
                                                      revenue: DAILY_TARGETS.revenue * getWorkingDaysSinceMonthStart(),
                                                      sales: DAILY_TARGETS.sales * getWorkingDaysSinceMonthStart(),
                                                      attended: DAILY_TARGETS.attended * getWorkingDaysSinceMonthStart(),
                                                      bookings: DAILY_TARGETS.bookings * getWorkingDaysSinceMonthStart(),
                                                      calls: DAILY_TARGETS.calls * getWorkingDaysSinceMonthStart(),
                                      },
                        },
                        {
                                      name: 'Team Member 2',
                                      revenue: 1550,
                                      sales: 4,
                                      attended: 7,
                                      bookings: 15,
                                      calls: 127,
                                      progress: 70,
                                      mtdTargets: {
                                                      revenue: DAILY_TARGETS.revenue * getWorkingDaysSinceMonthStart(),
                                                      sales: DAILY_TARGETS.sales * getWorkingDaysSinceMonthStart(),
                                                      attended: DAILY_TARGETS.attended * getWorkingDaysSinceMonthStart(),
                                                      bookings: DAILY_TARGETS.bookings * getWorkingDaysSinceMonthStart(),
                                                      calls: DAILY_TARGETS.calls * getWorkingDaysSinceMonthStart(),
                                      },
                        },
                                ],
            };

            return NextResponse.json(mockData);
      }

      // Fetch real data from Google Sheets
      const data = await getDashboardData();

      // Enhance with MTD calculations
      const mtdTargets = calculateMTDTargets();
          const teamVariances = {
                  revenue: {
                            absolute: data.teamTotals.revenue - mtdTargets.revenue,
                            percent: calculateVariancePercent(data.teamTotals.revenue, mtdTargets.revenue),
                  },
                  sales: {
                            absolute: data.teamTotals.sales - mtdTargets.sales,
                            percent: calculateVariancePercent(data.teamTotals.sales, mtdTargets.sales),
                  },
                  attended: {
                            absolute: data.teamTotals.attended - mtdTargets.attended,
                            percent: calculateVariancePercent(data.teamTotals.attended, mtdTargets.attended),
                  },
                  bookings: {
                            absolute: data.teamTotals.bookings - mtdTargets.bookings,
                            percent: calculateVariancePercent(data.teamTotals.bookings, mtdTargets.bookings),
                  },
                  calls: {
                            absolute: data.teamTotals.calls - mtdTargets.calls,
                            percent: calculateVariancePercent(data.teamTotals.calls, mtdTargets.calls),
                  },
          };

      // Add MTD targets to individual team members
      const enhancedTeamMembers = data.teamMembers.map((member: any) => ({
              ...member,
              mtdTargets: {
                        revenue: DAILY_TARGETS.revenue * getWorkingDaysSinceMonthStart(),
                        sales: DAILY_TARGETS.sales * getWorkingDaysSinceMonthStart(),
                        attended: DAILY_TARGETS.attended * getWorkingDaysSinceMonthStart(),
                        bookings: DAILY_TARGETS.bookings * getWorkingDaysSinceMonthStart(),
                        calls: DAILY_TARGETS.calls * getWorkingDaysSinceMonthStart(),
              },
      }));

      return NextResponse.json({
              workingDaysSinceMonthStart: getWorkingDaysSinceMonthStart(),
              mtdTargets,
              teamTotals: data.teamTotals,
              teamVariances,
              teamMembers: enhancedTeamMembers,
      });
    } catch (error) {
          console.error('Error fetching dashboard data:', error);

      // Return fallback data on error
      const mtdTargets = calculateMTDTargets();
          const fallbackData = {
                  workingDaysSinceMonthStart: getWorkingDaysSinceMonthStart(),
                  mtdTargets,
                  teamTotals: {
                            revenue: 0,
                            sales: 0,
                            attended: 0,
                            bookings: 0,
                            calls: 0,
                  },
                  teamVariances: {
                            revenue: { absolute: 0, percent: 0 },
                            sales: { absolute: 0, percent: 0 },
                            attended: { absolute: 0, percent: 0 },
                            bookings: { absolute: 0, percent: 0 },
                            calls: { absolute: 0, percent: 0 },
                  },
                  teamMembers: [
                    {
                                name: 'Team Member 1',
                                revenue: 0,
                                sales: 0,
                                attended: 0,
                                bookings: 0,
                                calls: 0,
                                progress: 0,
                                mtdTargets: {
                                              revenue: DAILY_TARGETS.revenue * getWorkingDaysSinceMonthStart(),
                                              sales: DAILY_TARGETS.sales * getWorkingDaysSinceMonthStart(),
                                              attended: DAILY_TARGETS.attended * getWorkingDaysSinceMonthStart(),
                                              bookings: DAILY_TARGETS.bookings * getWorkingDaysSinceMonthStart(),
                                              calls: DAILY_TARGETS.calls * getWorkingDaysSinceMonthStart(),
                                },
                    },
                    {
                                name: 'Team Member 2',
                                revenue: 0,
                                sales: 0,
                                attended: 0,
                                bookings: 0,
                                calls: 0,
                                progress: 0,
                                mtdTargets: {
                                              revenue: DAILY_TARGETS.revenue * getWorkingDaysSinceMonthStart(),
                                              sales: DAILY_TARGETS.sales * getWorkingDaysSinceMonthStart(),
                                              attended: DAILY_TARGETS.attended * getWorkingDaysSinceMonthStart(),
                                              bookings: DAILY_TARGETS.bookings * getWorkingDaysSinceMonthStart(),
                                              calls: DAILY_TARGETS.calls * getWorkingDaysSinceMonthStart(),
                                },
                    },
                    {
                                name: 'Team Member 3',
                                revenue: 0,
                                sales: 0,
                                attended: 0,
                                bookings: 0,
                                calls: 0,
                                progress: 0,
                                mtdTargets: {
                                              revenue: DAILY_TARGETS.revenue * getWorkingDaysSinceMonthStart(),
                                              sales: DAILY_TARGETS.sales * getWorkingDaysSinceMonthStart(),
                                              attended: DAILY_TARGETS.attended * getWorkingDaysSinceMonthStart(),
                                              bookings: DAILY_TARGETS.bookings * getWorkingDaysSinceMonthStart(),
                                              calls: DAILY_TARGETS.calls * getWorkingDaysSinceMonthStart(),
                                },
                    },
                          ],
          };

      return NextResponse.json(fallbackData);
    }
}

// Add caching and revalidation
export const revalidate = 300; // Revalidate every 5 minutes
