import { NextResponse } from 'next/server';
import { getDashboardData } from '@/lib/googleSheets';

export async function GET() {
  try {
    // Check if Google Sheets is configured
    if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID || 
        !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 
        !process.env.GOOGLE_PRIVATE_KEY) {
      
      // Return mock data if not configured
      console.warn('Google Sheets not configured, using mock data');
      const mockData = {
        monthName: 'January',
        year: 2026,
        workingDays: { total: 23, used: 16, remaining: 7 },
        weekWorkingDays: { total: 5, used: 4, remaining: 1 },
        config: {
          teamSize: 3,
          targets: { revenue: 500, sales: 1, attended: 2, bookings: 4, calls: 40 },
          holidays: ['2026-01-01', '2026-01-26'],
          teamMembers: [
            { name: 'Team Member 1', startDate: '2026-01-01' },
            { name: 'Team Member 2', startDate: '2026-01-15' },
            { name: 'Team Member 3', startDate: '2026-01-20' },
          ],
        },
        teamTotals: {
          revenue: 4650,
          sales: 12,
          attended: 21,
          bookings: 45,
          calls: 381,
        },
        teamMTDTargets: {
          revenue: 7200,
          sales: 18,
          attended: 36,
          bookings: 72,
          calls: 720,
        },
        teamVariances: {
          revenue: { diff: -2550, percentage: -35, daysAheadBehind: -5.1 },
          sales: { diff: -6, percentage: -33, daysAheadBehind: -6 },
          attended: { diff: -15, percentage: -42, daysAheadBehind: -7.5 },
          bookings: { diff: -27, percentage: -38, daysAheadBehind: -6.8 },
          calls: { diff: -339, percentage: -47, daysAheadBehind: -8.5 },
        },
        memberData: [
          {
            name: 'Team Member 1',
            startDate: '2026-01-01',
            isNew: false,
            workingDays: 16,
            data: { revenue: 1550, sales: 4, attended: 7, bookings: 15, calls: 127 },
            mtdTargets: { revenue: 8000, sales: 16, attended: 32, bookings: 64, calls: 640 },
            variances: {
              revenue: { diff: -6450, percentage: -81, daysAheadBehind: -12.9 },
              sales: { diff: -12, percentage: -75, daysAheadBehind: -12 },
              attended: { diff: -25, percentage: -78, daysAheadBehind: -12.5 },
              bookings: { diff: -49, percentage: -77, daysAheadBehind: -12.3 },
              calls: { diff: -513, percentage: -80, daysAheadBehind: -12.8 },
            },
            progress: 19,
            status: 'Underperforming',
            biggestShortfall: 'revenue',
            biggestShortfallDays: -12.9,
          },
        ],
        newMembers: [
          {
            name: 'Team Member 3',
            startDate: '2026-01-20',
            isNew: true,
            workingDays: 4,
            data: { revenue: 2100, sales: 5, attended: 8, bookings: 18, calls: 180 },
            mtdTargets: { revenue: 2000, sales: 4, attended: 8, bookings: 16, calls: 160 },
            variances: {
              revenue: { diff: 100, percentage: 5, daysAheadBehind: 0.2 },
            },
            progress: 105,
            status: 'Overperforming',
            biggestShortfall: 'revenue',
          },
        ],
      };
      return NextResponse.json(mockData);
    }

    // Fetch real data from Google Sheets
    const data = await getDashboardData();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

export const revalidate = 300; // Revalidate every 5 minutes
