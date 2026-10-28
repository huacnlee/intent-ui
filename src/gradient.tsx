import type { CanvasRenderingContext2D, StyleProp, ViewStyle } from "nsh";
import { Canvas, View } from "nsh";
import type { JSX } from "nsh/jsx-runtime";
import { type GradientName, type GradientSpec, gradientSpecs } from "./tokens";

export interface GradientProps {
  /** Which gradient of the system. */
  name: GradientName;
  /** The corner radius, in points (default 0). */
  radius?: number;
  /** A 1 pt `border` edge around it, for the lightest gradients on a light canvas (default false). */
  outlined?: boolean;
  /** What sits on the gradient. */
  children?: JSX.Element;
  /** Extra Tailwind classes. */
  class?: string;
  /** The inline style: give it a size. */
  style?: StyleProp<ViewStyle>;
  /** Finds it in tests. */
  testID?: string;
}

// Paints `spec` over a w × h view with rounded corners. The gradient line
// (or the ellipse's radius) is stretched to reach the whole view, the stops
// placed along it, so nothing relies on how a platform pads past the ends.
function paint(cx: CanvasRenderingContext2D, spec: GradientSpec, w: number, h: number, r: number) {
  cx.beginPath();
  cx.roundRect(0, 0, w, h, r);
  cx.clip();
  const positions = spec.stops.map(([, at]) => at);
  if (spec.shape === "linear") {
    const from = Math.min(0, ...positions);
    const to = Math.max(1, ...positions);
    const g = cx.createLinearGradient(0, from * h, 0, to * h);
    for (const [color, at] of spec.stops) g.addColorStop((at - from) / (to - from), color);
    cx.fillStyle = g;
    cx.fillRect(0, 0, w, h);
    return;
  }
  // An ellipse: draw a circle of its horizontal radius, squeezed vertically.
  const [sx, sy] = spec.size ?? [1, 1];
  const [ax, ay] = spec.at ?? [0.5, 0.5];
  const rx = sx * w;
  const ry = sy * h;
  const x = ax * w;
  const y = ay * h;
  // The farthest corner, in the ellipse's own units (1 is its edge).
  const reach = Math.max(
    ...[[0, 0], [w, 0], [0, h], [w, h]].map(([px, py]) => Math.hypot((px - x) / rx, (py - y) / ry)),
    ...positions,
  );
  cx.translate(x, y);
  cx.scale(1, ry / rx);
  const g = cx.createRadialGradient(0, 0, 0, 0, 0, reach * rx);
  for (const [color, at] of spec.stops) g.addColorStop(Math.max(0, at) / reach, color);
  cx.fillStyle = g;
  cx.fillRect(-x, (-y * rx) / ry, w, (h * rx) / ry);
}

/**
 * A view filled with one of the system's gradients, drawn exactly as
 * intentapp.dev's CSS draws it (the radial ones too, which a
 * `backgroundImage` cannot), behind its children.
 */
export function Gradient(props: GradientProps) {
  const r = () => props.radius ?? 0;
  // The gradient fills inside the edge, its corners rounded to match.
  const edge = () => (props.outlined ? 1 : 0);
  return (
    <View
      testID={props.testID}
      class={`${props.outlined ? "border border-border" : ""} ${props.class ?? ""}`}
      style={[{ borderRadius: r() }, props.style ?? null]}
    >
      <Canvas
        class="absolute"
        pointerEvents="none"
        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
        draw={(cx, { width, height }) => paint(cx, gradientSpecs[props.name], width, height, Math.max(0, r() - edge()))}
      />
      {props.children}
    </View>
  );
}
