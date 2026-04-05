# Built-In Closet Designer — Strategic Plan

## Vision
A drag-and-drop 3D closet design tool for homeowners, cabinet makers, and interior designers.
Users configure a space, populate it with components, validate the design, and export production-ready outputs.

---

## Target Users
- **Homeowners (DIY)** — ease of use, visual feedback, shopping list
- **Cabinet makers / professionals** — precision, cut lists, tolerances
- **Interior designers** — aesthetics, save/share, PDF plans

---

## Core Modules

### 1. Space Configuration
Define the physical closet envelope before anything else.

| Setting | Details |
|---|---|
| Width | Adjustable (min/max bounds, snap to common sizes) |
| Height | Floor to ceiling or custom soffit height |
| Depth | Standard 600mm / 24" or custom |
| Wall type | Flat wall, alcove/recess, L-shape, U-shape, walk-in |
| Kickboard height | Standard 100mm or custom; style: solid, recessed, none |

---

### 2. Column & Grid System
The closet is divided into vertical columns — the structural backbone of the design.

- Add / remove columns with drag handles
- Set individual column widths
- Snap to standard widths (300, 400, 450, 600mm)
- Total column widths must equal overall closet width (validated)
- Each column is independently configurable (hanging, shelves, drawers, etc.)

---

### 3. Component Library (Drag & Drop)
All components from the component list are available in a side panel.

#### Structural
- Side panels, top panel, base panel
- Backing (wall / ¼" ply)
- Face frames
- Doors (swing, sliding, bi-fold, open)

#### Shelving
- Fixed shelf
- Adjustable shelf
- Slanted shoe shelf
- Corner shelf

#### Hanging
- Single hang rod
- Double hang rod (stacked)
- Valet rod (pull-out)

#### Drawers & Pull-outs
- Standard drawer (shallow / deep)
- Jewelry drawer (velvet-lined)
- Pull-out basket
- Laundry hamper
- Trouser pull-out
- Ironing board pull-out
- Belt / tie rack

#### Shoe Storage
- Flat shoe shelf
- Angled shoe shelf
- Shoe cubby
- Boot space

#### Cabinets
- Glass-front cabinet
- Solid door cabinet
- Locked cabinet

#### Accessories
- Interior LED lighting
- Mirror (full-length / pull-out)
- Power outlet / USB strip
- Hooks

---

### 4. 3D Visualizer
Real-time 3D perspective view of the closet as components are placed.

- Orbit / rotate / zoom camera controls
- Toggle between: 3D perspective, front elevation (2D), side view
- Show/hide dimensions overlay
- Realistic materials (wood grain, melamine, glass)
- Day/night lighting toggle (to preview interior lighting)
- Snap-to-grid placement with visual guides

---

### 5. Validation Engine
Every design is checked in real time against the defined space and structural rules.

#### Space Validation
- Column widths sum to total closet width
- No component exceeds column or closet depth
- No component exceeds ceiling height
- Components don't overlap or collide

#### Structural Validation
- Shelf spans flag if exceeding safe unsupported span (e.g. >900mm without center panel)
- Hang rod clearance — minimum drop height below shelf for clothing type
  - Long hang: min 1400mm clear
  - Short / double hang: min 1000mm per zone
- Drawer stack height doesn't exceed column height
- Kickboard clearance respected at base

#### Component-Specific Rules
- Adjustable shelves require shelf pin holes in side panels
- Pull-outs require minimum depth (e.g. drawer slides need 450mm+)
- Glass cabinet doors need hinge clearance on swing side
- Valet rod needs minimum 100mm protrusion space in depth

#### Validation UI
- Real-time red highlight on conflicting components
- Warning panel listing all issues with one-click jump to issue
- Green "Design Valid" badge when all rules pass
- Warnings vs. Errors (warnings allow export, errors block it)

---

### 6. Outputs

#### Cut List / Materials List
- Every panel listed: name, material, width × height × thickness
- Grouped by material type
- Optimized sheet layout (nesting) for plywood/melamine sheets
- Hardware count (hinges, drawer slides, shelf pins, etc.)
- Export: CSV, PDF

#### PDF Drawing / Plan
- Front elevation drawing with dimensions
- Side section view
- Column breakdown diagram
- Component schedule table
- Company/designer logo & title block (customizable)
- Export: PDF (print-ready A3/A4/Letter)

#### Shopping List with Costs
- Components mapped to materials + hardware
- User sets material costs (per sheet, per metre)
- Labour estimate (optional, user-defined rate)
- Total material cost, hardware cost, and grand total
- Export: CSV, PDF

#### Save & Share
- Save design to account (cloud)
- Share via link (view-only or editable)
- Duplicate design
- Version history (restore previous states)
- Export design file (.closet JSON format)

---

## UX Principles

- **Space first** — user always defines the physical space before placing components
- **Validate continuously** — errors surface immediately, not at export time
- **Progressive complexity** — simple mode (presets) vs. advanced mode (full control)
- **Snap & guide** — components snap to logical positions; free placement is secondary
- **Non-destructive** — undo/redo stack, no accidental deletions

---

## Tech Considerations

| Area | Recommendation |
|---|---|
| 3D Engine | Three.js or Babylon.js |
| UI Framework | React |
| State Management | Zustand or Redux |
| PDF Export | jsPDF + custom renderer |
| Cut list / nesting | Custom bin-packing algorithm |
| Save/Share | Supabase or Firebase (auth + storage) |
| File format | JSON schema (versioned) |

---

## Phased Roadmap

### Phase 1 — Core Designer
- Space configuration
- Column/grid system
- Drag & drop components (basic set)
- 3D visualizer
- Basic validation (space + collision)

### Phase 2 — Outputs
- Cut list export
- PDF drawing export
- Shopping list with costs

### Phase 3 — Advanced Validation & Components
- Full structural rule engine
- Advanced components (pull-outs, specialty drawers)
- Sheet nesting optimizer

### Phase 4 — Save, Share & Polish
- User accounts
- Save / share / duplicate
- Version history
- Preset designs (walk-in, reach-in, wardrobe)
- Mobile-friendly view mode