import type { StyleProp, ViewStyle } from "nsh";
import { signal, View } from "nsh";
import { Button as BaseButton, Tooltip } from "nsh/base";
import { CompactIcon, type IconName } from "./icon";
import { TooltipContent, tooltipProps } from "./tooltip";
import { radius } from "./tokens";

/** One action of a combo button. */
export interface ComboAction<V extends string = string> {
  /** What the app knows the action by. */
  value: V;
  /** What screen readers say, and the tooltip. */
  label: string;
  /** The glyph. */
  icon: IconName;
  /** No presses: the glyph fades. */
  disabled?: boolean;
}

/** The fill: grey, white, or dark (light in dark mode). */
export type ComboButtonColor = "grey" | "white" | "dark";

/** The height: 35 or 40. */
export type ComboButtonSize = "small" | "medium";

/** How actions show they are under the pointer: a fill with hairlines between them, or the others fading. */
export type ComboButtonVariant = "divider" | "simple";

export interface ComboButtonProps<V extends string = string> {
  /** The actions, two or three of them. */
  actions: ComboAction<V>[];
  /** The fill (default `grey`). */
  color?: ComboButtonColor;
  /** The height (default `medium`, 40). */
  size?: ComboButtonSize;
  /** The hover treatment (default `divider`). */
  variant?: ComboButtonVariant;
  /** Show each action's label in a tooltip (default true). */
  tooltips?: boolean;
  /** A height other than the size's, in points (a combo button inside a row). */
  height?: number;
  /** Finds the group in tests; each action is `<testID>-<value>`. */
  testID?: string;
  /** Extra Tailwind classes for the group. */
  class?: string;
  /** The inline style of the group. */
  style?: StyleProp<ViewStyle>;
  /** An action was pressed. */
  onPress?: (value: V) => void;
}

const fills: Record<ComboButtonColor, { surface: string; hover: string; ink: string; divider: string }> = {
  grey: { surface: "bg-control-surface-strong", hover: "hover:bg-combo-grey-hover", ink: "tint-control-ink", divider: "bg-border" },
  white: { surface: "bg-control-surface", hover: "hover:bg-control-edge", ink: "tint-control-ink", divider: "bg-border" },
  dark: { surface: "bg-combo-dark-surface", hover: "hover:bg-combo-dark-hover", ink: "tint-combo-dark-ink", divider: "bg-combo-dark-divider" },
};

/**
 * The Intent combo button: two or three icon actions joined in one
 * rounded pill, split by hairlines.
 */
export function ComboButton<V extends string = string>(props: ComboButtonProps<V>) {
  const hovered = signal<number | null>(null);
  const size = () => props.height ?? (props.size === "small" ? 35 : 40);
  const simple = () => props.variant === "simple";
  const fill = () => fills[props.color ?? "grey"];
  // A hairline shows left of an action unless it is the first, or either
  // side of it is under the pointer (divider variant).
  const showDivider = (i: number) => !simple() && i > 0 && hovered() !== i && hovered() !== i - 1;

  return (
    <View
      testID={props.testID}
      role="toolbar"
      class={`flex items-center self-start overflow-hidden ${fill().surface} ${props.class ?? ""}`}
      style={[{ height: size(), borderRadius: radius.m, paddingHorizontal: simple() ? 2 : 0 }, props.style ?? null]}
      onHoverOut={() => hovered.set(null)}
    >
      {props.actions.map((action, i) => (
        <BaseButton
          testID={props.testID ? `${props.testID}-${action.value}` : undefined}
          disabled={action.disabled}
          accessibilityLabel={action.label}
          class={`relative h-full items-center justify-center transition-colors duration-250 focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:-outline-offset-2 ${
            simple() || action.disabled ? "" : fill().hover
          }`}
          style={{ width: size() }}
          onPress={() => props.onPress?.(action.value)}
        >
          <View
            class="h-full items-center justify-center"
            style={{ width: size() }}
            onHoverIn={() => hovered.set(action.disabled ? null : i)}
            tooltip={
              <Tooltip {...tooltipProps()} disabled={props.tooltips === false || action.disabled}>
                <TooltipContent label={action.label} />
              </Tooltip>
            }
          >
            <View
              class={`absolute left-0 ${fill().divider} transition-opacity duration-250`}
              style={{ width: 1, height: 20, top: (size() - 20) / 2, opacity: showDivider(i) ? 1 : 0 }}
            />
            <View
              class="transition-opacity duration-250"
              style={{ opacity: action.disabled ? 0.3 : simple() && hovered() !== null && hovered() !== i ? 0.5 : 1 }}
            >
              <CompactIcon name={action.icon} class={fill().ink} />
            </View>
          </View>
        </BaseButton>
      ))}
    </View>
  );
}
