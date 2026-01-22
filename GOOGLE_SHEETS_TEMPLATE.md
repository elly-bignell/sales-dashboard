# Google Sheets Template for Sales Dashboard

## How to Set Up Your Spreadsheet

### Step 1: Create Individual Team Member Sheets

For each of your 3 team members, create a sheet with this exact structure:

**Sheet Name:** "Team Member 1" (or use actual names like "John Smith")

**Column Headers (Row 1):**
| A | B | C | D | E | F |
|---|---|---|---|---|---|
| Date | Sales Revenue | Sales Units | Meetings Attended | Bookings Made | Calls Connected |

**Example Data (Starting Row 2):**
| Date | Sales Revenue | Sales Units | Meetings Attended | Bookings Made | Calls Connected |
|------|---------------|-------------|-------------------|---------------|-----------------|
| 2026-01-20 | 500 | 1 | 2 | 4 | 40 |
| 2026-01-21 | 450 | 1 | 3 | 5 | 42 |
| 2026-01-22 | 600 | 2 | 2 | 6 | 45 |
| 2026-01-23 | 550 | 1 | 2 | 4 | 38 |
| 2026-01-24 | 700 | 2 | 3 | 5 | 50 |

**Important Notes:**
- Team members fill in ONE ROW per day
- Date format: YYYY-MM-DD (e.g., 2026-01-22)
- Sales Revenue: Enter as number without $ (e.g., 500, not $500)
- All other fields: Enter as whole numbers

### Step 2: Create Summary Sheet (Optional but Recommended)

**Sheet Name:** "Summary"

This sheet aggregates data from all team members. Use these formulas:

**Row 1 Headers:**
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Team Member | Sales Revenue | Sales Units | Meetings Attended | Bookings Made | Calls Connected | Progress % |

**Example formulas for Team Member 1 (Row 2):**
- A2: `Team Member 1`
- B2: `=SUM('Team Member 1'!B:B)` (Total revenue)
- C2: `=SUM('Team Member 1'!C:C)` (Total sales)
- D2: `=SUM('Team Member 1'!D:D)` (Total attended)
- E2: `=SUM('Team Member 1'!E:E)` (Total bookings)
- F2: `=SUM('Team Member 1'!F:F)` (Total calls)
- G2: `=((B2/2500)+(C2/5)+(D2/10)+(E2/20)+(F2/200))/5*100` (Progress %)

Repeat for Team Member 2 (Row 3) and Team Member 3 (Row 4).

**Team Totals (Row 5):**
- A5: `TEAM TOTAL`
- B5: `=SUM(B2:B4)`
- C5: `=SUM(C2:C4)`
- D5: `=SUM(D2:D4)`
- E5: `=SUM(E2:E4)`
- F5: `=SUM(F2:F4)`
- G5: `=AVERAGE(G2:G4)`

### Step 3: Weekly Targets Reference

Add a "Targets" sheet for reference:

**Individual Daily Targets:**
- Sales Revenue: $500
- Sales Units: 1
- Meetings Attended: 2
- Bookings Made: 4
- Calls Connected: 40

**Individual Weekly Targets (5 work days):**
- Sales Revenue: $2,500
- Sales Units: 5
- Meetings Attended: 10
- Bookings Made: 20
- Calls Connected: 200

**Team Weekly Targets (3 members x 5 days):**
- Sales Revenue: $7,500
- Sales Units: 15
- Meetings Attended: 30
- Bookings Made: 60
- Calls Connected: 600

### Step 4: Daily Data Entry Instructions for Team

**For Team Members:**
1. Open your assigned sheet (e.g., "Team Member 1")
2. Find the row for today's date (or add a new row)
3. Fill in your numbers for the day:
   - Sales Revenue: Total $ amount of sales made today
   - Sales Units: Number of sales closed today
   - Meetings Attended: Number of meetings you attended
   - Bookings Made: Number of future appointments booked
   - Calls Connected: Number of calls where you spoke with a prospect

4. **Double-check your numbers** before closing
5. Dashboard will update automatically

**Example Entry for January 22, 2026:**
```
2026-01-22 | 550 | 1 | 2 | 5 | 42
```

### Step 5: Data Validation (Optional)

To prevent errors, you can add data validation:

**For Sales Revenue (Column B):**
- Data > Data validation
- Criteria: Number > Greater than 0
- Reject input if invalid

**For all numeric columns (C, D, E, F):**
- Data > Data validation
- Criteria: Number > Greater than or equal to 0
- Reject input if invalid

**For Date column (A):**
- Data > Data validation
- Criteria: Date > Is valid date
- Reject input if invalid

### Quick Setup Checklist

- [ ] Create "Team Member 1" sheet with column headers
- [ ] Create "Team Member 2" sheet with column headers
- [ ] Create "Team Member 3" sheet with column headers
- [ ] Create "Summary" sheet with formulas
- [ ] Create "Targets" reference sheet
- [ ] Add sample data to test formulas
- [ ] Share sheet with team members
- [ ] Set up Google Sheets API access
- [ ] Connect to web dashboard

### Sharing the Spreadsheet

**For team members to enter data:**
1. Click "Share" button (top right)
2. Add each team member's email
3. Set permission to "Editor"
4. Send invitation

**For the dashboard (API access):**
1. Share with service account email
2. Set permission to "Viewer"
3. Copy spreadsheet ID from URL

Your spreadsheet ID is in the URL:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
```

Save this ID - you'll need it for the dashboard configuration!
