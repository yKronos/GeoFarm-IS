# Level 0 Context Diagram - A4 Size Prompt

## Prompt for Gemini (Compact A4 Layout):

```
Create a Level 0 Context Diagram for a thesis using standard DFD notation that fits on A4 paper in landscape orientation.

**System:** GeoFarm-IS - Agricultural Management System

**Layout Requirements:**
- Use LEFT-RIGHT layout (LR direction) to fit A4 landscape paper
- External entities as SQUARES on the left side
- Central system as CIRCLE in the middle
- Group similar flows to minimize arrows
- Keep labels SHORT and readable

**External Entities (6 actors):**

LEFT SIDE (Squares):
1. Farmer
2. Agri Staff
3. Agriculturist  
4. Mayor
5. IT Admin
6. DA/PCIC

CENTER:
- GeoFarm-IS (circle/rounded box)

**Data Flows (Simplified):**

FROM Farmer TO System:
- "Registration data, Parcel details, Updates, Requests"

FROM System TO Farmer:
- "QR ID, Status, Alerts"

FROM Agri Staff TO System:
- "Farmer data, Crop records, Livestock data"

FROM System TO Agri Staff:
- "Reports, Confirmations"

FROM Agriculturist TO System:
- "Map queries, Dashboard filters"

FROM System TO Agriculturist:
- "GIS maps, Risk reports"

FROM Mayor TO System:
- "Report requests"

FROM System TO Mayor:
- "Statistical reports (PDF/Excel)"

FROM IT Admin TO System:
- "User accounts, Settings"

FROM System TO IT Admin:
- "Audit logs, System status"

FROM System TO DA/PCIC:
- "Exported data (CSV/Excel)"

**Mermaid Format (Use this structure):**

```mermaid
graph LR
    %% External Entities (Squares)
    F[Farmer]
    S[Agri Staff<br/>Data Encoder]
    A[Agriculturist<br/>Viewer]
    M[Mayor/<br/>Council]
    I[IT Admin]
    D[DA/PCIC]
    
    %% Central System (Circle)
    G((GeoFarm-IS))
    
    %% Compact Data Flows
    F -->|Registration,<br/>Parcels,<br/>Updates| G
    G -->|QR ID,<br/>Alerts| F
    
    S -->|Farmer data,<br/>Crop/Livestock<br/>records| G
    G -->|Reports,<br/>Confirmations| S
    
    A -->|Map queries,<br/>Filters| G
    G -->|GIS maps,<br/>Risk reports| A
    
    M -->|Report<br/>requests| G
    G -->|Statistical<br/>reports| M
    
    I -->|User mgmt,<br/>Settings| G
    G -->|Audit logs| I
    
    G -->|Exported<br/>data| D
    
    style G fill:#4A90E2,stroke:#333,stroke-width:3px,color:#fff
    style F fill:#E8F4F8,stroke:#333,stroke-width:2px
    style S fill:#E8F4F8,stroke:#333,stroke-width:2px
    style A fill:#E8F4F8,stroke:#333,stroke-width:2px
    style M fill:#E8F4F8,stroke:#333,stroke-width:2px
    style I fill:#E8F4F8,stroke:#333,stroke-width:2px
    style D fill:#E8F4F8,stroke:#333,stroke-width:2px
```

**Output Requirements:**
1. Generate COMPLETE Mermaid code
2. Use LEFT-RIGHT (LR) layout
3. Keep labels SHORT (use <br/> for line breaks)
4. Group multiple data flows on single arrows
5. Make it fit A4 landscape paper when exported
6. Use professional colors (blue for system, light blue for entities)

Generate the complete, optimized Mermaid syntax now.
```

---

## Alternative Prompt (Vertical Compact Layout):

If horizontal doesn't work, try this vertical compact version:

```
Create a compact Level 0 Context Diagram that fits A4 portrait paper.

**Layout:** 
- TOP: 2 entities (Farmer, Agri Staff)
- LEFT: 2 entities (Agriculturist, Mayor)
- RIGHT: 2 entities (IT Admin, DA/PCIC)
- CENTER: GeoFarm-IS (large circle)

Use Mermaid subgraph or TD (top-down) direction with strategic positioning.

```mermaid
graph TD
    %% Top Entities
    F[Farmer]
    S[Agri Staff]
    
    %% Side Entities
    A[Agriculturist]
    M[Mayor]
    I[IT Admin]
    D[DA/PCIC]
    
    %% Central System
    G((GeoFarm-IS<br/>Agricultural<br/>Management<br/>System))
    
    %% Flows - Keep SHORT
    F -->|Data in| G
    G -->|QR, Alerts| F
    
    S -->|Records| G
    G -->|Reports| S
    
    A -->|Queries| G
    G -->|GIS, Analytics| A
    
    M -->|Requests| G
    G -->|Reports| M
    
    I -->|Admin| G
    G -->|Logs| I
    
    G -->|Export| D
```

This creates a more balanced, compact layout suitable for A4 portrait orientation.
```

---

## Steps to Fit in A4:

1. **Use the LR (left-right) layout** for landscape
2. **Export as SVG** (scales better than PNG)
3. **In Mermaid Live Editor**:
   - Adjust zoom to fit screen
   - Export → SVG
   - Open SVG in Word/PowerPoint
   - Resize to fit A4 page
4. **Or use Draw.io**:
   - Import Mermaid code
   - Auto-arrange layout
   - Adjust spacing manually
   - Export as PNG/PDF at desired size

The key is using **shortened labels** and **grouped data flows** to reduce diagram width/height!
