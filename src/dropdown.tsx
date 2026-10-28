import type { StyleProp, ViewStyle } from "nsh";
import { reduceMotion, signal, Text, View } from "nsh";
import { Menu } from "nsh/base";
import { Icon } from "./icon";
import { menuSurfaceClass, MenuRows, type MenuIconSide, type MenuOption, type RowMetrics } from "./menu-parts";
import { radius, shadowElevated, text } from "./tokens";

export type { MenuIconSide, MenuOption } from "./menu-parts";

/** The height of a dropdown and its rows: 35, 40 or 60. */
export type DropdownSize = "s" | "m" | "l";

/** The padding around a dropdown's rows: 5 (tight) or 10. */
export type DropdownMargin = "tight" | "default";

/** Where the menu opens: below the trigger, above it, or centered over it. */
export type DropdownPlacement = "bottom" | "top" | "center";

/** The trigger's fill. */
export type DropdownColor = "grey" | "white";

export interface DropdownProps<V extends string = string> {
  /** The choices. */
  options: MenuOption<V>[];
  /** The chosen value, shown on the trigger; the app owns it and sets it in `onChange`. */
  value?: V | null;
  /** What the trigger says while nothing is chosen. */
  placeholder?: string;
  /** The height of the trigger and rows (default `m`, 40). */
  size?: DropdownSize;
  /** The padding around the rows (default `default`, 10). */
  margin?: DropdownMargin;
  /** The trigger's fill (default `grey`). */
  color?: DropdownColor;
  /** Where the menu opens (default `bottom`, 5 pt below). */
  placement?: DropdownPlacement;
  /** Where the options' glyphs go (default `none`). */
  icon?: MenuIconSide;
  /** The width of the trigger and menu (default 180). */
  width?: number;
  /** No presses: the trigger fades. */
  disabled?: boolean;
  /** Open (controlled). Without it the dropdown keeps its own state. */
  open?: boolean;
  /** It opened or closed. */
  onOpenChange?: (open: boolean) => void;
  /** What screen readers say about the trigger (default: its text). */
  accessibilityLabel?: string;
  /** Finds the trigger in tests; each option is `<testID>-<value>`. */
  testID?: string;
  /** Extra Tailwind classes for the trigger. */
  class?: string;
  /** The inline style of the trigger. */
  style?: StyleProp<ViewStyle>;
  /** An option was chosen. */
  onChange?: (value: V) => void;
}

const triggers: Record<DropdownSize, { height: number; inline: number; radius: number }> = {
  s: { height: 35, inline: 15, radius: radius.m },
  m: { height: 40, inline: 20, radius: radius.m },
  l: { height: 60, inline: 25, radius: radius.l },
};

const rows: Record<DropdownSize, RowMetrics> = {
  s: { height: 35, inline: 10, gap: 10, radius: radius.s },
  m: { height: 40, inline: 15, gap: 15, radius: radius.s },
  l: { height: 60, inline: 20, gap: 15, radius: radius.m },
};

/**
 * The Intent dropdown: a filled trigger with the chosen option and a
 * chevron that turns over while a light, elevated menu of options is open.
 */
export function Dropdown<V extends string = string>(props: DropdownProps<V>) {
  const own = signal(false);
  const open = () => props.open ?? own();
  const size = () => props.size ?? "m";
  const width = () => props.width ?? 180;
  const pad = () => (props.margin === "tight" ? 5 : 10);
  const menuRadius = () => (props.margin === "tight" && size() !== "l" ? radius.m : radius.l);
  const current = () => props.options.find((option) => option.value === props.value);

  // The menu's height, for the placement centered over the trigger.
  const menuHeight = () => {
    let dividers = 0;
    props.options.forEach((option, i) => {
      if (i > 0 && option.group !== props.options[i - 1].group) dividers++;
    });
    return pad() * 2 + props.options.length * rows[size()].height + dividers + 2;
  };
  const placement = () => props.placement ?? "bottom";
  const offset = () => (placement() === "center" ? -(triggers[size()].height + menuHeight()) / 2 : 5);

  const setOpen = (value: boolean) => {
    own.set(value);
    props.onOpenChange?.(value);
  };

  return (
    <Menu
      open={open()}
      placement={placement() === "top" ? "top" : "bottom"}
      align="start"
      offset={offset()}
      popupClass={menuSurfaceClass}
      popupStyle={{ width: width(), padding: pad(), borderRadius: menuRadius(), boxShadow: shadowElevated }}
      onOpenChange={(value) => setOpen(value)}
      trigger={
        <View
          testID={props.testID}
          role="combobox"
          disabled={props.disabled}
          accessibilityLabel={props.accessibilityLabel}
          accessibilityState={{ expanded: open() }}
          class={[
            "flex items-center justify-between disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2",
            props.color === "white" ? "bg-control-surface" : "bg-control-surface-active",
            props.class ?? "",
          ].join(" ")}
          style={[
            { width: width(), height: triggers[size()].height, paddingHorizontal: triggers[size()].inline, borderRadius: triggers[size()].radius },
            props.style ?? null,
          ]}
        >
          <Text class="text-control-ink" style={[text.label, { lineHeight: 16.8 }]} numberOfLines={1}>
            {current()?.label ?? props.placeholder ?? ""}
          </Text>
          <View
            style={{
              transform: [{ rotate: open() ? "180deg" : "0deg" }],
              transitionProperty: "transform",
              transitionDuration: reduceMotion() ? 0 : 160,
              transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
            }}
          >
            <Icon name="chevron-down" size={12} class="tint-control-ink" />
          </View>
        </View>
      }
    >
      <MenuRows
        compact
        options={props.options}
        metrics={rows[size()]}
        icon={props.icon ?? "none"}
        selected={props.value}
        testID={props.testID}
        onSelect={(value) => props.onChange?.(value)}
      />
    </Menu>
  );
}
