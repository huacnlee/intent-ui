import { Image, Text, View } from "nsh";
import type { TooltipProps as BaseTooltipProps } from "nsh/base";
import arrow from "./assets/tooltip-arrow.svg";
import { radius, text } from "./tokens";

// NSH takes an element's `tooltip` as a tooltip only when it is a `Tooltip`
// of `nsh/base` written right there (`tooltip={<Tooltip …>…</Tooltip>}`); a
// component that returns one is shown as a plain element. So the Intent
// tooltip is two parts: `tooltipProps` for the `nsh/base` Tooltip and
// `TooltipContent` for what it shows.
//
//   import { Tooltip } from "nsh/base";
//   <View tooltip={<Tooltip {...tooltipProps()}><TooltipContent label="Copy" /></Tooltip>} />

/** The look of a tooltip: a bubble, or a bubble with a tip pointing at its element. */
export type TooltipVariant = "simple" | "tip";

/** The side of its element a tooltip goes on. */
export type TooltipPlacement = "top" | "bottom";

export interface TooltipOptions {
  /** The side of the element (default `top`). */
  placement?: TooltipPlacement;
  /** Milliseconds the pointer rests on the element before it shows (default 800). */
  delay?: number;
  /** Shown, controlled by the app (with `onOpenChange`). */
  open?: boolean;
  /** No tooltip. */
  disabled?: boolean;
  /** The pointer rested on the element, or left or pressed it. */
  onOpenChange?: (open: boolean) => void;
}

/** The props of the `nsh/base` Tooltip for an Intent tooltip: its side, a 5 pt gap and an 800 ms delay. */
export function tooltipProps(options: TooltipOptions = {}): BaseTooltipProps {
  const props: BaseTooltipProps = {
    placement: options.placement ?? "top",
    offset: 5,
    delay: options.delay ?? 800,
    disabled: options.disabled,
  };
  if (options.open != null) props.open = options.open;
  if (options.onOpenChange) props.onOpenChange = (open) => options.onOpenChange?.(open);
  return props;
}

export interface TooltipContentProps {
  /** What it says: one short line. */
  label: string;
  /** A bubble with a tip (default) or without. */
  variant?: TooltipVariant;
  /** The side of the element it is on, so the tip points at it (default `top`). */
  placement?: TooltipPlacement;
}

/**
 * What an Intent tooltip shows: a 30 pt inverse bubble with a small label,
 * and a tip pointing at the element.
 */
export function TooltipContent(props: TooltipContentProps) {
  const bottom = () => props.placement === "bottom";
  return (
    <View class="items-center" style={{ flexDirection: bottom() ? "column-reverse" : "column" }}>
      <View class="bg-inverse-surface items-center justify-center" style={{ height: 30, paddingHorizontal: 15, borderRadius: radius.s }}>
        <Text class="text-inverse-content" style={[text.small, { lineHeight: 15.6 }]} numberOfLines={1}>
          {props.label}
        </Text>
      </View>
      {(props.variant ?? "tip") === "tip" ? (
        <Image
          src={arrow}
          class="tint-inverse-surface"
          style={[{ width: 10, height: 6 }, bottom() ? { marginBottom: -1, transform: [{ scaleY: -1 }] } : { marginTop: -1 }]}
        />
      ) : null}
    </View>
  );
}
