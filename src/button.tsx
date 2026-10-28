import type { StyleProp, ViewStyle } from "nsh";
import { LayoutAnimation, platform, reduceMotion, signal, Text, View } from "nsh";
import { Button as BaseButton, Tooltip } from "nsh/base";
import { Icon, type IconName } from "./icon";
import { TooltipContent, tooltipProps } from "./tooltip";
import { colorTransition, duration, ease, iconSize, radius, text } from "./tokens";

/** The fill of a button. */
export type ButtonColor = "black" | "citrus" | "white" | "grey" | "outline";

/** The height of a button: 35, 40, 60 or 90 (a round icon button). */
export type ButtonSize = "extra-small" | "small" | "large" | "extra-large";

/**
 * What a button shows: a label, an icon then a label, an icon alone, or an
 * icon that grows to show its label while hovered.
 */
export type ButtonVariant = "text" | "text-icon" | "icon" | "icon-expand";

export interface ButtonProps {
  /** The label; for `icon` buttons what screen readers say and the tooltip. */
  label: string;
  /** The glyph of `text-icon`, `icon` and `icon-expand` buttons. */
  icon?: IconName;
  /** What it shows (default `text`, or `text-icon` when an icon is given). */
  variant?: ButtonVariant;
  /** The fill (default `black`). Black, white and grey turn citrus under the pointer, citrus turns black. */
  color?: ButtonColor;
  /** The height (default `small`, 40). `extra-large` is a 90 pt circle for an icon. */
  size?: ButtonSize;
  /** A fixed width in points (default: as wide as the content). */
  width?: number;
  /** No presses; black and citrus turn grey, the content fades. */
  disabled?: boolean;
  /** Icon buttons: show the label in a tooltip above while the pointer rests on it (default true). */
  tooltip?: boolean;
  /** The label rolls up and in again under the pointer (default true; never with reduced motion). */
  roll?: boolean;
  /** What screen readers say, when the label is not enough. */
  accessibilityLabel?: string;
  /** Finds the button in tests. */
  testID?: string;
  /** Extra Tailwind classes, after the button's own. */
  class?: string;
  /** The inline style, over the classes. */
  style?: StyleProp<ViewStyle>;
  /** The button was pressed. */
  onPress?: () => void;
}

const heights: Record<ButtonSize, number> = { "extra-small": 35, small: 40, large: 60, "extra-large": 90 };
const radii: Record<ButtonSize, number> = { "extra-small": radius.m, small: radius.m, large: radius.l, "extra-large": radius["2xl"] };
const paddings: Record<ButtonSize, number> = { "extra-small": 20, small: 20, large: 30, "extra-large": 30 };

const fills: Record<ButtonColor, { rest: string; hover: string; disabled: string; ink: string; inkHover: string }> = {
  black: {
    rest: "bg-inverse-surface text-inverse-content",
    hover: "hover:bg-accent hover:text-content-fixed-dark",
    disabled: "bg-button-disabled text-inverse-content",
    ink: "tint-inverse-content",
    inkHover: "group-hover:tint-content-fixed-dark",
  },
  citrus: {
    rest: "bg-accent text-content-fixed-dark",
    hover: "hover:bg-inverse-surface hover:text-inverse-content",
    disabled: "bg-button-disabled text-content-fixed-dark",
    ink: "tint-content-fixed-dark",
    inkHover: "group-hover:tint-inverse-content",
  },
  white: {
    rest: "bg-control-surface text-control-ink",
    hover: "hover:bg-accent hover:text-content-fixed-dark",
    disabled: "bg-control-surface text-control-ink",
    ink: "tint-control-ink",
    inkHover: "group-hover:tint-content-fixed-dark",
  },
  grey: {
    rest: "bg-control-surface-active text-control-ink",
    hover: "hover:bg-accent hover:text-content-fixed-dark",
    disabled: "bg-control-surface-active text-control-ink",
    ink: "tint-control-ink",
    inkHover: "group-hover:tint-content-fixed-dark",
  },
  outline: {
    rest: "border border-border bg-transparent text-content",
    hover: "",
    disabled: "border border-border bg-transparent text-content",
    ink: "tint-content",
    inkHover: "",
  },
};

const roll: ViewStyle = { transitionProperty: "transform", transitionDuration: duration.roll, transitionTimingFunction: ease.standard };

/**
 * The Intent button: black, citrus, white, grey or outline, in four
 * heights, with a label, an icon and a label, or an icon. Under the pointer
 * it changes fill and rolls its content up while a copy rolls in from
 * below; an `icon-expand` button grows to show its label.
 */
export function Button(props: ButtonProps) {
  const hovered = signal(false);
  const size = () => props.size ?? "small";
  const color = () => props.color ?? "black";
  const variant = (): ButtonVariant => props.variant ?? (props.icon ? "text-icon" : "text");
  const h = () => heights[size()];
  const square = () => variant() === "icon" || size() === "extra-large";
  const expanded = () => variant() === "icon-expand" && hovered() && !props.disabled;
  const rolls = () => props.roll !== false && !props.disabled && !reduceMotion();
  // The copies that roll in wait below the button, clipped; Android neither
  // clips them nor has a pointer to hover with, so it goes without.
  const copies = platform.os !== "android";
  const fill = () => fills[color()];
  const shift = () => (rolls() ? `group-hover:-translate-y-[${h()}px]` : "");

  // The outline's 1 pt border is inside the button's height and fixed widths.
  const edge = () => (color() === "outline" ? 2 : 0);
  const frame = (): ViewStyle => {
    const base: ViewStyle = { height: h() - edge(), gap: variant() === "text-icon" ? 16 : 0 };
    if (square()) return { ...base, width: h() - edge(), justifyContent: "center" };
    if (variant() === "icon-expand") {
      const inset = (h() - iconSize) / 2;
      return { ...base, minWidth: h() - edge(), width: expanded() ? undefined : h() - edge(), paddingLeft: inset - edge() / 2, paddingRight: expanded() ? 20 : inset - edge() / 2, justifyContent: "flex-start" };
    }
    if (props.width != null) return { ...base, width: props.width - edge(), justifyContent: "center" };
    if (variant() === "text-icon" && size() === "large") return { ...base, paddingLeft: 25, paddingRight: 30, justifyContent: "center" };
    return { ...base, paddingHorizontal: paddings[size()], justifyContent: "center" };
  };

  const setHovered = (value: boolean) => {
    if (variant() === "icon-expand" && !props.disabled && !reduceMotion()) {
      LayoutAnimation.configureNext(LayoutAnimation.create(duration.color, "easeInEaseOut"));
    }
    hovered.set(value);
  };

  const glyph = () =>
    props.icon ? (
      <View class={`overflow-visible ${props.disabled ? "opacity-30" : ""}`} style={{ width: iconSize, height: iconSize }}>
        <View class={`transition-transform ${shift()}`} style={roll}>
          <Icon name={props.icon} class={`${fill().ink} ${props.disabled ? "" : fill().inkHover}`} />
        </View>
        {copies ? (
          <View class={`absolute left-0 transition-transform ${shift()}`} style={[roll, { top: h() }]} accessibilityElementsHidden>
            <Icon name={props.icon} class={`${fill().ink} ${props.disabled ? "" : fill().inkHover}`} />
          </View>
        ) : null}
      </View>
    ) : null;

  const label = () => (
    <View
      class={`overflow-visible ${props.disabled ? "opacity-30" : ""}`}
      style={variant() === "icon-expand" ? { marginLeft: 20, opacity: expanded() ? 1 : 0, transitionProperty: "opacity", transitionDuration: duration.fade } : undefined}
    >
      <Text class={`transition-transform ${shift()}`} style={[text.button, roll]} numberOfLines={1}>
        {props.label}
      </Text>
      {copies ? (
        <Text class={`absolute left-0 transition-transform ${shift()}`} style={[text.button, roll, { top: h() }]} numberOfLines={1} accessibilityElementsHidden>
          {props.label}
        </Text>
      ) : null}
    </View>
  );

  const tipped = () => square() && props.tooltip !== false && !props.disabled;
  return (
    <BaseButton
      testID={props.testID}
      disabled={props.disabled}
      accessibilityLabel={props.accessibilityLabel ?? (square() || variant() === "icon-expand" ? props.label : undefined)}
      class={[
        "group overflow-hidden focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-3",
        props.disabled && (color() === "black" || color() === "citrus") ? fill().disabled : fill().rest,
        props.disabled ? "" : fill().hover,
        props.class ?? "",
      ].join(" ")}
      style={[{ borderRadius: radii[size()], ...colorTransition }, props.style ?? null]}
      onPress={props.onPress}
    >
      <View
        class="flex items-center"
        style={frame()}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        // The tooltip is on this view: a `nsh/base` Button does not show one.
        tooltip={
          <Tooltip {...tooltipProps()} disabled={!tipped()}>
            <TooltipContent label={props.label} />
          </Tooltip>
        }
      >
        {variant() === "text" ? null : glyph()}
        {square() ? null : label()}
      </View>
    </BaseButton>
  );
}
