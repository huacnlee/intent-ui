// The Intent foundations that are geometry, type and motion rather than
// color: colors live in `theme.json` and are used through classes
// (`bg-control-surface`, `text-content-muted`, ...).

import type { TextStyle, ViewStyle } from "nsh";

/** The radius scale (`--radius-*` in `theme.json`), in points. */
export const radius = {
  xs: 5,
  s: 10,
  m: 15,
  l: 20,
  xl: 25,
  "2xl": 45,
} as const;

/** The spacing scale (`--space-*` in `theme.json`), in points. */
export const space = {
  5: 5,
  10: 10,
  15: 15,
  20: 20,
  25: 25,
  40: 40,
  60: 60,
  80: 80,
} as const;

/** Control sizes shared by buttons, fields, dropdowns and tabs. */
export type ControlSize = "extra-small" | "small" | "large";

/** The height of a control of each size, in points. */
export const controlHeight: Record<ControlSize, number> = {
  "extra-small": 35,
  small: 40,
  large: 60,
};

/** The radius of a control of each size, in points. */
export const controlRadius: Record<ControlSize, number> = {
  "extra-small": radius.m,
  small: radius.m,
  large: radius.l,
};

/** The size of a glyph inside a control, in points. */
export const iconSize = 16;

/**
 * The type families of the system; `font-sans` in the theme is the app's.
 * The display and mono faces are licensed and not shipped: until an app
 * hands its own files to `configureFonts`, they fall back as intentapp.dev
 * does (`ui-serif`, `ui-monospace`) to the system serif and monospace.
 */
export const fontFamily: { sans: string; display: string; mono: string } = {
  /** Interface text. */
  sans: "Inter",
  /** Headlines and display text: ABC Arizona Mix, else the system serif. */
  display: "serif",
  /** Labels and figures: Aeonik Mono, else the system monospace. */
  mono: "monospace",
};

/**
 * The type scale, at the desktop sizes of intentapp.dev (768 pt wide and
 * up); `textScale` holds the tablet and phone sizes of the display steps.
 * Line height and letter spacing are in points as NSH takes them.
 */
export const text = {
  /** H1, the largest headline (380, 90 / 0.95, -3.6). */
  display: { fontFamily: fontFamily.display, fontSize: 90, lineHeight: 85.5, letterSpacing: -3.6, fontWeight: "380" },
  /** H2 (60 / 1, -3.5%). */
  title: { fontFamily: fontFamily.display, fontSize: 60, lineHeight: 60, letterSpacing: -2.1, fontWeight: "400" },
  /** H3 (48 / 0.95, -4.5%). */
  headline: { fontFamily: fontFamily.display, fontSize: 48, lineHeight: 45.6, letterSpacing: -2.16, fontWeight: "400" },
  /** H4, the feature title (26 / 1, -2%). */
  featureTitle: { fontFamily: fontFamily.display, fontSize: 26, lineHeight: 26, letterSpacing: -0.52, fontWeight: "400" },
  /** Feature body (16 / 1.3, -0.5%). */
  featureBody: { fontSize: 16, lineHeight: 20.8, letterSpacing: -0.08, fontWeight: "400" },
  /** Body, the large reading size (32 / 1.3). */
  body: { fontSize: 32, lineHeight: 41.6, letterSpacing: 0.64, fontWeight: "400" },
  /** Base (18 / 1.3, -1%). */
  base: { fontSize: 18, lineHeight: 23.4, letterSpacing: -0.18, fontWeight: "400" },
  /** Label, in the mono face (14 / 1.1, -0.28). */
  mono: { fontFamily: fontFamily.mono, fontSize: 14, lineHeight: 15.4, letterSpacing: -0.28, fontWeight: "400" },
  /** The text of controls: Inter medium (14 / 1.1, -0.28). */
  label: { fontSize: 14, lineHeight: 15.4, letterSpacing: -0.28, fontWeight: "500" },
  /** Button label (14 / 1.1, -1%). */
  button: { fontSize: 14, lineHeight: 15.4, letterSpacing: -0.14, fontWeight: "500" },
  /** Small label, tooltips (12, -2%). */
  small: { fontSize: 12, lineHeight: 14, letterSpacing: -0.24, fontWeight: "500" },
  /** Caption, slider properties and values (11). */
  caption: { fontSize: 11, lineHeight: 13, letterSpacing: 0, fontWeight: "500" },
  /** Eyebrow, the uppercase heading of a navigation group (11, +6%). */
  eyebrow: { fontSize: 11, lineHeight: 13, letterSpacing: 0.66, fontWeight: "500", textTransform: "uppercase" },
  /** Field messages (10). */
  message: { fontSize: 10, lineHeight: 12, letterSpacing: 0, fontWeight: "500" },
} satisfies Record<string, TextStyle>;

/** The widths the type scale changes at: phones under 480, tablets under 768. */
export type Breakpoint = "mobile" | "tablet" | "desktop";

/** The breakpoint of a window this wide, in points. */
export function breakpoint(width: number): Breakpoint {
  return width < 480 ? "mobile" : width < 768 ? "tablet" : "desktop";
}

/** The display steps at tablet and phone widths (the desktop's are in `text`). */
export const textScale: Record<Exclude<Breakpoint, "desktop">, Partial<Record<keyof typeof text, TextStyle>>> = {
  tablet: {
    display: { fontSize: 72, lineHeight: 72, letterSpacing: -3.6 },
    headline: { fontSize: 32, lineHeight: 35.2, letterSpacing: -1.44 },
  },
  mobile: {
    display: { fontSize: 44, lineHeight: 41.8, letterSpacing: -1.76 },
    title: { fontSize: 40, lineHeight: 40, letterSpacing: -1.4 },
    headline: { fontSize: 32, lineHeight: 30.4, letterSpacing: -1.44 },
    featureTitle: { fontSize: 24, lineHeight: 24, letterSpacing: -0.48 },
  },
};

/** A step of the type scale at a breakpoint. */
export function textAt(variant: keyof typeof text, at: Breakpoint): TextStyle {
  return at === "desktop" ? text[variant] : { ...text[variant], ...textScale[at][variant] };
}

/**
 * Sets the licensed faces once the app ships them, before the first render:
 * `configureFonts({ display: Arizona, mono: Aeonik })`, where each is the
 * value of the font file's import (its family name).
 */
export function configureFonts(families: { display?: string; mono?: string }) {
  const steps: TextStyle[] = Object.values(text);
  for (const role of ["display", "mono"] as const) {
    const next = families[role];
    if (!next) continue;
    for (const step of steps) if (step.fontFamily === fontFamily[role]) step.fontFamily = next;
    fontFamily[role] = next;
  }
}

/** The motion curves of the system. */
export const ease = {
  /** The house curve: controls change color, buttons roll their label. */
  standard: "cubic-bezier(0.6, 0, 0.1, 1)",
  /** Indicators that slide (tabs, model switcher). */
  out: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

/** Durations, in milliseconds. */
export const duration = {
  /** Color changes of controls. */
  color: 500,
  /** The label and icon roll of a button. */
  roll: 450,
  /** A sliding indicator. */
  slide: 400,
  /** Small fades (an expanding label). */
  fade: 180,
} as const;

/** A color transition in the house curve. */
export const colorTransition: ViewStyle = {
  transitionProperty: "background-color, color, border-color, opacity",
  transitionDuration: duration.color,
  transitionTimingFunction: ease.standard,
};

/** The elevation of floating surfaces (menus, popovers). */
export const shadowElevated = "0 10px 20px rgba(0, 0, 0, 0.1)";

/**
 * The gradients of the system, for subtle backgrounds and surfaces beside
 * the flat colors (use them sparingly), as `backgroundImage` values.
 *
 * They draw intentapp.dev's gradients in the CSS NSH renders: stops before 0%
 * are resolved to the color at 0%, and the two radial gradients, whose
 * ellipses are 2.4–2.8 times the view's width (so they fall top to bottom),
 * become the linear gradients they are down the view's center line (the
 * ellipses' curve toward the side edges is lost). `Gradient` draws all six
 * exactly, from `gradientSpecs`.
 */
export const gradients = {
  /** `linear-gradient(#f0f0eb 3.034%, #ebe0d0 65.149%, #ddec61 105.19%)` */
  lightGreyToYellow: "linear-gradient(#f0f0eb 3.034%, #ebe0d0 65.149%, #ddec61 105.19%)",
  /** `linear-gradient(#cfcfcd 0%, #ebe4d8 55%, #e7f573 100%)` */
  mediumGreyToYellow: "linear-gradient(#cfcfcd 0%, #ebe4d8 55%, #e7f573 100%)",
  /** `radial-gradient(277% 100% at 50% 0%, #cfcfcf 40%, #ced590 79.167%, #ddec61 100%)` */
  greyToYellow: "linear-gradient(#cfcfcf 40%, #ced590 79.167%, #ddec61 100%)",
  /** `radial-gradient(241% 93.333% at 50% 10%, #e1e1de 0%, #ddec61 100%)` */
  yellowWash: "linear-gradient(#e1e2d1 0%, #e1e1de 10%, #ddec61 103.333%)",
  /** `linear-gradient(#ddec61 -27.5%, #cfcfcf 100%)` */
  yellowToGrey: "linear-gradient(#dae679 0%, #cfcfcf 100%)",
  /** `linear-gradient(#ddec61 -23.524%, #fef99d 13.741%, #ffffc7 46.25%, #fcfcf9 105.83%)` */
  lightYellows: "linear-gradient(#f2f487 0%, #fef99d 13.741%, #ffffc7 46.25%, #fcfcf9 105.83%)",
} as const;

/** The name of a gradient of the system. */
export type GradientName = keyof typeof gradients;

/**
 * A gradient as intentapp.dev's CSS defines it: top to bottom, or an
 * ellipse of `size` (fractions of the view's width and height) centered
 * `at` (fractions too); each stop a color and its position (a fraction, 0
 * to 1 or past them).
 */
export interface GradientSpec {
  shape: "linear" | "radial";
  size?: readonly [number, number];
  at?: readonly [number, number];
  stops: readonly (readonly [string, number])[];
}

/** The gradients exactly as intentapp.dev draws them; `Gradient` paints them. */
export const gradientSpecs: Record<GradientName, GradientSpec> = {
  lightGreyToYellow: { shape: "linear", stops: [["#f0f0eb", 0.03034], ["#ebe0d0", 0.65149], ["#ddec61", 1.0519]] },
  mediumGreyToYellow: { shape: "linear", stops: [["#cfcfcd", 0], ["#ebe4d8", 0.55], ["#e7f573", 1]] },
  greyToYellow: { shape: "radial", size: [2.77, 1], at: [0.5, 0], stops: [["#cfcfcf", 0.4], ["#ced590", 0.79167], ["#ddec61", 1]] },
  yellowWash: { shape: "radial", size: [2.41, 0.93333], at: [0.5, 0.1], stops: [["#e1e1de", 0], ["#ddec61", 1]] },
  yellowToGrey: { shape: "linear", stops: [["#ddec61", -0.275], ["#cfcfcf", 1]] },
  lightYellows: { shape: "linear", stops: [["#ddec61", -0.23524], ["#fef99d", 0.13741], ["#ffffc7", 0.4625], ["#fcfcf9", 1.0583]] },
};
