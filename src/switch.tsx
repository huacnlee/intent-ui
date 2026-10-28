import type { JSX } from "nsh";
import { Switch as BaseSwitch } from "nsh/base";
import { radius } from "./tokens";

/** The size of a switch: 50 × 30, 40 × 20, or 35 × 20 with a square thumb. */
export type SwitchSize = "large" | "small" | "small-short";

/** The colors of a switch that is on: a citrus track with a dark thumb, or a dark track with a citrus thumb. */
export type SwitchTone = "normal" | "inverted";

export interface SwitchProps {
  /** On or off; the app owns it and sets it in `onChange`. */
  checked: boolean;
  /** The size (default `large`). */
  size?: SwitchSize;
  /** The colors while on (default `normal`). */
  tone?: SwitchTone;
  /** No presses; the switch fades to 40%. */
  disabled?: boolean;
  /** What screen readers say: the setting it turns on. */
  accessibilityLabel?: string;
  /** Finds the switch in tests. */
  testID?: string;
  /** Extra Tailwind classes for the switch. */
  class?: string;
  /** A label after the track. */
  children?: JSX.Element;
  /** The switch asks for the other value. */
  onChange?: (checked: boolean) => void;
}

const geometry: Record<SwitchSize, { width: number; height: number; thumbWidth: number; thumbHeight: number }> = {
  large: { width: 50, height: 30, thumbWidth: 20, thumbHeight: 26 },
  small: { width: 40, height: 20, thumbWidth: 20, thumbHeight: 16 },
  "small-short": { width: 35, height: 20, thumbWidth: 16, thumbHeight: 16 },
};

/** The padding between track and thumb. */
const inset = 2;

/**
 * The Intent switch: a grey track with a light thumb that slides over and
 * turns the track citrus (or, inverted, the thumb citrus on a dark track).
 */
export function Switch(props: SwitchProps) {
  const g = () => geometry[props.size ?? "large"];
  const inverted = () => props.tone === "inverted";
  const travel = () => g().width - g().thumbWidth - inset * 2;
  return (
    <BaseSwitch
      checked={props.checked}
      disabled={props.disabled}
      accessibilityLabel={props.accessibilityLabel}
      testID={props.testID}
      class={`flex items-center gap-2.5 disabled:opacity-40 ${props.class ?? ""}`}
      trackClass={`bg-control-edge transition-colors duration-180 focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-3 ${
        inverted() ? "checked:bg-control-surface-inverse" : "checked:bg-accent"
      }`}
      trackStyle={{ width: g().width, height: g().height, padding: inset, borderRadius: radius.s, justifyContent: "center" }}
      thumbClass={`bg-control-thumb transition duration-220 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        inverted() ? "checked:bg-accent" : "checked:bg-content-fixed-dark"
      } checked:translate-x-[${travel()}px]`}
      thumbStyle={{ width: g().thumbWidth, height: g().thumbHeight, borderRadius: 8 }}
      onChange={props.onChange}
    >
      {props.children}
    </BaseSwitch>
  );
}
