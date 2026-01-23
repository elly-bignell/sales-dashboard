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

// Read Config sheet
export async function getConfig() {
  try {
    const rows = await getSheetData('Config');
    
    const config = {
      teamSize: parseInt(rows[1]?.[1]) || 3,
      targets: {
        revenue: parseFloat(rows[2]?.[1]) || 500,
        sales: parseInt(rows[3]?.[1]) || 1,
        attended: parseInt(rows[4]?.[1]) || 2,
        bookings: parseInt(rows[5]?.[1]) || 4,
        calls: parseInt(rows[6]?.[1]) || 40,
      },
      holidays: rows[9]?.[1]?.split(',').map((d: string) => d.trim()) || [],
      teamMembers: [] as { name: string; startDate: string }[],
    };

    // Read team member start dates (starting from row 13, index 12)
    for (let i = 12; i < rows.length && rows[i]?.[0]; i++) {
      if (rows[i][0].startsWith('Team Member') && rows[i][1]) {
        config.teamMembers.push({
          name: rows[i][0],
          startDate: rows[i][1],
        });
      }
    }

    return config;
  } catch (error) {
    console.error('Error reading config:', error);
    // Return defaults if config sheet doesn't exist
    return {
      teamSize: 3,
      targets: { revenue: 500, sales: 1, attended: 2, bookings: 4, calls: 40 },
      holidays: ['2026-01-01', '2026-01-26', '2026-04-25'],
      teamMembers: [
        { name: 'Team Member 1', startDate: '2026-01-01' },
        { name: 'Team Member 2', startDate: '2026-01-15' },
        { name: 'Team Member 3', startDate: '2026-01-20' },
      ],
    };
  }
}

// Calculate working days in a date range
export function getWorkingDays(startDate: Date, endDate: Date, holidays: string[]): number {
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    const dateStr = current.toISOString().split('T')[0];
    
    // Count if it's a weekday and not a holiday
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.includes(dateStr)) {
      count++;
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

// Get working days for current month
export function getMonthWorkingDays(holidays: string[]) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const today = new Date(year, month, now.getDate());
  
  return {
    total: getWorkingDays(monthStart, monthEnd, holidays),
    used: getWorkingDays(monthStart, today, holidays),
    remaining: getWorkingDays(new Date(today.getTime() + 86400000), monthEnd, holidays),
  };
}

// Get working days for current week (Monday to Sunday)
export function getWeekWorkingDays(holidays: string[]) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday
  
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + diff);
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  return {
    total: getWorkingDays(weekStart, weekEnd, holidays),
    used: getWorkingDays(weekStart, today, holidays),
    remaining: getWorkingDays(new Date(today.getTime() + 86400000), weekEnd, holidays),
  };
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
      daysWithData: 0,
    };
  }

  const dataRows = rows.slice(1);
  
  let totalRevenue = 0;
  let totalSales = 0;
  let totalAttended = 0;
  let totalBookings = 0;
  let totalCalls = 0;
  let daysWithData = 0;

  dataRows.forEach(function(row) {
    if (row[0]) {
      totalRevenue += parseFloat(row[1]) || 0;
      totalSales += parseInt(row[2]) || 0;
      totalAttended += parseInt(row[3]) || 0;
      totalBookings += parseInt(row[4]) || 0;
      totalCalls += parseInt(row[5]) || 0;
      daysWithData++;
    }
  });

  return {
    revenue: totalRevenue,
    sales: totalSales,
    attended: totalAttended,
    bookings: totalBookings,
    calls: totalCalls,
    daysWithData,
  };
}

// Calculate variance and days ahead/behind
export function calculateVariance(actual: number, target: number, dailyTarget: number) {
  const diff = actual - target;
  const percentage = target > 0 ? Math.round((diff / target) * 100) : 0;
  const daysAheadBehind = dailyTarget > 0 ? Math.round((diff / dailyTarget) * 10) / 10 : 0;
  
  return {
    diff,
    percentage,
    daysAheadBehind,
  };
}

// Calculate status and identify biggest shortfall
export function calculateStatus(variances: {
  revenue: { daysAheadBehind: number };
  sales: { daysAheadBehind: number };
  attended: { daysAheadBehind: number };
  bookings: { daysAheadBehind: number };
  calls: { daysAheadBehind: number };
}) {
  const metrics = [
    { name: 'revenue', value: variances.revenue.daysAheadBehind },
    { name: 'sales', value: variances.sales.daysAheadBehind },
    { name: 'attended', value: variances.attended.daysAheadBehind },
    { name: 'bookings', value: variances.bookings.daysAheadBehind },
    { name: 'calls', value: variances.calls.daysAheadBehind },
  ];

  const hasUnderperforming = metrics.some(function(m) { return m.value < -0.5; });
  const allPositive = metrics.every(function(m) { return m.value >= 0; });
  
  const biggestShortfall = metrics.reduce(function(worst, current) {
    return current.value < worst.value ? current : worst;
  });

  let status: 'Underperforming' | 'On Standard' | 'Overperforming';
  
  if (hasUnderperforming) {
    status = 'Underperforming';
  } else if (allPositive) {
    status = 'Overperforming';
  } else {
    status = 'On Standard';
  }

  return {
    status,
    biggestShortfall: biggestShortfall.name as 'revenue' | 'sales' | 'attended' | 'bookings' | 'calls',
    biggestShortfallDays: biggestShortfall.value,
  };
}

// Check if team member is new (started this month)
export function isNewMember(startDate: string): boolean {
  const start = new Date(startDate);
  const now = new Date();
  return start.getFullYear() === now.getFullYear() && 
         start.getMonth() === now.getMonth() &&
         start.getDate() > 1;
}

// Get all dashboard data
export async function getDashboardData() {
  try {
    const config = await getConfig();
    const monthDays = getMonthWorkingDays(config.holidays);
    const weekDays = getWeekWorkingDays(config.holidays);
    
    const now = new Date();
    const monthName = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    
    const memberData: any[] = [];
    const newMembers: any[] = [];

    for (const member of config.teamMembers) {
      const rows = await getSheetData(member.name);
      const data = parseTeamMemberData(rows);
      
      const memberStart = new Date(member.startDate);
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const effectiveStart = memberStart > periodStart ? memberStart : periodStart;
      
      const memberWorkingDays = getWorkingDays(effectiveStart, now, config.holidays);
      
      const mtdTargets = {
        revenue: config.targets.revenue * memberWorkingDays,
        sales: config.targets.sales * memberWorkingDays,
        attended: config.targets.attended * memberWorkingDays,
        bookings: config.targets.bookings * memberWorkingDays,
        calls: config.targets.calls * memberWorkingDays,
      };
      
      const revenueVar = calculateVariance(data.revenue, mtdTargets.revenue, config.targets.revenue);
      const salesVar = calculateVariance(data.sales, mtdTargets.sales, config.targets.sales);
      const attendedVar = calculateVariance(data.attended, mtdTargets.attended, config.targets.attended);
      const bookingsVar = calculateVariance(data.bookings, mtdTargets.bookings, config.targets.bookings);
      const callsVar = calculateVariance(data.calls, mtdTargets.calls, config.targets.calls);
      
      const progress = Math.round((
        (data.revenue / mtdTargets.revenue || 0) +
        (data.sales / mtdTargets.sales || 0) +
        (data.attended / mtdTargets.attended || 0) +
        (data.bookings / mtdTargets.bookings || 0) +
        (data.calls / mtdTargets.calls || 0)
      ) / 5 * 100);
      
      const statusInfo = calculateStatus({
        revenue: revenueVar,
        sales: salesVar,
        attended: attendedVar,
        bookings: bookingsVar,
        calls: callsVar,
      });
      
      const memberInfo = {
        name: member.name,
        startDate: member.startDate,
        isNew: isNewMember(member.startDate),
        workingDays: memberWorkingDays,
        data,
        mtdTargets,
        variances: {
          revenue: revenueVar,
          sales: salesVar,
          attended: attendedVar,
          bookings: bookingsVar,
          calls: callsVar,
        },
        progress,
        status: statusInfo.status,
        biggestShortfall: statusInfo.biggestShortfall,
        biggestShortfallDays: statusInfo.biggestShortfallDays,
      };
      
      if (memberInfo.isNew) {
        newMembers.push(memberInfo);
      } else {
        memberData.push(memberInfo);
      }
    }

    memberData.sort(function(a, b) { return b.data.revenue - a.data.revenue; });
    newMembers.sort(function(a, b) { return b.data.revenue - a.data.revenue; });
    
    const allMembers = [...memberData, ...newMembers];
    const teamTotals = {
      revenue: allMembers.reduce(function(sum, m) { return sum + m.data.revenue; }, 0),
      sales: allMembers.reduce(function(sum, m) { return sum + m.data.sales; }, 0),
      attended: allMembers.reduce(function(sum, m) { return sum + m.data.attended; }, 0),
      bookings: allMembers.reduce(function(sum, m) { return sum + m.data.bookings; }, 0),
      calls: allMembers.reduce(function(sum, m) { return sum + m.data.calls; }, 0),
    };
    
    const teamMTDTargets = {
      revenue: config.targets.revenue * monthDays.used * config.teamSize,
      sales: config.targets.sales * monthDays.used * config.teamSize,
      attended: config.targets.attended * monthDays.used * config.teamSize,
      bookings: config.targets.bookings * monthDays.used * config.teamSize,
      calls: config.targets.calls * monthDays.used * config.teamSize,
    };
    
    // Team daily targets = individual target × team size
    const teamDailyTargets = {
      revenue: config.targets.revenue * config.teamSize,
      sales: config.targets.sales * config.teamSize,
      attended: config.targets.attended * config.teamSize,
      bookings: config.targets.bookings * config.teamSize,
      calls: config.targets.calls * config.teamSize,
    };
    
    const teamVariances = {
      revenue: calculateVariance(teamTotals.revenue, teamMTDTargets.revenue, teamDailyTargets.revenue),
      sales: calculateVariance(teamTotals.sales, teamMTDTargets.sales, teamDailyTargets.sales),
      attended: calculateVariance(teamTotals.attended, teamMTDTargets.attended, teamDailyTargets.attended),
      bookings: calculateVariance(teamTotals.bookings, teamMTDTargets.bookings, teamDailyTargets.bookings),
      calls: calculateVariance(teamTotals.calls, teamMTDTargets.calls, teamDailyTargets.calls),
    };

    return {
      monthName,
      year,
      workingDays: monthDays,
      weekWorkingDays: weekDays,
      config,
      teamTotals,
      teamMTDTargets,
      teamVariances,
      memberData,
      newMembers,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

// Individual team member detail (for detail pages)
export async function getTeamMemberDetail(memberName: string) {
  try {
    const config = await getConfig();
    const member = config.teamMembers.find(function(m) { return m.name === memberName; });
    
    if (!member) {
      throw new Error('Team member ' + memberName + ' not found in config');
    }
    
    const rows = await getSheetData(memberName);
    const data = parseTeamMemberData(rows);
    
    return {
      name: memberName,
      startDate: member.startDate,
      data,
      config,
    };
  } catch (error) {
    console.error('Error fetching data for ' + memberName + ':', error);
    throw error;
  }
}
