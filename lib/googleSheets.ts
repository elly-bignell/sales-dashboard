import { google } from 'googleapis';

// Display name mapping - keeps sheet names stable, shows real names in UI
const DISPLAY_NAMES: Record<string, string> = {
  "Team Member 1": "FG & LT",
  "Team Member 2": "Dylan Munro",
  "Team Member 3": "Thomas Rennie",
};

export function getDisplayName(personKey: string): string {
  return DISPLAY_NAMES[personKey] || personKey;
}

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
      holidays: rows[9]?.[1]?.split(',').map(function(d: string) { return d.trim(); }) || [],
      teamMembers: [] as { name: string; startDate: string; displayName: string }[],
    };

    for (let i = 12; i < rows.length && rows[i]?.[0]; i++) {
      if (rows[i][0].startsWith('Team Member') && rows[i][1]) {
        config.teamMembers.push({
          name: rows[i][0],
          startDate: rows[i][1],
          displayName: getDisplayName(rows[i][0]),
        });
      }
    }

    return config;
  } catch (error) {
    console.error('Error reading config:', error);
    return {
      teamSize: 3,
      targets: { revenue: 500, sales: 1, attended: 2, bookings: 4, calls: 40 },
      holidays: ['2026-01-01', '2026-01-26', '2026-04-25'],
      teamMembers: [
        { name: 'Team Member 1', startDate: '2026-01-01', displayName: 'FG & LT' },
        { name: 'Team Member 2', startDate: '2026-01-15', displayName: 'Dylan Munro' },
        { name: 'Team Member 3', startDate: '2026-01-20', displayName: 'Thomas Rennie' },
      ],
    };
  }
}

// Get Monday of current week (Australia/Adelaide timezone)
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Calculate working days in a date range
export function getWorkingDays(startDate: Date, endDate: Date, holidays: string[]): number {
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    const dateStr = current.toISOString().split('T')[0];
    
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

// Get working days for current week (Monday to today)
export function getWeekWorkingDays(holidays: string[]) {
  const now = new Date();
  const weekStart = getWeekStart(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  return {
    start: weekStart,
    end: weekEnd,
    total: getWorkingDays(weekStart, weekEnd, holidays),
    used: getWorkingDays(weekStart, today, holidays),
    remaining: getWorkingDays(new Date(today.getTime() + 86400000), weekEnd, holidays),
  };
}

// Get active team members count as of a date
export function getActiveTeamMembers(teamMembers: { startDate: string }[], asAtDate: Date): number {
  return teamMembers.filter(function(m) {
    return new Date(m.startDate) <= asAtDate;
  }).length;
}

// Parse team member data from sheet for a specific date range
export function parseTeamMemberDataForPeriod(rows: any[], startDate: Date, endDate: Date) {
  if (rows.length < 2) {
    return { revenue: 0, sales: 0, attended: 0, bookings: 0, calls: 0, daysWithData: 0 };
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
      const rowDate = new Date(row[0]);
      if (rowDate >= startDate && rowDate <= endDate) {
        totalRevenue += parseFloat(row[1]) || 0;
        totalSales += parseInt(row[2]) || 0;
        totalAttended += parseInt(row[3]) || 0;
        totalBookings += parseInt(row[4]) || 0;
        totalCalls += parseInt(row[5]) || 0;
        daysWithData++;
      }
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
  
  return { diff, percentage, daysAheadBehind };
}

// Calculate status
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

// Get person's working days for a period (respecting their start date)
export function getPersonWorkingDaysForPeriod(
  periodStart: Date,
  periodEnd: Date,
  personStartDate: string,
  holidays: string[]
): number {
  const pStart = new Date(personStartDate);
  const effectiveStart = pStart > periodStart ? pStart : periodStart;
  
  if (effectiveStart > periodEnd) return 0;
  
  return getWorkingDays(effectiveStart, periodEnd, holidays);
}

// Get all dashboard data
export async function getDashboardData() {
  try {
    const config = await getConfig();
    const now = new Date();
    const monthDays = getMonthWorkingDays(config.holidays);
    const weekDays = getWeekWorkingDays(config.holidays);
    
    const monthName = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date();
    
    const activeCount = getActiveTeamMembers(config.teamMembers, today);
    
    const memberData: any[] = [];
    const newMembers: any[] = [];
    
    let teamMTDTotals = { revenue: 0, sales: 0, attended: 0, bookings: 0, calls: 0 };
    let teamMTDTargets = { revenue: 0, sales: 0, attended: 0, bookings: 0, calls: 0 };
    let teamWTDTotals = { revenue: 0, sales: 0, attended: 0, bookings: 0, calls: 0 };
    let teamWTDTargets = { revenue: 0, sales: 0, attended: 0, bookings: 0, calls: 0 };

    for (const member of config.teamMembers) {
      const rows = await getSheetData(member.name);
      
      // MTD data
      const mtdData = parseTeamMemberDataForPeriod(rows, monthStart, today);
      const memberMTDWorkingDays = getPersonWorkingDaysForPeriod(monthStart, today, member.startDate, config.holidays);
      
      const mtdTargets = {
        revenue: config.targets.revenue * memberMTDWorkingDays,
        sales: config.targets.sales * memberMTDWorkingDays,
        attended: config.targets.attended * memberMTDWorkingDays,
        bookings: config.targets.bookings * memberMTDWorkingDays,
        calls: config.targets.calls * memberMTDWorkingDays,
      };
      
      // WTD data
      const wtdData = parseTeamMemberDataForPeriod(rows, weekDays.start, today);
      const memberWTDWorkingDays = getPersonWorkingDaysForPeriod(weekDays.start, today, member.startDate, config.holidays);
      
      const wtdTargets = {
        revenue: config.targets.revenue * memberWTDWorkingDays,
        sales: config.targets.sales * memberWTDWorkingDays,
        attended: config.targets.attended * memberWTDWorkingDays,
        bookings: config.targets.bookings * memberWTDWorkingDays,
        calls: config.targets.calls * memberWTDWorkingDays,
      };
      
      // Add to team totals
      teamMTDTotals.revenue += mtdData.revenue;
      teamMTDTotals.sales += mtdData.sales;
      teamMTDTotals.attended += mtdData.attended;
      teamMTDTotals.bookings += mtdData.bookings;
      teamMTDTotals.calls += mtdData.calls;
      
      teamMTDTargets.revenue += mtdTargets.revenue;
      teamMTDTargets.sales += mtdTargets.sales;
      teamMTDTargets.attended += mtdTargets.attended;
      teamMTDTargets.bookings += mtdTargets.bookings;
      teamMTDTargets.calls += mtdTargets.calls;
      
      teamWTDTotals.revenue += wtdData.revenue;
      teamWTDTotals.sales += wtdData.sales;
      teamWTDTotals.attended += wtdData.attended;
      teamWTDTotals.bookings += wtdData.bookings;
      teamWTDTotals.calls += wtdData.calls;
      
      teamWTDTargets.revenue += wtdTargets.revenue;
      teamWTDTargets.sales += wtdTargets.sales;
      teamWTDTargets.attended += wtdTargets.attended;
      teamWTDTargets.bookings += wtdTargets.bookings;
      teamWTDTargets.calls += wtdTargets.calls;
      
      // Calculate variances for member
      const revenueVar = calculateVariance(mtdData.revenue, mtdTargets.revenue, config.targets.revenue);
      const salesVar = calculateVariance(mtdData.sales, mtdTargets.sales, config.targets.sales);
      const attendedVar = calculateVariance(mtdData.attended, mtdTargets.attended, config.targets.attended);
      const bookingsVar = calculateVariance(mtdData.bookings, mtdTargets.bookings, config.targets.bookings);
      const callsVar = calculateVariance(mtdData.calls, mtdTargets.calls, config.targets.calls);
      
      const progress = mtdTargets.revenue > 0 ? Math.round((
        (mtdData.revenue / mtdTargets.revenue || 0) +
        (mtdData.sales / mtdTargets.sales || 0) +
        (mtdData.attended / mtdTargets.attended || 0) +
        (mtdData.bookings / mtdTargets.bookings || 0) +
        (mtdData.calls / mtdTargets.calls || 0)
      ) / 5 * 100) : 0;
      
      const statusInfo = calculateStatus({
        revenue: revenueVar,
        sales: salesVar,
        attended: attendedVar,
        bookings: bookingsVar,
        calls: callsVar,
      });
      
      const memberInfo = {
        name: member.name,
        displayName: member.displayName,
        startDate: member.startDate,
        isNew: isNewMember(member.startDate),
        workingDays: memberMTDWorkingDays,
        data: mtdData,
        mtdTargets,
        wtdData,
        wtdTargets,
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
    
    // Team daily standards = individual × active team members
    const teamDailyStandards = {
      revenue: config.targets.revenue * activeCount,
      sales: config.targets.sales * activeCount,
      attended: config.targets.attended * activeCount,
      bookings: config.targets.bookings * activeCount,
      calls: config.targets.calls * activeCount,
    };
    
    // Team variances
    const teamMTDVariances = {
      revenue: calculateVariance(teamMTDTotals.revenue, teamMTDTargets.revenue, teamDailyStandards.revenue),
      sales: calculateVariance(teamMTDTotals.sales, teamMTDTargets.sales, teamDailyStandards.sales),
      attended: calculateVariance(teamMTDTotals.attended, teamMTDTargets.attended, teamDailyStandards.attended),
      bookings: calculateVariance(teamMTDTotals.bookings, teamMTDTargets.bookings, teamDailyStandards.bookings),
      calls: calculateVariance(teamMTDTotals.calls, teamMTDTargets.calls, teamDailyStandards.calls),
    };
    
    const teamWTDVariances = {
      revenue: calculateVariance(teamWTDTotals.revenue, teamWTDTargets.revenue, teamDailyStandards.revenue),
      sales: calculateVariance(teamWTDTotals.sales, teamWTDTargets.sales, teamDailyStandards.sales),
      attended: calculateVariance(teamWTDTotals.attended, teamWTDTargets.attended, teamDailyStandards.attended),
      bookings: calculateVariance(teamWTDTotals.bookings, teamWTDTargets.bookings, teamDailyStandards.bookings),
      calls: calculateVariance(teamWTDTotals.calls, teamWTDTargets.calls, teamDailyStandards.calls),
    };

    return {
      monthName,
      year,
      workingDays: monthDays,
      weekWorkingDays: weekDays,
      config,
      activeTeamMembers: activeCount,
      teamDailyStandards,
      teamMTDTotals,
      teamMTDTargets,
      teamMTDVariances,
      teamWTDTotals,
      teamWTDTargets,
      teamWTDVariances,
      memberData,
      newMembers,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

export async function getTeamMemberDetail(memberName: string) {
  try {
    const config = await getConfig();
    const member = config.teamMembers.find(function(m) { return m.name === memberName; });
    
    if (!member) {
      throw new Error('Team member ' + memberName + ' not found in config');
    }
    
    const rows = await getSheetData(memberName);
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const data = parseTeamMemberDataForPeriod(rows, monthStart, now);
    
    return {
      name: memberName,
      displayName: member.displayName,
      startDate: member.startDate,
      data,
      config,
    };
  } catch (error) {
    console.error('Error fetching data for ' + memberName + ':', error);
    throw error;
  }
}
