import type { ImageAsset, StyleProp, ViewStyle } from "nsh";
import { Image, LayoutAnimation, reduceMotion, Text, View } from "nsh";
import { Icon, type IconName } from "./icon";
import { radius, text } from "./tokens";

/** One model of a model switcher. */
export interface ModelOption<V extends string = string> {
  /** What the app knows the model by. */
  value: V;
  /** Its name, shown on the selected option and said by screen readers. */
  label: string;
  /** Its mark: a glyph of the icon set, or an image (a brand's single-color logo, tinted). */
  icon: IconName | ImageAsset;
}

/** The fill of the options that are not selected. */
export type ModelSwitcherColor = "grey" | "white";

export interface ModelSwitcherProps<V extends string = string> {
  /** The models, two or three. */
  options: ModelOption<V>[];
  /** The selected model; the app owns it and sets it in `onChange`. */
  value: V;
  /** The fill of the other options (default `grey`). */
  color?: ModelSwitcherColor;
  /** What screen readers call the group (default "Model"). */
  accessibilityLabel?: string;
  /** Finds the group in tests; each option is `<testID>-<value>`. */
  testID?: string;
  /** Extra Tailwind classes for the group. */
  class?: string;
  /** The inline style of the group. */
  style?: StyleProp<ViewStyle>;
  /** An option was pressed. */
  onChange?: (value: V) => void;
}

/**
 * The Intent model switcher: square 60 pt marks side by side; the selected
 * one turns citrus and widens to show its name.
 */
export function ModelSwitcher<V extends string = string>(props: ModelSwitcherProps<V>) {
  const select = (value: V) => {
    if (value === props.value) return;
    if (!reduceMotion()) LayoutAnimation.configureNext(LayoutAnimation.create(300, "easeInEaseOut"));
    props.onChange?.(value);
  };
  return (
    <View
      testID={props.testID}
      role="radiogroup"
      accessibilityLabel={props.accessibilityLabel ?? "Model"}
      class={`flex self-start ${props.class ?? ""}`}
      style={[{ gap: 2, height: 60 }, props.style ?? null]}
    >
      {props.options.map((option) => {
        const selected = () => option.value === props.value;
        const tint = () => (selected() ? "tint-content-fixed-dark" : "tint-control-ink");
        return (
          <View
            testID={props.testID ? `${props.testID}-${option.value}` : undefined}
            role="radio"
            accessibilityState={{ checked: selected() }}
            accessibilityLabel={option.label}
            class={`flex items-center justify-center overflow-hidden transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:-outline-offset-2 ${
              selected() ? "bg-accent" : props.color === "white" ? "bg-control-surface" : "bg-control-surface-active"
            }`}
            style={{ width: selected() ? 126 : 60, height: 60, borderRadius: radius.l, transitionTimingFunction: "cubic-bezier(0.6, 0, 0.1, 1)" }}
            onPress={() => select(option.value)}
          >
            {typeof option.icon === "string" ? (
              <Icon name={option.icon as IconName} class={tint()} />
            ) : (
              <Image src={option.icon} class={tint()} style={{ width: 16, height: 16 }} />
            )}
            {selected() ? (
              <Text class="text-content-fixed-dark" style={[text.button, { marginLeft: 10, maxWidth: 66 }]} numberOfLines={1}>
                {option.label}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
