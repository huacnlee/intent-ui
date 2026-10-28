import type { JSX, StyleProp, TextStyle } from "nsh";
import { Text, windowSize } from "nsh";
import { breakpoint, text, textAt, type Breakpoint } from "./tokens";

/** A step of the Intent type scale. */
export type TypeVariant = keyof typeof text;

export interface TypeProps {
  /** The step of the scale (default `base`). */
  variant?: TypeVariant;
  /** A text color class (default `text-content`; `text-content-muted` for secondary text). */
  tone?: string;
  /** At most this many lines, then an ellipsis. */
  numberOfLines?: number;
  /** The breakpoint whose sizes to use (default: the window's width picks it). */
  at?: Breakpoint;
  /** It is a heading, for screen readers. */
  heading?: boolean;
  /** Finds the text in tests. */
  testID?: string;
  /** Extra Tailwind classes. */
  class?: string;
  /** The inline style, over the step's. */
  style?: StyleProp<TextStyle>;
  /** The text. */
  children?: JSX.Element;
}

/**
 * Text set in a step of the Intent type scale: display, title, headline and
 * feature title in the display face, `mono` in the mono face, the rest in
 * Inter. The display steps shrink on tablets and phones as on intentapp.dev.
 */
export function Type(props: TypeProps) {
  return (
    <Text
      testID={props.testID}
      role={props.heading ? "header" : undefined}
      numberOfLines={props.numberOfLines}
      class={`${props.tone ?? "text-content"} ${props.class ?? ""}`}
      style={[textAt(props.variant ?? "base", props.at ?? breakpoint(windowSize().width)), props.style ?? null]}
    >
      {props.children}
    </Text>
  );
}
