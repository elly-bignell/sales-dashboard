# Sales Team Dashboard

A modern, real-time sales performance tracking dashboard for marketing agencies. Track individual and team performance across key sales metrics with automated insights and training recommendations.

## Features

- 📊 **Real-time Performance Tracking** - Monitor sales revenue, units, meetings, bookings, and calls
- 🏆 **Automated Rankings** - Team members ranked by overall performance
- 📈 **Visual Progress Indicators** - Easy-to-understand progress bars and metrics
- 🎯 **Target vs Achievement** - Compare actual performance against weekly standards
- ⚠️ **Training Flags** - Automatic alerts when team members need additional support
- 📱 **Mobile Responsive** - Works on all devices
- ☁️ **Cloud-Based** - Access from anywhere, data syncs automatically

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript
- **Styling:** Tailwind CSS
- **Data Source:** Google Sheets API
- **Deployment:** Vercel
- **Charts:** Recharts

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Cloud Project with Sheets API enabled
- Google Sheet for data storage
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd sales-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- `GOOGLE_SHEETS_SPREADSHEET_ID` - Your Google Sheet ID
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service account email
- `GOOGLE_PRIVATE_KEY` - Private key from service account JSON

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Google Sheets Setup

See [GOOGLE_SHEETS_TEMPLATE.md](./GOOGLE_SHEETS_TEMPLATE.md) for detailed instructions on setting up your Google Sheet.

**Quick Structure:**
- One sheet per team member
- Columns: Date, Sales Revenue, Sales Units, Meetings Attended, Bookings Made, Calls Connected
- One row per day
- Optional Summary sheet for aggregated data

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

## Daily Workflow

1. **Team members** enter their daily numbers in their Google Sheet at end of day
2. **Dashboard** automatically updates every 5 minutes
3. **Managers** review performance and identify training needs
4. **System** flags team members consistently below targets

## Performance Metrics

### Daily Targets (Per Person)
- Sales Revenue: $500
- Sales Units: 1
- Meetings Attended: 2
- Bookings Made: 4
- Calls Connected: 40

### Weekly Targets (Per Person)
- Sales Revenue: $2,500
- Sales Units: 5
- Meetings Attended: 10
- Bookings Made: 20
- Calls Connected: 200

### Team Weekly Targets (3 Members)
- Sales Revenue: $7,500
- Sales Units: 15
- Meetings Attended: 30
- Bookings Made: 60
- Calls Connected: 600

## Training Flag System

- 🟢 **Green (90%+):** Exceeding expectations
- 🟡 **Yellow (70-89%):** Needs monitoring
- 🔴 **Red (<70%):** Requires training intervention

## Project Structure

```
sales-dashboard/
├── app/
│   ├── api/
│   │   └── dashboard/
│   │       └── route.ts       # API endpoint for dashboard data
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main dashboard page
├── components/
│   ├── MetricCard.tsx         # Metric display cards
│   ├── PerformanceTable.tsx   # Team rankings table
│   ├── StandardsComparison.tsx # Target vs actual comparison
│   └── DailyChecklist.tsx     # Daily target reminder
├── lib/
│   └── googleSheets.ts        # Google Sheets API integration
├── GOOGLE_SHEETS_TEMPLATE.md  # Sheet setup guide
├── SETUP_GUIDE.md             # Deployment guide
└── README.md                  # This file
```

## Customization

### Adjusting Targets

Edit the target values in:
- `components/MetricCard.tsx` - Top metric cards
- `components/StandardsComparison.tsx` - Standards comparison
- `components/DailyChecklist.tsx` - Daily checklist

### Adding Team Members

1. Add new sheet in Google Sheets
2. Update API route to include new member
3. Dashboard will automatically display them

### Changing Colors

Edit color scheme in:
- `tailwind.config.js` - Tailwind configuration
- `app/globals.css` - CSS custom properties

## Troubleshooting

**Dashboard not showing data:**
- Check Google Sheets API credentials
- Verify spreadsheet is shared with service account
- Check browser console for errors

**Data not updating:**
- Verify team members are entering data in correct format
- Check date format (YYYY-MM-DD)
- Ensure numeric fields contain only numbers

**Deployment issues:**
- Verify all environment variables are set in Vercel
- Check build logs for errors
- Ensure Node.js version compatibility

## Support

For issues or questions:
1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Check [GOOGLE_SHEETS_TEMPLATE.md](./GOOGLE_SHEETS_TEMPLATE.md)
3. Review error logs
4. Contact your development team

## License

Private - Internal Use Only

## Version

1.0.0 - Initial Release
