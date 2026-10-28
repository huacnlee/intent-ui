import { describe, expect, test } from "nsh/test";
import { bloomTurn } from "../src/mark";

// Each arm's angle (bottom, BR, BL, TL, TR) as lottie-web draws intentapp.dev's
// intent_mark_bloom_256.json at these frames, read from its rendered matrices.
const lottie: Record<number, number[]> = {
  0: [-41, 40, -80, -160, 120],
  3: [-17.33, -155.57, -33.48, -80.32, -127.2],
  6: [-10.64, -97.35, -20.55, -50.67, -80.81],
  10: [-5.73, -51.97, -11.07, -27.36, -43.67],
  15: [-2.46, -20.47, -4.77, -11.1, -17.44],
  20: [-0.93, -5.32, -1.82, -3.25, -4.67],
  25: [-0.5, -1, -1, -1, -1],
  28: [-0.34, -0.25, -0.68, -0.5, -0.32],
  30: [-0.2, -0.05, -0.41, -0.26, -0.11],
  35: [0, 0, 0, 0, 0],
  40: [8.92, 17.11, 22.02, 21.43, 19.99],
  45: [14.81, 76.74, 154.73, 147.61, 118.21],
  50: [17.6, 103.25, -57.64, -122.79, 170.75],
  55: [19.08, 114.04, -19, -94.5, -170.16],
};

// The difference of two angles, in (-180, 180].
const apart = (a: number, b: number) => ((((a - b) % 360) + 540) % 360) - 180;

describe("mark", () => {
  test("blooms frame by frame as the Lottie file", () => {
    for (const [frame, angles] of Object.entries(lottie)) {
      angles.forEach((angle, arm) => {
        expect(Math.abs(apart(bloomTurn(arm, Number(frame)), angle))).toBeLessThan(0.02);
      });
    }
  });
});
