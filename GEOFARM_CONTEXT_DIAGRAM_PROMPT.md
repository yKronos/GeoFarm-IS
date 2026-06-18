# GeoFarm-IS Context Diagram - Original Design Prompt

## Send This to Gemini:

```
Create a professional Context Diagram (Level 0 DFD) for GeoFarm-IS with this structure:

**Title:** Context Diagram

**LAYOUT:**
4 external entities (rectangles) positioned around a central system (rounded rectangle)
Use the same structure as standard thesis context diagrams, but create an original design for GeoFarm-IS

**POSITION 1 - TOP LEFT (Rectangle):**
Agriculture Office Staff
(Data Encoder role)

**POSITION 2 - TOP RIGHT (Rectangle):**
Farmers

**POSITION 3 - BOTTOM LEFT (Rectangle):**
Municipal Agriculturist

**POSITION 4 - BOTTOM RIGHT (Rectangle):**
IT Administrator
(Super Admin)

**CENTER (Large Rounded Rectangle with "0" label at top):**
GeoFarm-IS: Geographic Farm
Information System

---

**DATA FLOWS WITH CURVED ARROWS:**

**From Agriculture Office Staff TO System:**
- Login
- Farmer Registration Data
- Farm Parcel Details
- Crop Production Records
- Livestock Inventory
- Assistance Distribution

**From System TO Agriculture Office Staff:**
- System Response and Task Confirmation
- Generated Reports
- QR Code Generated IDs

**From Farmers TO System:**
- Login
- Profile Updates
- Assistance Requests

**From System TO Farmers:**
- QR-Coded ID Card
- Assistance Notifications
- Risk Alerts (Palugi Warnings)

**From Municipal Agriculturist TO System:**
- Login
- GIS Map Queries
- Risk Dashboard Filters
- Report Generation Requests

**From System TO Municipal Agriculturist:**
- Interactive GIS Maps
- Predictive Risk Summaries
- Downloadable Reports
- Agricultural Statistics

**From IT Administrator TO System:**
- Login
- User Account Management
- Role Assignments
- System Configuration

**From System TO IT Administrator:**
- Account Confirmation
- Audit Logs
- System Activity Reports

---

**DESIGN SPECIFICATIONS:**

1. **External Entities (4 rectangles):**
   - Simple black rectangles
   - White background
   - Black bold text inside
   - Evenly spaced around center

2. **Central System (rounded rectangle):**
   - Larger than external entities
   - Small "0" label at the very top center
   - System name in 3 lines:
     * "GeoFarm-IS: Geographic Farm"
     * "Information System"
   - Black border, white background

3. **Arrows:**
   - Curved lines (not straight)
   - Black color
   - Arrow heads pointing to destination
   - Multiple arrows between each entity and center

4. **Arrow Labels:**
   - Small text above or beside each arrow
   - Clear and readable
   - Aligned with arrow direction

5. **Overall Style:**
   - Black and white only
   - Professional thesis quality
   - Clean and uncluttered
   - Fits A4 landscape paper
   - Similar structure to standard DFD notation

6. **Spacing:**
   - Adequate white space
   - Arrows don't overlap
   - Labels are readable
   - Balanced composition

Generate a high-resolution diagram image suitable for a computer science thesis.

**IMPORTANT:** Create an original design for GeoFarm-IS, don't copy existing diagrams. Use the structure described above.
```

---

## Visual Reference (Structure Only):

```
┌─────────────────────┐         ┌─────────────────────┐
│  Agriculture        │         │                     │
│  Office Staff       │         │      Farmers        │
└──────────┬──────────┘         └──────────┬──────────┘
           │ ↓ ↑                           │ ↓ ↑
           │ Multiple                      │ Multiple
           │ curved                        │ curved
           │ arrows                        │ arrows
           │ with                          │ with
           │ labels                        │ labels
           ↓                               ↓
    ┌──────────────────────────────────────────┐
    │                   0                      │
    │                                          │
    │      GeoFarm-IS: Geographic Farm         │
    │         Information System               │
    │                                          │
    └──────────────────┬───────────────────────┘
                       ↑
           ↑ ↓         │         ↑ ↓
           │           │           │
           │           │           │
┌──────────┴───────────┐         ┌┴──────────────────┐
│   Municipal          │         │  IT Administrator │
│   Agriculturist      │         │   (Super Admin)   │
└──────────────────────┘         └───────────────────┘
```

---

## Expected Output:

A professional context diagram showing:
- GeoFarm-IS at the center as the main system
- 4 user roles around it
- Clear data flows showing inputs and outputs
- Professional appearance suitable for thesis Chapter 3
- Black and white, high contrast, readable labels

This represents the system boundaries and external interactions of the GeoFarm-IS agricultural management system.
```

---

This prompt creates an original GeoFarm-IS context diagram using the same professional structure but with your specific system's entities and data flows!