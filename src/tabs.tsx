import type { StyleProp, ViewStyle } from "nsh";
import { reduceMotion, Text, View } from "nsh";
import { Tab, Tabs as BaseTabs } from "nsh/base";
import { Icon, type IconName } from "./icon";
import { duration, ease, radius, text } from "./tokens";

/** One tab of a `Tabs` control. */
export interface TabItem<V extends string = string> {
  /** What the app knows the tab by. */
  value: V;
  /** The label; for icon tabs what screen readers say. */
  label: string;
  /** The glyph of icon tabs. */
  icon?: IconName;
  /** No presses. */
  disabled?: boolean;
}

/** The height of a tabs control: 40 or 60. */
export type TabsSize = "small" | "large";

/** The colors: a muted track with a light tab, a light track with a dark tab, or a light track with a grey tab. */
export type TabsColor = "grey" | "white-dark" | "white-grey";

/** What the tabs show: labels or icons. */
export type TabsVariant = "text" | "icon";

export interface TabsProps<V extends string = string> {
  /** The tabs, in order. */
  items: TabItem<V>[];
  /** The selected tab's value; the app owns it and sets it in `onChange`. */
  value: V;
  /** The height (default `small`). */
  size?: TabsSize;
  /** The colors (default `grey`). */
  color?: TabsColor;
  /** Labels or icons (default `text`). */
  variant?: TabsVariant;
  /** The width in points (default: the system's width for the size, variant and count; tabs share it equally). */
  width?: number;
  /** Finds the tab list in tests; each tab is `<testID>-<value>`. */
  testID?: string;
  /** Extra Tailwind classes for the track. */
  class?: string;
  /** The inline style of the track. */
  style?: StyleProp<ViewStyle>;
  /** A tab was pressed: its value. */
  onChange?: (value: V) => void;
}

const heights: Record<TabsSize, number> = { small: 40, large: 60 };
const radii: Record<TabsSize, number> = { small: radius.m, large: radius.l };
const itemRadii: Record<TabsSize, number> = { small: 13, large: 18 };

// The widths of the system's tabs for two and three tabs; beyond three
// each tab keeps the three-tab share.
const widths: Record<TabsVariant, Record<TabsSize, [number, number]>> = {
  text: { small: [204, 304], large: [284, 320] },
  icon: { small: [94, 139], large: [140, 184] },
};

const colors: Record<TabsColor, { track: string; indicator: string; selected: string; tint: string }> = {
  grey: { track: "bg-control-surface-muted", indicator: "bg-control-surface", selected: "text-control-ink", tint: "tint-control-ink" },
  "white-dark": { track: "bg-control-surface", indicator: "bg-inverse-surface", selected: "text-inverse-content", tint: "tint-inverse-content" },
  "white-grey": { track: "bg-control-surface", indicator: "bg-control-surface-strong", selected: "text-control-ink", tint: "tint-control-ink" },
};

/** The default width of a tabs control. */
function defaultWidth(variant: TabsVariant, size: TabsSize, count: number): number {
  const [two, three] = widths[variant][size];
  if (count <= 2) return count === 2 ? two : (two - 4) / 2 + 4;
  return ((three - 4) / 3) * count + 4;
}

/**
 * The Intent tabs: a rounded track whose selected tab is a lighter (or
 * darker) pill that slides to the tab pressed.
 */
export function Tabs<V extends string = string>(props: TabsProps<V>) {
  const size = () => props.size ?? "small";
  const variant = () => props.variant ?? "text";
  const color = () => colors[props.color ?? "grey"];
  const width = () => props.width ?? defaultWidth(variant(), size(), props.items.length);
  const itemWidth = () => (width() - 4) / Math.max(props.items.length, 1);
  const index = () => Math.max(0, props.items.findIndex((item) => item.value === props.value));

  return (
    <BaseTabs
      testID={props.testID}
      class={`flex relative ${color().track} ${props.class ?? ""}`}
      style={[{ width: width(), height: heights[size()], borderRadius: radii[size()], padding: 2 }, props.style ?? null]}
    >
      <View
        class={`absolute ${color().indicator}`}
        style={{
          top: 2,
          bottom: 2,
          left: 2,
          width: itemWidth(),
          borderRadius: itemRadii[size()],
          transform: [{ translateX: index() * itemWidth() }],
          transitionProperty: "transform, background-color",
          transitionDuration: reduceMotion() ? 0 : duration.slide,
          transitionTimingFunction: ease.out,
        }}
      />
      {props.items.map((item) => {
        const selected = () => item.value === props.value;
        return (
          <Tab
            testID={props.testID ? `${props.testID}-${item.value}` : undefined}
            selected={selected()}
            disabled={item.disabled}
            accessibilityLabel={variant() === "icon" ? item.label : undefined}
            class="flex-1 h-full items-center justify-center disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:-outline-offset-2"
            style={{ borderRadius: itemRadii[size()], minWidth: 0 }}
            onPress={() => props.onChange?.(item.value)}
          >
            {variant() === "icon" && item.icon ? (
              <Icon name={item.icon} class={selected() ? color().tint : "tint-control-ink"} />
            ) : (
              <Text
                class={selected() ? color().selected : "text-control-ink"}
                style={[text.label, { transitionProperty: "color", transitionDuration: 250 }]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            )}
          </Tab>
        );
      })}
    </BaseTabs>
  );
}
