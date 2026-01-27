// Australian Public Holidays for 2026
// National holidays apply nationwide
// State-based holidays are specific to their respective states

export interface Holiday {
    date: string; // YYYY-MM-DD format
  name: string;
    type: 'National' | 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
}

export const australianHolidays2026: Holiday[] = [
    // NATIONAL HOLIDAYS
  { date: '2026-01-01', name: 'New Year\'s Day', type: 'National' },
  { date: '2026-01-26', name: 'Australia Day', type: 'National' },
  { date: '2026-04-10', name: 'Good Friday', type: 'National' },
  { date: '2026-04-11', name: 'Easter Saturday', type: 'National' },
  { date: '2026-04-13', name: 'Easter Monday', type: 'National' },
  { date: '2026-04-25', name: 'ANZAC Day', type: 'National' },
  { date: '2026-06-15', name: 'Queen\'s Birthday (most states)', type: 'National' },
  { date: '2026-12-25', name: 'Christmas Day', type: 'National' },
  { date: '2026-12-26', name: 'Boxing Day', type: 'National' },

    // NSW SPECIFIC
  { date: '2026-04-12', name: 'Easter Sunday', type: 'NSW' },
  { date: '2026-05-11', name: 'Bank Holiday (NSW)', type: 'NSW' },

    // VIC SPECIFIC
  { date: '2026-03-09', name: 'Labour Day (VIC)', type: 'VIC' },
  { date: '2026-11-03', name: 'Melbourne Cup Day', type: 'VIC' },

    // QLD SPECIFIC
  { date: '2026-05-04', name: 'Labour Day (QLD)', type: 'QLD' },
  { date: '2026-08-10', name: 'Ekka (Brisbane)', type: 'QLD' },

    // WA SPECIFIC
  { date: '2026-03-02', name: 'Labour Day (WA)', type: 'WA' },
  { date: '2026-06-01', name: 'Western Australia Day', type: 'WA' },

    // SA SPECIFIC
  { date: '2026-03-09', name: 'Adelaide Cup (SA)', type: 'SA' },
  { date: '2026-10-12', name: 'Labour Day (SA)', type: 'SA' },

    // TAS SPECIFIC
  { date: '2026-02-09', name: 'Launceston Cup (TAS)', type: 'TAS' },
  { date: '2026-05-11', name: 'Autumn Bank Holiday (TAS)', type: 'TAS' },

    // ACT SPECIFIC
  { date: '2026-03-09', name: 'Canberra Day', type: 'ACT' },

    // NT SPECIFIC
  { date: '2026-05-25', name: 'Reconciliation Day (NT)', type: 'NT' },
  ];

export function getHolidaysByMonth(month: number, year: number): Holiday[] {
    return australianHolidays2026.filter((holiday) => {
          const [h_year, h_month] = holiday.date.split('-').map(Number);
          return h_year === year && h_month === month;
    });
}

export function isPublicHoliday(date: Date): boolean {
    const dateString = date.toISOString().split('T')[0];
    return australianHolidays2026.some((holiday) => holiday.date === dateString);
}
