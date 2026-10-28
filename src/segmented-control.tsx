import type { StyleProp, ViewStyle } from "nsh";
import { Text, View } from "nsh";
import { text } from "./tokens";

/** One segment of a segmented control. */
export interface Segment<V extends string = string> {
  /** What the app knows the segment by. */
  value: V;
  /** What the segment says. */
  label: string;
  /** No presses. */
  disabled?: boolean;
}

export interface SegmentedControlProps<V extends string = string> {
  /** The segments, in order. */
  segments: Segment<V>[];
  /** The pressed segment; the app owns it and sets it in `onChange`. */
  value: V;
  /** What screen readers call the group. */
  accessibilityLabel?: string;
  /** Finds the group in tests; each segment is `<testID>-<value>`. */
  testID?: string;
  /** Extra Tailwind classes for the group. */
  class?: string;
  /** The inline style of the group. */
  style?: StyleProp<ViewStyle>;
  /** A segment was pressed. */
  onChange?: (value: V) => void;
}

/**
 * The segmented control of Intent's application surfaces: a frosted pill
 * of 40 pt segments, the pressed one inverted.
 */
export function SegmentedControl<V extends string = string>(props: SegmentedControlProps<V>) {
  return (
    <View
      testID={props.testID}
      role="radiogroup"
      accessibilityLabel={props.accessibilityLabel}
      class={`flex self-start bg-app-surface backdrop-blur-[7.5px] ${props.class ?? ""}`}
      style={[{ padding: 2, borderRadius: 15 }, props.style ?? null]}
    >
      {props.segments.map((segment) => {
        const pressed = () => segment.value === props.value;
        return (
          <View
            testID={props.testID ? `${props.testID}-${segment.value}` : undefined}
            role="radio"
            accessibilityState={{ checked: pressed() }}
            disabled={segment.disabled}
            class={`items-center justify-center px-4 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:-outline-offset-2 ${
              pressed() ? "bg-app-text" : "bg-transparent"
            }`}
            style={{ minWidth: 100, height: 40, borderRadius: 13 }}
            onPress={() => props.onChange?.(segment.value)}
          >
            <Text class={pressed() ? "text-app-surface" : "text-app-text"} style={text.label} numberOfLines={1}>
              {segment.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
