// The rows shared by `Dropdown` and `ContextMenu`: options, grouped by a
// hairline, with an optional glyph on the left or the right.

import { Text } from "nsh";
import { MenuItem, MenuSeparator } from "nsh/base";
import { CompactIcon, Icon, type IconName } from "./icon";
import { text } from "./tokens";

/** One choice of a menu. */
export interface MenuOption<V extends string = string> {
  /** What the app knows the option by. */
  value: V;
  /** What the row says. */
  label: string;
  /** The row's glyph, shown where the menu's `icon` side says. */
  icon?: IconName;
  /** Options with the same group sit together; a hairline separates consecutive groups. */
  group?: string;
  /** Not chosen: faded, no presses. */
  disabled?: boolean;
}

/** Where a menu shows its options' glyphs. */
export type MenuIconSide = "none" | "left" | "right";

/** The geometry of a menu's rows. */
export interface RowMetrics {
  height: number;
  inline: number;
  gap: number;
  radius: number;
}

/** The rows of a menu, with hairlines between groups. */
export function MenuRows<V extends string>(props: {
  options: MenuOption<V>[];
  metrics: RowMetrics;
  icon: MenuIconSide;
  /** The rows' glyphs: 12 px where the set has them (a dropdown) or 16 px (a context menu). */
  compact?: boolean;
  selected?: V | null;
  testID?: string;
  onSelect: (value: V) => void;
}) {
  const rows = () => {
    const out: { option: MenuOption<V>; divider: boolean }[] = [];
    props.options.forEach((option, i) => {
      out.push({ option, divider: i > 0 && option.group !== props.options[i - 1].group });
    });
    return out;
  };
  const glyph = (name: IconName) =>
    props.compact ? <CompactIcon name={name} class="tint-control-ink" /> : <Icon name={name} class="tint-control-ink" />;
  return (
    <>
      {rows().map(({ option, divider }) => (
        <>
          {divider ? <MenuSeparator class="bg-border" style={{ height: 1 }} /> : null}
          <MenuItem
            testID={props.testID ? `${props.testID}-${option.value}` : undefined}
            disabled={option.disabled}
            class={[
              "flex items-center hover:bg-control-surface-active focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:-outline-offset-2 disabled:opacity-30",
              option.value === props.selected ? "bg-control-surface-active" : "",
              props.icon === "right" && option.icon ? "justify-between" : "justify-start",
            ].join(" ")}
            style={{
              height: props.metrics.height,
              paddingHorizontal: props.metrics.inline,
              gap: props.metrics.gap,
              borderRadius: props.metrics.radius,
            }}
            onSelect={() => props.onSelect(option.value)}
          >
            {props.icon === "left" && option.icon ? glyph(option.icon) : null}
            <Text class="text-control-ink" style={[text.label, { lineHeight: 18.2 }]} numberOfLines={1}>
              {option.label}
            </Text>
            {props.icon === "right" && option.icon ? glyph(option.icon) : null}
          </MenuItem>
        </>
      ))}
    </>
  );
}

/** The menu surface: a light popup with a hairline edge and the elevated shadow. */
export const menuSurfaceClass = "bg-control-surface border border-border";

