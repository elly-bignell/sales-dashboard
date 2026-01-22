import { google } from 'googleapis';

// Initialize Google Sheets API
export async function getGoogleSheetsClient() {
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n')
      : undefined;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    return sheets;
  } catch (error) {
    console.error('Error initializing Google Sheets client:', error);
    throw error;
  }
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

// Parse data by week for individual team member
export function parseWeeklyData(rows: any[]) {
  if (rows.length < 2) {
    return [];
  }

  // Skip header row
  const dataRows = rows.slice(1);
  
  // Group by week
  const weeklyData: { [key: string]: any } = {};
  
  dataRows.forEach(row => {
    if (!row[0]) return; // Skip if no date
    
    const date = new Date(row[0]);
    const weekNumber = getWeekNumber(date);
    const weekKey = `Week ${weekNumber.week} (${weekNumber.year})`;
    
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = {
        week: weekKey,
        weekNumber: weekNumber.week,
        year: weekNumber.year,
        startDate: getStartOfWeek(date),
        revenue: 0,
        sales: 0,
        attended: 0,
        bookings: 0,
        calls: 0,
        days: [],
      };
    }
    
    weeklyData[weekKey].revenue += parseFloat(row[1]) || 0;
    weeklyData[weekKey].sales += parseInt(row[2]) || 0;
    weeklyData[weekKey].attended += parseInt(row[3]) || 0;
    weeklyData[weekKey].bookings += parseInt(row[4]) || 0;
    weeklyData[weekKey].calls += parseInt(row[5]) || 0;
    
    weeklyData[weekKey].days.push({
      date: row[0],
      revenue: parseFloat(row[1]) || 0,
      sales: parseInt(row[2]) || 0,
      attended: parseInt(row[3]) || 0,
      bookings: parseInt(row[4]) || 0,
      calls: parseInt(row[5]) || 0,
    });
  });
  
  // Convert to array and sort by date (newest first)
  const weeks = Object.values(weeklyData).sort((a: any, b: any) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });
  
  // Calculate averages and progress for each week
  return weeks.map((week: any) => ({
    ...week,
    progress: calculateProgress({
      revenue: week.revenue,
      sales: week.sales,
      attended: week.attended,
      bookings: week.bookings,
      calls: week.calls,
    }),
    avgRevenue: Math.round(week.revenue / week.days.length),
    avgSales: Math.round((week.sales / week.days.length) * 10) / 10,
    avgAttended: Math.round((week.attended / week.days.length) * 10) / 10,
    avgBookings: Math.round((week.bookings / week.days.length) * 10) / 10,
    avgCalls: Math.round((week.calls / week.days.length) * 10) / 10,
  }));
}

// Helper: Get week number
function getWeekNumber(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { week: weekNo, year: d.getUTCFullYear() };
}

// Helper: Get start of week (Monday)
function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// Get individual team member detailed data
export async function getTeamMemberDetail(memberName: string) {
  try {
    const rows = await getSheetData(memberName);
    const weeklyData = parseWeeklyData(rows);
    const totalData = parseTeamMemberData(rows);
    
    // Calculate YTD (Year to Date) totals
    const currentYear = new Date().getFullYear();
    const ytdData = weeklyData
      .filter((week: any) => week.year === currentYear)
      .reduce((acc, week: any) => ({
        revenue: acc.revenue + week.revenue,
        sales: acc.sales + week.sales,
        attended: acc.attended + week.attended,
        bookings: acc.bookings + week.bookings,
        calls: acc.calls + week.calls,
      }), { revenue: 0, sales: 0, attended: 0, bookings: 0, calls: 0 });
    
    // Calculate overall averages
    const totalDays = weeklyData.reduce((sum: number, week: any) => sum + week.days.length, 0);
    
    return {
      name: memberName,
      weeklyData,
      totalData,
      ytdData,
      overallAvg: {
        revenue: totalDays > 0 ? Math.round(totalData.revenue / totalDays) : 0,
        sales: totalDays > 0 ? Math.round((totalData.sales / totalDays) * 10) / 10 : 0,
        attended: totalDays > 0 ? Math.round((totalData.attended / totalDays) * 10) / 10 : 0,
        bookings: totalDays > 0 ? Math.round((totalData.bookings / totalDays) * 10) / 10 : 0,
        calls: totalDays > 0 ? Math.round((totalData.calls / totalDays) * 10) / 10 : 0,
      },
      totalDays,
    };
  } catch (error) {
    console.error(`Error fetching data for ${memberName}:`, error);
    throw error;
  }
}
