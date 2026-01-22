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
        teamTotals: {
          revenue: 1250,
          sales: 4,
          attended: 8,
          bookings: 15,
          calls: 125
        },
        teamMembers: [
          {
            name: 'Team Member 1',
            revenue: 550,
            sales: 2,
            attended: 3,
            bookings: 6,
            calls: 50,
            progress: 45
          },
          {
            name: 'Team Member 2',
            revenue: 450,
            sales: 1,
            attended: 3,
            bookings: 5,
            calls: 42,
            progress: 38
          },
          {
            name: 'Team Member 3',
            revenue: 250,
            sales: 1,
            attended: 2,
            bookings: 4,
            calls: 33,
            progress: 28
          }
        ]
      };
      return NextResponse.json(mockData);
    }

    // Fetch real data from Google Sheets
    const data = await getDashboardData();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    // Return fallback data on error
    const fallbackData = {
      teamTotals: {
        revenue: 0,
        sales: 0,
        attended: 0,
        bookings: 0,
        calls: 0
      },
      teamMembers: [
        {
          name: 'Team Member 1',
          revenue: 0,
          sales: 0,
          attended: 0,
          bookings: 0,
          calls: 0,
          progress: 0
        },
        {
          name: 'Team Member 2',
          revenue: 0,
          sales: 0,
          attended: 0,
          bookings: 0,
          calls: 0,
          progress: 0
        },
        {
          name: 'Team Member 3',
          revenue: 0,
          sales: 0,
          attended: 0,
          bookings: 0,
          calls: 0,
          progress: 0
        }
      ]
    };
    
    return NextResponse.json(fallbackData);
  }
}

// Add caching and revalidation
export const revalidate = 300; // Revalidate every 5 minutes
