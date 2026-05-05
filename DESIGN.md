# Design System: Vault E2EE

## 1. Visual Theme & Atmosphere
The atmosphere is "Tactile Digital" — an interface that feels like high-quality stationary or a heavy cardstock notebook, yet functions with clinical precision. It is warm, organic, and intentionally quirky through its typography, but strict and secure in its layout.

## 2. Color Palette & Roles
- **Rich Cream** (#FDFCF0) — Primary canvas background. Feels like unbleached paper.
- **Espresso** (#2D1610) — Primary text. A deep, warm brown for a softer yet high-contrast read.
- **Vivid Crimson** (#E11D48) — Primary accent. Used for "Whisper" alerts, brand moments, and primary CTAs.
- **Forest Green** (#065F46) — Secondary accent. Used for secure/online status indicators and success states.
- **Vault Border** (rgba(45, 22, 16, 0.1)) — Subtle structural lines. 1px width.

## 3. Typography Rules
- **Display & UI:** Bricolage Grotesque — An "alive" font with ink traps and liquid-like curves. 
- **Scale:** High contrast. Large headlines with tight letter-spacing (-0.02em).
- **Body:** Bricolage Grotesque (Standard weight). 1.6x line-height for maximum legibility.
- **Banned:** Inter, Open Sans, system defaults.

## 4. Component Stylings
* **Buttons:** Flat, tactile surfaces. Primary buttons use Crimson background with Cream text. Hover states involve subtle scale shifts (1.02x) rather than generic glows.
* **Containers:** No cards with borders. Use negative space and very subtle background shifts to define zones. 
* **Inputs:** Minimalist bottom-border only or very light outlines. Espresso text on Cream.
* **Status:** Small, solid Forest Green circles for "Secure/Online" states.

## 5. Layout Principles
- **Grid:** Asymmetric layouts. Large padding (48px - 64px) to create an "Editorial" feel.
- **Density:** Balanced/Airy. 
- **Containment:** Max-width 1200px for the dashboard; 480px for auth flows.

## 6. Motion & Interaction
- **Spring Physics:** Weighty, intentional transitions. No linear easings.
- **Micro-interactions:** Subtle "liquid" transitions when components mount, mirroring the ink-trap aesthetic of the font.

## 7. Anti-Patterns (Banned)
- No emojis.
- No purple or generic gradients.
- No decorative borders on cards.
- No Inter font.
- No pure black (#000000).
- No generic "AI-style" shadows.
