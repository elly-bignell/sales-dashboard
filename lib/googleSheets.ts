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

// Month name mapping
const MONTH_NAMES: Record<string, number> = {
  'january': 0, 'february': 1, 'march': 2, 'april': 3,
  'may': 4, 'june': 5, 'july': 6, 'august': 7,
  'september': 8, 'october': 9, 'november': 10, 'december': 11,
  'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3,
  'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8,
  'oct': 9, 'nov': 10, 'dec': 11
};

// Parse currency/number strings (handles $, commas, etc.)
function parseNumber(value: any): number {
  if (value === null || value === undefined || value === '') return 0;
  const cleaned = String(value).replace(/[$,]/g, '').trim();
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

function parseInteger(value: any): number {
  if (value === null || value === undefined || value === '') return 0;
  const cleaned = String(value).replace(/[$,]/g, '').trim();
  const parsed = parseInt(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// Parse date from various formats
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  const cleanedDate = dateStr.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+/i, '').trim();
  
  const ddMonthYYYY = cleanedDate.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (ddMonthYYYY) {
    const day = parseInt(ddMonthYYYY[1]);
    const monthName = ddMonthYYYY[2].toLowerCase();
    const year = parseInt(ddMonthYYYY[3]);
    const month = MONTH_NAMES[monthName];
    if (month !== undefined) {
      return new Date(year, month, day);
    }
  }
  
  const ddmmyyyy = cleanedDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmyyyy) {
    const day = parseInt(ddmmyyyy[1]);
    const month = parseInt(ddmmyyyy[2]) - 1;
    const year = parseInt(ddmmyyyy[3]);
    return new Date(year, month, day);
  }
  
  const yyyymmdd_slash = cleanedDate.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (yyyymmdd_slash) {
    const year = parseInt(yyyymmdd_slash[1]);
    const month = parseInt(yyyymmdd_slash[2]) - 1;
    const day = parseInt(yyyymmdd_slash[3]);
    return new Date(year, month, day);
  }
  
  const yyyymmdd_dash = cleanedDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (yyyymmdd_dash) {
    const year = parseInt(yyyymmdd_dash[1]);
    const month = parseInt(yyyymmdd_dash[2]) - 1;
    const day = parseInt(yyyymmdd_dash[3]);
    return new Date(year, month, day);
  }
  
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
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
      teamSize: parseInteger(rows[1]?.[1]) || 3,
      targets: {
        revenue: parseNumber(rows[2]?.[1]) || 500,
        sales: parseInteger(rows[3]?.[1]) || 1,
        attended: parseInteger(rows[4]?.[1]) || 2,
        bookings: parseInteger(rows[5]?.[1]) || 4,
        calls: parseInteger(rows[6]?.[1]) || 40,
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

// Get Monday of current week
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

// Get working days for current week
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
    const startDate = parseDate(m.startDate);
    return startDate && startDate <= asAtDate;
  }).length;
}

// Parse team member data for a specific date range
export function parseTeamMemberDataForPeriod(rows: any[], startDate: Date, endDate: Date) {
  if (rows.length < 2) {
    return { revenue: 0, sales: 0, attended: 0, bookings: 0, calls: 0, daysWithData: 0, dailyData: [] };
  }

  const dataRows = rows.slice(1);
  let totalRevenue = 0;
  let totalSales = 0;
  let totalAttended = 0;
  let totalBookings = 0;
  let totalCalls = 0;
  let daysWithData = 0;
  const dailyData: any[] = [];

  dataRows.forEach(function(row) {
    if (row[0]) {
      const rowDate = parseDate(row[0]);
      if (rowDate && rowDate >= startDate && rowDate <= endDate) {
        const dayData = {
          date: row[0],
          revenue: parseNumber(row[1]),
          sales: parseInteger(row[2]),
          attended: parseInteger(row[3]),
          bookings: parseInteger(row[4]),
          calls: parseInteger(row[5]),
        };
        dailyData.push(dayData);
        totalRevenue += dayData.revenue;
        totalSales += dayData.sales;
        totalAttended += dayData.attended;
        totalBookings += dayData.bookings;
        totalCalls += dayData.calls;
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
    dailyData,
  };
}

// Get all data for a person's sheet
export function parseAllPersonData(rows: any[]) {
  if (rows.length < 2) return [];
  const dataRows = rows.slice(1);
  const allData: any[] = [];

  dataRows.forEach(function(row) {
    if (row[0]) {
      const rowDate = parseDate(row[0]);
      if (rowDate) {
        allData.push({
          date: row[0],
          dateObj: rowDate,
          revenue: parseNumber(row[1]),
          sales: parseInteger(row[2]),
          attended: parseInteger(row[3]),
          bookings: parseInteger(row[4]),
          calls: parseInteger(row[5]),
        });
      }
    }
  });

  return allData;
}

// Calculate personal bests
export function calculatePersonalBests(allData: any[]) {
  if (allData.length === 0) {
    return { bestRevenueWeek: null, bestSalesWeek: null, bestRevenueMonth: null, bestSalesMonth: null };
  }

  const weeklyData: Record<string, { revenue: number; sales: number }> = {};
  const monthlyData: Record<string, { revenue: number; sales: number }> = {};

  allData.forEach(function(day) {
    const date = day.dateObj || parseDate(day.date);
    if (!date) return;
    
    const weekStart = getWeekStart(date);
    const weekKey = weekStart.toISOString().split('T')[0];
    const monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');

    if (!weeklyData[weekKey]) weeklyData[weekKey] = { revenue: 0, sales: 0 };
    weeklyData[weekKey].revenue += day.revenue;
    weeklyData[weekKey].sales += day.sales;

    if (!monthlyData[monthKey]) monthlyData[monthKey] = { revenue: 0, sales: 0 };
    monthlyData[monthKey].revenue += day.revenue;
    monthlyData[monthKey].sales += day.sales;
  });

  let bestRevenueWeek = { week: '', revenue: 0 };
  let bestSalesWeek = { week: '', sales: 0 };
  let bestRevenueMonth = { month: '', revenue: 0 };
  let bestSalesMonth = { month: '', sales: 0 };

  Object.keys(weeklyData).forEach(function(week) {
    if (weeklyData[week].revenue > bestRevenueWeek.revenue) {
      bestRevenueWeek = { week, revenue: weeklyData[week].revenue };
    }
    if (weeklyData[week].sales > bestSalesWeek.sales) {
      bestSalesWeek = { week, sales: weeklyData[week].sales };
    }
  });

  Object.keys(monthlyData).forEach(function(month) {
    if (monthlyData[month].revenue > bestRevenueMonth.revenue) {
      bestRevenueMonth = { month, revenue: monthlyData[month].revenue };
    }
    if (monthlyData[month].sales > bestSalesMonth.sales) {
      bestSalesMonth = { month, sales: monthlyData[month].sales };
    }
  });

  return {
    bestRevenueWeek: bestRevenueWeek.revenue > 0 ? bestRevenueWeek : null,
    bestSalesWeek: bestSalesWeek.sales > 0 ? bestSalesWeek : null,
    bestRevenueMonth: bestRevenueMonth.revenue > 0 ? bestRevenueMonth : null,
    bestSalesMonth: bestSalesMonth.sales > 0 ? bestSalesMonth : null,
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
  const sortedMetrics = metrics.slice().sort(function(a, b) { return a.value - b.value; });
  const biggestShortfall = sortedMetrics[0];

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
    shortfalls: sortedMetrics.filter(function(m) { return m.value < 0; }).slice(0, 3),
  };
}

// Check if team member is new
export function isNewMember(startDate: string): boolean {
  const start = parseDate(startDate);
  if (!start) return false;
  const now = new Date();
  return start.getFullYear() === now.getFullYear() && start.getMonth() === now.getMonth() && start.getDate() > 1;
}

// Get person's working days for a period
export function getPersonWorkingDaysForPeriod(periodStart: Date, periodEnd: Date, personStartDate: string, holidays: string[]): number {
  const pStart = parseDate(personStartDate);
  if (!pStart) return 0;
  const effectiveStart = pStart > periodStart ? pStart : periodStart;
  if (effectiveStart > periodEnd) return 0;
  return getWorkingDays(effectiveStart, periodEnd, holidays);
}

// Calculate days/weeks on board
export function getDaysOnBoard(startDate: string): number {
  const start = parseDate(startDate);
  if (!start) return 0;
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getWeeksOnBoard(startDate: string): number {
  return Math.floor(getDaysOnBoard(startDate) / 7);
}

// Get individual person data
export async function getPersonData(personKey: string) {
  try {
    const config = await getConfig();
    const member = config.teamMembers.find(function(m) { return m.name === personKey; });
    if (!member) throw new Error('Team member ' + personKey + ' not found');

    const rows = await getSheetData(personKey);
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekStart = getWeekStart(now);

    const mtdData = parseTeamMemberDataForPeriod(rows, monthStart, now);
    const mtdWorkingDays = getPersonWorkingDaysForPeriod(monthStart, now, member.startDate, config.holidays);
    const mtdTargets = {
      revenue: config.targets.revenue * mtdWorkingDays,
      sales: config.targets.sales * mtdWorkingDays,
      attended: config.targets.attended * mtdWorkingDays,
      bookings: config.targets.bookings * mtdWorkingDays,
      calls: config.targets.calls * mtdWorkingDays,
    };

    const wtdData = parseTeamMemberDataForPeriod(rows, weekStart, now);
    const wtdWorkingDays = getPersonWorkingDaysForPeriod(weekStart, now, member.startDate, config.holidays);
    const wtdTargets = {
      revenue: config.targets.revenue * wtdWorkingDays,
      sales: config.targets.sales * wtdWorkingDays,
      attended: config.targets.attended * wtdWorkingDays,
      bookings: config.targets.bookings * wtdWorkingDays,
      calls: config.targets.calls * wtdWorkingDays,
    };

    const mtdVariances = {
      revenue: calculateVariance(mtdData.revenue, mtdTargets.revenue, config.targets.revenue),
      sales: calculateVariance(mtdData.sales, mtdTargets.sales, config.targets.sales),
      attended: calculateVariance(mtdData.attended, mtdTargets.attended, config.targets.attended),
      bookings: calculateVariance(mtdData.bookings, mtdTargets.bookings, config.targets.bookings),
      calls: calculateVariance(mtdData.calls, mtdTargets.calls, config.targets.calls),
    };

    const wtdVariances = {
      revenue: calculateVariance(wtdData.revenue, wtdTargets.revenue, config.targets.revenue),
      sales: calculateVariance(wtdData.sales, wtdTargets.sales, config.targets.sales),
      attended: calculateVariance(wtdData.attended, wtdTargets.attended, config.targets.attended),
      bookings: calculateVariance(wtdData.bookings, wtdTargets.bookings, config.targets.bookings),
      calls: calculateVariance(wtdData.calls, wtdTargets.calls, config.targets.calls),
    };

    const mtdStatus = calculateStatus(mtdVariances);
    const wtdStatus = calculateStatus(wtdVariances);
    const allData = parseAllPersonData(rows);
    const personalBests = calculatePersonalBests(allData);

    return {
      personKey,
      displayName: member.displayName,
      startDate: member.startDate,
      daysOnBoard: getDaysOnBoard(member.startDate),
      weeksOnBoard: getWeeksOnBoard(member.startDate),
      isNew: isNewMember(member.startDate),
      dailyTargets: config.targets,
      mtd: { data: mtdData, targets: mtdTargets, variances: mtdVariances, workingDays: mtdWorkingDays, status: mtdStatus.status, shortfalls: mtdStatus.shortfalls },
      wtd: { data: wtdData, targets: wtdTargets, variances: wtdVariances, workingDays: wtdWorkingDays, status: wtdStatus.status, shortfalls: wtdStatus.shortfalls },
      personalBests,
      allDailyData: allData,
    };
  } catch (error) {
    console.error('Error fetching person data:', error);
    throw error;
  }
}

// Get all people for directory
export async function getAllPeopleData() {
  try {
    const config = await getConfig();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const people = [];

    for (const member of config.teamMembers) {
      const rows = await getSheetData(member.name);
      const mtdData = parseTeamMemberDataForPeriod(rows, monthStart, now);
      const mtdWorkingDays = getPersonWorkingDaysForPeriod(monthStart, now, member.startDate, config.holidays);
      const mtdTargets = {
        revenue: config.targets.revenue * mtdWorkingDays,
        sales: config.targets.sales * mtdWorkingDays,
        attended: config.targets.attended * mtdWorkingDays,
        bookings: config.targets.bookings * mtdWorkingDays,
        calls: config.targets.calls * mtdWorkingDays,
      };
      const mtdVariances = {
        revenue: calculateVariance(mtdData.revenue, mtdTargets.revenue, config.targets.revenue),
        sales: calculateVariance(mtdData.sales, mtdTargets.sales, config.targets.sales),
        attended: calculateVariance(mtdData.attended, mtdTargets.attended, config.targets.attended),
        bookings: calculateVariance(mtdData.bookings, mtdTargets.bookings, config.targets.bookings),
        calls: calculateVariance(mtdData.calls, mtdTargets.calls, config.targets.calls),
      };
      const statusInfo = calculateStatus(mtdVariances);

      people.push({
        personKey: member.name,
        displayName: member.displayName,
        startDate: member.startDate,
        weeksOnBoard: getWeeksOnBoard(member.startDate),
        isNew: isNewMember(member.startDate),
        revenueMTD: mtdData.revenue,
        status: statusInfo.status,
        biggestShortfall: statusInfo.biggestShortfall,
        biggestShortfallDays: statusInfo.biggestShortfallDays,
      });
    }
    return people;
  } catch (error) {
    console.error('Error fetching all people data:', error);
    throw error;
  }
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
      const mtdData = parseTeamMemberDataForPeriod(rows, monthStart, today);
      const memberMTDWorkingDays = getPersonWorkingDaysForPeriod(monthStart, today, member.startDate, config.holidays);
      const mtdTargets = {
        revenue: config.targets.revenue * memberMTDWorkingDays,
        sales: config.targets.sales * memberMTDWorkingDays,
        attended: config.targets.attended * memberMTDWorkingDays,
        bookings: config.targets.bookings * memberMTDWorkingDays,
        calls: config.targets.calls * memberMTDWorkingDays,
      };

      const wtdData = parseTeamMemberDataForPeriod(rows, weekDays.start, today);
      const memberWTDWorkingDays = getPersonWorkingDaysForPeriod(weekDays.start, today, member.startDate, config.holidays);
      const wtdTargets = {
        revenue: config.targets.revenue * memberWTDWorkingDays,
        sales: config.targets.sales * memberWTDWorkingDays,
        attended: config.targets.attended * memberWTDWorkingDays,
        bookings: config.targets.bookings * memberWTDWorkingDays,
        calls: config.targets.calls * memberWTDWorkingDays,
      };

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

      const revenueVar = calculateVariance(mtdData.revenue, mtdTargets.revenue, config.targets.revenue);
      const salesVar = calculateVariance(mtdData.sales, mtdTargets.sales, config.targets.sales);
      const attendedVar = calculateVariance(mtdData.attended, mtdTargets.attended, config.targets.attended);
      const bookingsVar = calculateVariance(mtdData.bookings, mtdTargets.bookings, config.targets.bookings);
      const callsVar = calculateVariance(mtdData.calls, mtdTargets.calls, config.targets.calls);

      const progress = mtdTargets.revenue > 0 ? Math.round(((mtdData.revenue / mtdTargets.revenue || 0) + (mtdData.sales / mtdTargets.sales || 0) + (mtdData.attended / mtdTargets.attended || 0) + (mtdData.bookings / mtdTargets.bookings || 0) + (mtdData.calls / mtdTargets.calls || 0)) / 5 * 100) : 0;
      const statusInfo = calculateStatus({ revenue: revenueVar, sales: salesVar, attended: attendedVar, bookings: bookingsVar, calls: callsVar });

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
        variances: { revenue: revenueVar, sales: salesVar, attended: attendedVar, bookings: bookingsVar, calls: callsVar },
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

    const teamDailyStandards = {
      revenue: config.targets.revenue * activeCount,
      sales: config.targets.sales * activeCount,
      attended: config.targets.attended * activeCount,
      bookings: config.targets.bookings * activeCount,
      calls: config.targets.calls * activeCount,
    };

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
  return getPersonData(memberName);
}
