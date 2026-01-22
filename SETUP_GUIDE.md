# Sales Dashboard - Setup & Deployment Guide

## Overview
This dashboard tracks daily sales team performance across 5 key metrics:
- Sales Revenue
- Sales Units
- Meetings Attended
- Bookings Made
- Calls Connected

## Quick Start

### 1. Google Sheets Setup

Your spreadsheet structure should have the following sheets:

#### Sheet 1: "Team Member 1" (repeat for each team member)
```
| Date       | Sales Revenue | Sales Units | Meetings Attended | Bookings Made | Calls Connected |
|------------|---------------|-------------|-------------------|---------------|-----------------|
| 2026-01-20 |     500       |      1      |         2         |       4       |       40        |
| 2026-01-21 |     600       |      2      |         3         |       5       |       45        |
```

**Column Headers (Row 1):**
- A1: Date
- B1: Sales Revenue
- C1: Sales Units
- D1: Meetings Attended
- E1: Bookings Made
- F1: Calls Connected

**Daily Targets:**
- Sales Revenue: $500/day
- Sales Units: 1/day
- Meetings Attended: 2/day
- Bookings Made: 4/day
- Calls Connected: 40/day

#### Sheet 2: "Summary" (auto-calculated)
This sheet will aggregate all team member data and calculate:
- Team totals
- Individual progress percentages
- Performance rankings

### 2. Setting Up Your Google Sheet

I've created a template structure for you. Here's what you need to do:

1. **Create 3 sheets** in your Google Spreadsheet:
   - "Team Member 1"
   - "Team Member 2"
   - "Team Member 3"

2. **In each team member sheet**, add these columns:
   ```
   A: Date
   B: Sales Revenue
   C: Sales Units
   D: Meetings Attended
   E: Bookings Made
   F: Calls Connected
   ```

3. **Daily Data Entry Process:**
   - Each team member enters their numbers at the end of each day
   - One row per day
   - Format dates as YYYY-MM-DD (e.g., 2026-01-22)

4. **Sample Entry:**
   ```
   2026-01-22 | 450 | 1 | 2 | 3 | 38
   ```

### 3. Google Sheets API Setup

To connect the dashboard to your Google Sheet:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the Google Sheets API
4. Create credentials (Service Account)
5. Download the JSON key file
6. Share your Google Sheet with the service account email
7. Add the credentials to your environment variables

### 4. Deploy to Vercel

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables (Google Sheets credentials)
   - Click "Deploy"

3. **Environment Variables to Add:**
   ```
   GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY=your_private_key
   ```

### 5. Local Development

To run locally:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

## Google Sheets Template Structure

### Team Member Sheet Example:

| Date       | Sales Revenue | Sales Units | Meetings Attended | Bookings Made | Calls Connected |
|------------|---------------|-------------|-------------------|---------------|-----------------|
| 2026-01-20 |     500       |      1      |         2         |       4       |       40        |
| 2026-01-21 |     450       |      1      |         3         |       5       |       42        |
| 2026-01-22 |     600       |      2      |         2         |       6       |       45        |
| 2026-01-23 |     550       |      1      |         2         |       4       |       38        |
| 2026-01-24 |     700       |      2      |         3         |       5       |       50        |
| **WEEK TOTAL** | **2800** | **7** | **12** | **24** | **215** |

Weekly Targets:
- Sales Revenue: $2,500
- Sales Units: 5
- Meetings Attended: 10
- Bookings Made: 20
- Calls Connected: 200

## Dashboard Features

1. **Real-time Metrics:** Top cards show team totals vs targets
2. **Performance Rankings:** Table ranks team members by overall performance
3. **Progress Tracking:** Visual progress bars for each metric
4. **Standards Comparison:** Shows team achievement vs weekly standards
5. **Daily Checklist:** Reminds team of daily targets

## Training Flag System

The dashboard automatically flags team members who need additional training:

- **Red Flag:** Consistently below 70% of target (3+ days in a week)
- **Yellow Flag:** Between 70-90% of target
- **Green:** Above 90% of target

## Performance Calculation

Overall progress percentage is calculated as:
```
(Revenue % + Sales % + Attended % + Bookings % + Calls %) / 5
```

Where each metric % = (Actual / Target) * 100

## Maintenance

- **Data Entry:** Team members enter data daily before end of business
- **Review:** Review dashboard weekly for performance trends
- **Training:** Flag team members consistently below targets for additional support
- **Targets:** Adjust weekly/daily targets as needed based on business goals

## Support

For issues or questions, contact your development team or refer to:
- Next.js Documentation: https://nextjs.org/docs
- Google Sheets API: https://developers.google.com/sheets/api
- Vercel Deployment: https://vercel.com/docs
