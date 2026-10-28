import type { StyleProp, ViewStyle } from "nsh";
import { signal, Text, View } from "nsh";
import { Button as BaseButton } from "nsh/base";
import { ComboButton, type ComboAction } from "./combo-button";
import { radius, text } from "./tokens";

/** A link of a side navigation. */
export interface SideNavItem<V extends string = string> {
  /** What the app knows the destination by. */
  value: V;
  /** What the link says. */
  label: string;
}

/** A group of links under an eyebrow heading. */
export interface SideNavGroup<V extends string = string> {
  /** The uppercase heading above the links (none: no heading). */
  title?: string;
  /** The links. */
  items: SideNavItem<V>[];
}

/** How links show: plain, numbered (`01.`), or rows with actions that appear under the pointer. */
export type SideNavVariant = "simple" | "itemized" | "actions";

/** The fill of the current and hovered link: the surface, or the grey of active controls. */
export type SideNavColor = "white" | "grey";

/** The width of the links: as wide as their text, or as wide as the navigation. */
export type SideNavWidth = "hug" | "fixed";

export interface SideNavProps<V extends string = string, A extends string = string> {
  /** The groups of links. */
  groups: SideNavGroup<V>[];
  /** The current destination; the app owns it and sets it in `onChange`. */
  value?: V | null;
  /** How links show (default `simple`). */
  variant?: SideNavVariant;
  /** The fill of the current and hovered link (default `white`). */
  color?: SideNavColor;
  /** Hugging the text, or the full width (default `hug`; `actions` rows are always full width). */
  width?: SideNavWidth;
  /** The actions of `actions` rows, shown at the right of the row under the pointer. */
  actions?: ComboAction<A>[];
  /** Finds the navigation in tests; each link is `<testID>-<value>`. */
  testID?: string;
  /** Extra Tailwind classes for the navigation. */
  class?: string;
  /** The inline style of the navigation. */
  style?: StyleProp<ViewStyle>;
  /** A link was pressed. */
  onChange?: (value: V) => void;
  /** An action of a row was pressed: the row's value and the action's. */
  onAction?: (value: V, action: A) => void;
}

/**
 * The Intent side navigation: eyebrow headings over lists of links, the
 * current one on a soft fill; numbered, or as rows with actions.
 */
export function SideNav<V extends string = string, A extends string = string>(props: SideNavProps<V, A>) {
  const hovered = signal<V | null>(null);
  const variant = () => props.variant ?? "simple";
  const active = () => (props.color === "grey" ? "bg-control-surface-active" : "bg-surface");
  const hover = () => (props.color === "grey" ? "hover:bg-control-surface-active" : "hover:bg-surface");
  // The number of the first link of each group (numbers run across groups).
  const firsts = () => {
    let next = 1;
    return props.groups.map((group) => {
      const first = next;
      next += group.items.length;
      return first;
    });
  };

  const link = (item: SideNavItem<V>, index: number) => {
    const current = () => item.value === props.value;
    if (variant() === "actions") {
      return (
        <View class="relative w-full" style={{ height: 40 }} onHoverIn={() => hovered.set(item.value)} onHoverOut={() => hovered.set(null)}>
          <BaseButton
            testID={props.testID ? `${props.testID}-${item.value}` : undefined}
            role="link"
            selected={current()}
            class={`flex w-full h-full items-center transition-colors duration-160 focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:-outline-offset-2 ${hover()} ${current() ? active() : ""}`}
            style={{ paddingHorizontal: 15, borderRadius: radius.m }}
            onPress={() => props.onChange?.(item.value)}
          >
            <Text class="text-content" style={[text.label, { lineHeight: 14, letterSpacing: 0 }]} numberOfLines={1}>
              {item.label}
            </Text>
          </BaseButton>
          {props.actions && props.actions.length > 0 ? (
            <View
              class="absolute transition-opacity duration-150"
              style={{ top: 2, right: 2, opacity: hovered() === item.value ? 1 : 0 }}
              pointerEvents={hovered() === item.value ? "auto" : "none"}
            >
              <ComboButton
                actions={props.actions}
                height={36}
                style={{ borderRadius: radius.m - 2 }}
                onPress={(action) => props.onAction?.(item.value, action)}
              />
            </View>
          ) : null}
        </View>
      );
    }
    return (
      <BaseButton
        testID={props.testID ? `${props.testID}-${item.value}` : undefined}
        role="link"
        selected={current()}
        class={[
          "flex items-center transition-colors duration-160 focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:-outline-offset-2",
          hover(),
          current() ? active() : "",
          props.width === "fixed" ? "w-full" : "self-start",
        ].join(" ")}
        // The link hangs out by its inset, its text in line with the group's title.
        style={{ minHeight: 34, marginLeft: -14, paddingLeft: 14, paddingRight: variant() === "itemized" ? 30 : 14, borderRadius: 14, gap: variant() === "itemized" ? 10 : 0 }}
        onPress={() => props.onChange?.(item.value)}
      >
        {variant() === "itemized" ? (
          <Text class="text-content" style={[text.label, { width: 30, lineHeight: 14, letterSpacing: 0 }]}>
            {`${String(index).padStart(2, "0")}.`}
          </Text>
        ) : null}
        <Text class="text-content" style={[text.label, { lineHeight: 14, letterSpacing: 0 }]} numberOfLines={1}>
          {item.label}
        </Text>
      </BaseButton>
    );
  };

  return (
    <View testID={props.testID} role="list" class={props.class} style={[{ gap: 30 }, props.style ?? null]}>
      {props.groups.map((group, g) => (
        <View>
          {group.title ? (
            <Text class="text-content-muted" style={[text.eyebrow, { lineHeight: 12.1, marginBottom: 10 }]}>
              {group.title}
            </Text>
          ) : null}
          {group.items.map((item, i) => link(item, firsts()[g] + i))}
        </View>
      ))}
    </View>
  );
}
