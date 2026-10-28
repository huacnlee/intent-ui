import { Button as BaseButton } from "nsh/base";
import { Icon, type IconName } from "./icon";

export interface IconControlProps {
  /** The glyph. */
  icon: IconName;
  /** What screen readers say. */
  label: string;
  /** A Tailwind tint class for the glyph (default `tint-control-ink`). */
  tint?: string;
  /** No presses: the glyph fades. */
  disabled?: boolean;
  /** Finds the control in tests. */
  testID?: string;
  /** Extra Tailwind classes. */
  class?: string;
  /** It was pressed. */
  onPress?: () => void;
}

/**
 * A bare glyph that presses (clearing a field, closing a panel): no fill,
 * only a focus ring when reached by the keyboard.
 */
export function IconControl(props: IconControlProps) {
  return (
    <BaseButton
      testID={props.testID}
      disabled={props.disabled}
      accessibilityLabel={props.label}
      class={`items-center justify-center rounded-(--radius-xs) disabled:opacity-30 active:opacity-60 focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-3 ${props.class ?? ""}`}
      onPress={props.onPress}
    >
      <Icon name={props.icon} class={props.tint ?? "tint-control-ink"} />
    </BaseButton>
  );
}
