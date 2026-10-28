import type { JSX, StyleProp, ViewStyle } from "nsh";
import { View } from "nsh";
import { radius } from "./tokens";

export interface ApplicationSurfaceProps {
  /** The corner radius (default 20, `radius.l`). */
  radius?: number;
  /** Clip the content to the corners (default true). */
  clip?: boolean;
  /** Pressing the surface does something (it becomes a button for screen readers and the keyboard). */
  onPress?: () => void;
  /** What screen readers say, for a pressable surface. */
  accessibilityLabel?: string;
  /** Finds the surface in tests. */
  testID?: string;
  /** Extra Tailwind classes. */
  class?: string;
  /** The inline style. */
  style?: StyleProp<ViewStyle>;
  /** The content. */
  children?: JSX.Element;
}

/**
 * The panel of an Intent application window: a light (dark in dark mode)
 * rounded surface on a faint shadow.
 */
export function ApplicationSurface(props: ApplicationSurfaceProps) {
  return (
    <View
      testID={props.testID}
      role={props.onPress ? "button" : undefined}
      accessibilityLabel={props.accessibilityLabel}
      onPress={props.onPress}
      class={`bg-app-surface shadow-[0_10px_20px] shadow-app-shadow ${props.clip === false ? "" : "overflow-hidden"} ${
        props.onPress ? "focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-3" : ""
      } ${props.class ?? ""}`}
      style={[{ borderRadius: props.radius ?? radius.l }, props.style ?? null]}
    >
      {props.children}
    </View>
  );
}
