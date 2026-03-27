# Design System Specification: Clinical Botanical Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Modern Apothecary"**
This design system rejects the sterile, cold "Blue-SaaS" aesthetic in favor of a high-end editorial experience that feels both scientifically rigorous and organically grounded. We move beyond the "template" look by treating the dashboard as a digital journal—utilizing intentional asymmetry, generous white space (breathing room), and a sophisticated typographic scale.

The goal is to evoke the feeling of a premium, bespoke consultation. We achieve this by layering textures and tones rather than drawing lines, ensuring the interface feels integrated and fluid rather than a collection of disconnected widgets.

---

## 2. Color & Tonal Depth
Our palette is rooted in the earth but refined for the screen. We utilize the Material Design 3 logic of tonal containers to create a hierarchy of focus.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders (`#CCCCCC` or similar) to section off content. Boundaries must be defined through background color shifts.
* **Example:** A `surface-container-low` (#f2f4f2) card should sit on a `surface` (#f8faf8) background. The shift in value is the boundary.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine, heavy-weight paper.
* **Lowest Layer:** `surface` (#f8faf8) – The primary canvas.
* **Secondary Layer:** `surface-container-low` (#f2f4f2) – Used for secondary sidebar panels or background grouping.
* **Elevated Layer:** `surface-container-lowest` (#ffffff) – Reserved for the highest priority content, like active data tables or primary form modals.

### The Glass & Gradient Rule
To provide visual "soul," avoid purely flat surfaces for large CTAs.
* **Signature Gradients:** Use a subtle linear gradient from `primary` (#01261f) to `primary_container` (#1a3c34) for primary buttons and hero headers.
* **Glassmorphism:** For floating elements like tooltips or dropdown menus, use a `surface-container-lowest` background at 85% opacity with a `12px` backdrop-blur. This allows the botanical greens to bleed through softly, softening the clinical edge.

---

## 3. Typography
The system relies on a high-contrast pairing: the intellectual authority of **Playfair Display** (Serif) and the functional precision of **Inter** (Sans-Serif).

* **Display & Headlines:** (Playfair Display) – Used for page titles and high-level metric summaries. This conveys the "Traditional Medicine" heritage. Set with a slightly tighter letter-spacing (-0.02em) for a high-end editorial feel.
* **Titles & Body:** (Inter) – Used for all interface labels, data tables, and navigation.
* **The "Editorial Scale":** To create rhythm, jump drastically between sizes. Pair a `display-md` (2.75rem) header with a `body-sm` (0.75rem) label immediately below it. This "Big-Small" contrast is a hallmark of premium design.

---

## 4. Elevation & Depth
We eschew the "shadow-heavy" look of 2010s UI. Elevation is achieved through **Tonal Layering**.

* **The Layering Principle:** Depth is "stacked." Place a `surface-container-lowest` (#ffffff) card on top of a `surface-container-low` (#f2f4f2) section to create a soft, natural lift.
* **Ambient Shadows:** If a floating effect is required (e.g., a Modal), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(25, 28, 27, 0.06);`. The shadow color is a tinted version of `on-surface`, never pure black.
* **The Ghost Border Fallback:** If a border is required for accessibility in data-heavy views, use `outline-variant` (#c1c8c4) at 20% opacity. 100% opaque borders are strictly forbidden.

---

## 5. Components

### Buttons
* **Primary:** Gradient from `primary` to `primary_container`. Text: `on-primary` (#ffffff). Shape: `md` (0.375rem).
* **Secondary:** Solid `secondary_fixed`. Text: `on-secondary_fixed_variant`. No border.
* **Tertiary:** Ghost style. Text: `primary`. Hover state uses a 5% opacity `primary` background tint.

### Data Tables
* **Layout:** No vertical lines. Horizontal dividers are "Ghost Borders" (10% opacity `outline-variant`).
* **Header:** Use `label-md` in all caps with `0.05em` letter-spacing for a professional, clinical feel.
* **Pagination:** Use `surface-container-highest` for the active page state; avoid heavy boxes.

### Left Sidebar Navigation
* **Background:** `primary` (#01261f) for a "Dark Mode" anchor against the cream content area.
* **Icons:** Use 20px stroke icons. Active state uses a `secondary_container` (#c6ebd9) indicator bar or subtle glow.
* **Typography:** `title-sm` (Inter).

### Modals & Forms
* **Structure:** Modals use `surface-container-lowest` (#ffffff) with a `xl` (0.75rem) corner radius.
* **Inputs:** `surface-container-high` (#e6e9e7) backgrounds with no borders. On focus, transition to a `px` stroke of `primary`.

### Rich Text Editor
* **Vibe:** Should feel like a clean sheet of paper. Hide toolbars until "On Focus" to maintain the "Clean" vibe. Use `surface-container-lowest` for the writing area.

---

## 6. Do’s and Don’ts

### Do
* **Do** use `20 (5rem)` or `24 (6rem)` spacing between major sections to allow the design to "breathe."
* **Do** use asymmetrical layouts for dashboards—e.g., a wide 2/3 column for the data table and a 1/3 column for "Clinical Notes" or "Quick Actions."
* **Do** use `secondary` (#446557) for status indicators (e.g., "Active," "Verified") to maintain the botanical theme.

### Don’t
* **Don’t** use pure black `#000000` for text. Use `on-surface` (#191c1b) to maintain a soft, organic feel.
* **Don’t** use standard "Select All" checkboxes in tables if a "Bulk Action" floating glass bar is more elegant.
* **Don’t** use 1px solid dividers to separate list items; use `8 (2rem)` of vertical whitespace instead.