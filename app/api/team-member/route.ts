import { NextResponse } from 'next/server';
import { getTeamMemberDetail } from '@/lib/googleSheets';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json(
        { error: 'Team member name is required' },
        { status: 400 }
      );
    }

    // Check if Google Sheets is configured
    if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID || 
        !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 
        !process.env.GOOGLE_PRIVATE_KEY) {
      
      // Return mock data if not configured
      console.warn('Google Sheets not configured, using mock data');
      const mockData = {
        name,
        weeklyData: [
          {
            week: 'Week 4 (2026)',
            weekNumber: 4,
            year: 2026,
            startDate: '2026-01-20',
            revenue: 2800,
            sales: 7,
            attended: 12,
            bookings: 24,
            calls: 215,
            progress: 112,
            avgRevenue: 560,
            avgSales: 1.4,
            avgAttended: 2.4,
            avgBookings: 4.8,
            avgCalls: 43,
            days: [
              { date: '2026-01-20', revenue: 500, sales: 1, attended: 2, bookings: 4, calls: 40 },
              { date: '2026-01-21', revenue: 450, sales: 1, attended: 3, bookings: 5, calls: 42 },
              { date: '2026-01-22', revenue: 600, sales: 2, attended: 2, bookings: 6, calls: 45 },
              { date: '2026-01-23', revenue: 550, sales: 1, attended: 2, bookings: 4, calls: 38 },
              { date: '2026-01-24', revenue: 700, sales: 2, attended: 3, bookings: 5, calls: 50 },
            ],
          },
          {
            week: 'Week 3 (2026)',
            weekNumber: 3,
            year: 2026,
            startDate: '2026-01-13',
            revenue: 2400,
            sales: 5,
            attended: 10,
            bookings: 20,
            calls: 200,
            progress: 96,
            avgRevenue: 480,
            avgSales: 1,
            avgAttended: 2,
            avgBookings: 4,
            avgCalls: 40,
            days: [],
          },
        ],
        totalData: {
          revenue: 5200,
          sales: 12,
          attended: 22,
          bookings: 44,
          calls: 415,
        },
        ytdData: {
          revenue: 5200,
          sales: 12,
          attended: 22,
          bookings: 44,
          calls: 415,
        },
        overallAvg: {
          revenue: 520,
          sales: 1.2,
          attended: 2.2,
          bookings: 4.4,
          calls: 41.5,
        },
        totalDays: 10,
      };
      return NextResponse.json(mockData);
    }

    // Fetch real data from Google Sheets
    const data = await getTeamMemberDetail(name);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching team member data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team member data' },
      { status: 500 }
    );
  }
}

export const revalidate = 300; // Revalidate every 5 minutes
