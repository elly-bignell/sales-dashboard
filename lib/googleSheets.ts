import { google } from 'googleapis';

// Initialize Google Sheets API
export async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

// Fetch data from a specific sheet
export async function getSheetData(sheetName: string) {
  const sheets = await getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:F`,
  });

  return response.data.values || [];
}

// Parse team member data from sheet
export function parseTeamMemberData(rows: any[]) {
  if (rows.length < 2) {
    return {
      revenue: 0,
      sales: 0,
      attended: 0,
      bookings: 0,
      calls: 0,
    };
  }

  // Skip header row
  const dataRows = rows.slice(1);
  
  let totalRevenue = 0;
  let totalSales = 0;
  let totalAttended = 0;
  let totalBookings = 0;
  let totalCalls = 0;

  dataRows.forEach(row => {
    totalRevenue += parseFloat(row[1]) || 0;
    totalSales += parseInt(row[2]) || 0;
    totalAttended += parseInt(row[3]) || 0;
    totalBookings += parseInt(row[4]) || 0;
    totalCalls += parseInt(row[5]) || 0;
  });

  return {
    revenue: totalRevenue,
    sales: totalSales,
    attended: totalAttended,
    bookings: totalBookings,
    calls: totalCalls,
  };
}

// Calculate progress percentage
export function calculateProgress(data: {
  revenue: number;
  sales: number;
  attended: number;
  bookings: number;
  calls: number;
}) {
  const targets = {
    revenue: 2500,
    sales: 5,
    attended: 10,
    bookings: 20,
    calls: 200,
  };

  const revenuePercent = (data.revenue / targets.revenue) * 100;
  const salesPercent = (data.sales / targets.sales) * 100;
  const attendedPercent = (data.attended / targets.attended) * 100;
  const bookingsPercent = (data.bookings / targets.bookings) * 100;
  const callsPercent = (data.calls / targets.calls) * 100;

  const averagePercent = (
    revenuePercent +
    salesPercent +
    attendedPercent +
    bookingsPercent +
    callsPercent
  ) / 5;

  return Math.round(averagePercent);
}

// Get all dashboard data
export async function getDashboardData() {
  try {
    const teamMembers = ['Team Member 1', 'Team Member 2', 'Team Member 3'];
    const memberData = [];

    for (const memberName of teamMembers) {
      const rows = await getSheetData(memberName);
      const data = parseTeamMemberData(rows);
      const progress = calculateProgress(data);

      memberData.push({
        name: memberName,
        ...data,
        progress,
      });
    }

    // Sort by progress (highest first)
    memberData.sort((a, b) => b.progress - a.progress);

    // Calculate team totals
    const teamTotals = {
      revenue: memberData.reduce((sum, m) => sum + m.revenue, 0),
      sales: memberData.reduce((sum, m) => sum + m.sales, 0),
      attended: memberData.reduce((sum, m) => sum + m.attended, 0),
      bookings: memberData.reduce((sum, m) => sum + m.bookings, 0),
      calls: memberData.reduce((sum, m) => sum + m.calls, 0),
    };

    return {
      teamTotals,
      teamMembers: memberData,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}
