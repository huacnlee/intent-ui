import type { ImageAsset, ImageStyle, StyleProp } from "nsh";
import { cleanup, createMotion, Image, reduceMotion, View } from "nsh";
import mark from "./assets/mark.svg";
import bl from "./assets/mark/bl.svg";
import bottom from "./assets/mark/bottom.svg";
import br from "./assets/mark/br.svg";
import tl from "./assets/mark/tl.svg";
import tr from "./assets/mark/tr.svg";

/** How the mark comes in: still, or its arms swirling into place (intentapp.dev's Bloom). */
export type MarkAnimation = "none" | "bloom";

export interface MarkProps {
  /** The width, in points; the height keeps the artwork's proportions (default 40). */
  size?: number;
  /** How it comes in (default `none`). */
  animation?: MarkAnimation;
  /** Play the animation as intentapp.dev does, again and again (default false: once, stopping settled). */
  loop?: boolean;
  /** A `tint-<token>` class (default `tint-content`). */
  class?: string;
  /** The inline style of the mark. */
  style?: StyleProp<ImageStyle>;
  /** What screen readers say (default "Intent"). */
  accessibilityLabel?: string;
  /** Finds the mark in tests. */
  testID?: string;
}

// The artwork's proportions (its viewBox is 264 × 260).
const ratio = 260 / 264;

// intentapp.dev's Bloom (intent_mark_bloom_256.json), played as its page
// plays it: lottie-web, 30 fps, looping, subframes on. Each arm turns by its
// own curve plus the whole mark's (CTRL); every key below is the file's
// [frame, degrees, out x, out y, in x, in y], its curve running to the next key.
type Key = [number, number, number?, number?, number?, number?];
const fps = 30;
// The arms end at frame 56 and the file at 61, so a loop rests blank between.
const lastFrame = 61;
const shownUntil = 56;
// The settled mark, where a single play stops.
const settledFrame = 35;
const ctrl: Key[] = [
  [0, -40, 0.01, 0.405, 0.085, 1],
  [25, -0.5, 0.326, 0.221, 0.659, 1],
  [35, 0, 0.167, 0, 0, 1],
  [65, 20],
];
const arms: { src: ImageAsset; keys: Key[] }[] = [
  { src: bottom, keys: [[0, -1, 0.01, 0.336, 0, 1], [25, 0]] },
  { src: br, keys: [[0, -280, 0.005, 0.205, 0.085, 1], [25, -0.5, 0.326, 2.172, 0.659, 1], [35, 0, 0.45, 0, 0, 1], [65, 100]] },
  { src: bl, keys: [[0, -40, 0.006, 0.435, 0.094, 1], [25, -0.5, 0.326, 0.211, 0.659, 1], [35, 0, 0.599, 0, 0, 1], [65, 340]] },
  { src: tl, keys: [[0, -120, 0.006, 0.144, 0.094, 1], [25, -0.5, 0.326, 1.034, 0.659, 1], [35, 0, 0.549, 0, 0, 1], [65, 260]] },
  { src: tr, keys: [[0, -200, 0.006, 0.086, 0.094, 1], [25, -0.5, 0.326, 1.857, 0.659, 1], [35, 0, 0.5, 0, 0, 1], [65, 180]] },
];

// A cubic Bézier easing, solved for x as lottie-web (and CSS) do.
function bezier(x1: number, y1: number, x2: number, y2: number, x: number) {
  const at = (a: number, b: number, t: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (at(x1, x2, mid) < x) lo = mid;
    else hi = mid;
  }
  return at(y1, y2, (lo + hi) / 2);
}

// A property's value at a frame: held before the first key and after the last.
function valueAt(keys: Key[], frame: number) {
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, v0, ox = 0, oy = 0, ix = 1, iy = 1] = keys[i];
    const [f1, v1] = keys[i + 1];
    if (frame < f1) return v0 + (v1 - v0) * bezier(ox, oy, ix, iy, (frame - f0) / (f1 - f0));
  }
  return keys[keys.length - 1][1];
}

// An arm's turn every quarter frame up to `end`, as linear keyframes.
const steps = 4;
function turns(keys: Key[], end: number) {
  const out: { value: number; offset: number; easing: "linear" }[] = [];
  for (let i = 0; i <= end * steps; i++) {
    const frame = i / steps;
    out.push({ value: valueAt(ctrl, frame) + valueAt(keys, frame), offset: frame / end, easing: "linear" });
  }
  return out;
}

/** An arm's turn at a frame of the Bloom, in degrees (for tests). */
export function bloomTurn(arm: number, frame: number) {
  return valueAt(ctrl, frame) + valueAt(arms[arm].keys, frame);
}

/**
 * The Intent mark: five arms around a stem. Use it as supplied, tinted one
 * color, without redrawing, stretching or changing its proportions.
 */
export function Mark(props: MarkProps) {
  const size = () => props.size ?? 40;
  const tint = () => props.class ?? "tint-content";
  const animated = props.animation === "bloom" && !reduceMotion();

  if (!animated) {
    return (
      <Image
        src={mark}
        testID={props.testID}
        accessibilityLabel={props.accessibilityLabel ?? "Intent"}
        class={tint()}
        style={[{ width: size(), height: size() * ratio, flexShrink: 0 }, props.style ?? null]}
      />
    );
  }

  // A loop plays the whole file again and again; a single play stops settled.
  const end = props.loop ? lastFrame : settledFrame;
  const rotations = arms.map((arm) => turns(arm.keys, end));
  const motions = rotations.map((r) => createMotion({ initial: { rotate: r[0].value } }));
  // A loop blanks the mark from frame 56 and starts again at 61, on timers:
  // an animation's end can come late (seconds, on Android), which would
  // stretch the blank.
  const veil = createMotion({ initial: { opacity: 1 } });
  const timers: ReturnType<typeof setTimeout>[] = [];
  const play = () => {
    motions.forEach((m, i) => {
      m.rotate.set(rotations[i][0].value);
      void m.play({ duration: (end / fps) * 1000, keyframes: { rotate: rotations[i] } });
    });
    if (!props.loop) return;
    veil.opacity.set(1);
    timers.splice(0, timers.length, setTimeout(() => veil.opacity.set(0), (shownUntil / fps) * 1000), setTimeout(play, (lastFrame / fps) * 1000));
  };
  play();
  cleanup(() => timers.forEach(clearTimeout));

  return (
    <View
      testID={props.testID}
      role="image"
      accessibilityLabel={props.accessibilityLabel ?? "Intent"}
      style={[{ width: size(), height: size() * ratio, flexShrink: 0, ...veil.style }, props.style ?? null]}
    >
      {arms.map((arm, i) => (
        <Image
          src={arm.src}
          class={`absolute ${tint()}`}
          style={{
            top: 0,
            left: 0,
            width: size(),
            height: size() * ratio,
            // The file's center of turn: (132, 126.5) in the 264 × 260 artwork.
            transformOrigin: ["50%", "48.66%"],
            ...motions[i].style,
          }}
        />
      ))}
    </View>
  );
}
