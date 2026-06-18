# Context Diagram Prompt (Based on Example Style)

## Send This Prompt to Gemini:

```
Create a Context Diagram (Level 0 DFD) for my thesis that looks exactly like this professional style:

**Title:** Context Diagram

**System Name (Center):** 
GeoFarm-IS: Geographic Farm Information System
(Large rounded rectangle in the center with "0" label at top)

**Layout:** 
- 4 External entities positioned around the center (TOP, RIGHT, BOTTOM, LEFT)
- All external entities are RECTANGLES (squares)
- Center system is a ROUNDED RECTANGLE
- Curved arrows with labels showing data flows
- Clean, professional black and white design

**External Entities (4 squares around center):**

**TOP LEFT - Agriculture Office Staff**
(Rectangle positioned top-left)

**TOP RIGHT - Farmers**
(Rectangle positioned top-right)

**BOTTOM LEFT - Municipal Agriculturist**
(Rectangle positioned bottom-left)

**BOTTOM RIGHT - IT Administrator**
(Rectangle positioned bottom-right)

**CENTER - System:**
"0" (small label at top)
"GeoFarm-IS: Geographic Farm Information System"
(Large rounded rectangle)

**Data Flows:**

FROM Agriculture Office Staff TO System:
- Login
- Farmer Registration Data
- Farm Parcel Details  
- Crop Production Records
- Livestock Inventory
- Assistance Distribution Records

FROM System TO Agriculture Office Staff:
- System Response and Task Confirmation
- Generated Reports and Data Entry Confirmation
- QR Code Generated IDs

FROM Farmers TO System:
- Login
- Farmer Profile Updates
- Assistance Requests

FROM System TO Farmers:
- System Response and Service Acknowledgment
- QR-Coded ID Card
- Assistance Status Notifications
- Risk Alerts

FROM Municipal Agriculturist TO System:
- Login
- GIS Map Queries
- Risk Dashboard Filters
- Report Generation Requests

FROM System TO Municipal Agriculturist:
- Interactive GIS Maps
- Predictive Risk Summaries (Palugi Alerts)
- Downloadable Reports (PDF/Excel)
- Agricultural Statistics

FROM IT Administrator TO System:
- Login
- User Account Management
- Role Assignments
- System Configuration Settings

FROM System TO IT Administrator:
- Account Creation Confirmation
- Audit Logs
- System Activity Reports
- User Management Interface

**Design Requirements:**
1. Use curved arrows (not straight lines) for all data flows
2. Label each arrow clearly with the data/action name
3. Group related flows together visually
4. Keep it clean, professional, and suitable for a thesis
5. Black and white only (no colors)
6. Make it fit on A4 landscape paper
7. Use proper spacing - don't overcrowd
8. External entities should be evenly distributed around the center

**Style Reference:**
Make it look EXACTLY like a professional thesis context diagram with:
- Clean lines
- Readable labels
- Balanced layout
- Professional appearance

Generate this as a detailed description that can be drawn in Microsoft Visio, Draw.io, or Lucidchart.

If you can generate Mermaid code or Draw.io XML, please provide that as well.
```

---

## How to Draw This Manually:

**Using Draw.io (diagrams.net):**

1. Go to https://app.diagrams.net/
2. Create new diagram → Blank
3. From left sidebar, drag:
   - **Rectangle** for external entities (4 boxes)
   - **Rounded Rectangle** for center system
   - **Text** to add labels
   - **Arrow** for data flows (curved)

4. **Layout:**
   ```
   [Agri Staff]           [Farmers]
          \                  /
           \                /
            [GeoFarm-IS: 0]
           /                \
          /                  \
   [Agriculturist]      [IT Admin]
   ```

5. **For curved arrows:**
   - Select connector line
   - Right-click → Edit Style
   - Change `curved=1`

6. **Add arrow labels:**
   - Double-click on arrow
   - Type the data flow description

7. **Export:**
   - File → Export As → PNG
   - Choose resolution: 300 DPI
   - Save and insert into thesis

---

## Alternative: Simple Prompt for Draw.io AI

If Draw.io has AI diagram generation:

```
Create a context diagram with:
- Center: rounded rectangle "GeoFarm-IS: Geographic Farm Information System" with "0" label
- Top-left: rectangle "Agriculture Office Staff"  
- Top-right: rectangle "Farmers"
- Bottom-left: rectangle "Municipal Agriculturist"
- Bottom-right: rectangle "IT Administrator"
- Curved arrows from each entity to center and back
- Label arrows with: Login, Data Entry, Reports, QR Codes, GIS Maps, Risk Alerts, User Management, Audit Logs
- Professional thesis style, black and white
```

---

## Quick Template Structure:

```
       [Agriculture Staff] ←→ [Farmers]
              ↓ ↑                ↓ ↑
              ↓ ↑                ↓ ↑
         ┌────────────────────────┐
         │    GeoFarm-IS: 0       │
         │  Geographic Farm Info  │
         │  Management System     │
         └────────────────────────┘
              ↑ ↓                ↑ ↓
              ↑ ↓                ↑ ↓
       [Agriculturist] ←→ [IT Administrator]
```

This gives you the basic structure to follow when creating the diagram!
