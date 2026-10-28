import type { StyleProp, ViewStyle } from "nsh";
import { Text, View } from "nsh";
import { Input } from "nsh/base";
import { Icon, type IconName } from "./icon";
import { IconControl } from "./icon-control";
import { radius, text } from "./tokens";

/** The height of a field: 40 or 60. */
export type FormFieldSize = "small" | "medium";

/** The fill: grey, white, or a hairline outline. */
export type FormFieldColor = "grey" | "white" | "outline";

export interface FormFieldProps {
  /** The text; the app owns it and sets it in `onChange`. */
  value: string;
  /** What the field shows while empty. */
  placeholder?: string;
  /** The height (default `small`, 40). */
  size?: FormFieldSize;
  /** The fill (default `white`). */
  color?: FormFieldColor;
  /** A glyph at the right while the field is empty (none: no glyph). */
  icon?: IconName;
  /** A control at the right that clears the text while there is some (default: when `icon` is set). */
  clearable?: boolean;
  /** What is wrong: the edge turns red and the message shows below. */
  error?: string | null;
  /** No typing; the field fades to 30%. */
  disabled?: boolean;
  /** Hides the characters (a password). */
  masked?: boolean;
  /** Focus the field when it shows. */
  autoFocus?: boolean;
  /** The width (default 240). */
  width?: number;
  /** What screen readers call the field (default: the placeholder). */
  accessibilityLabel?: string;
  /** Finds the input in tests. */
  testID?: string;
  /** Extra Tailwind classes for the field. */
  class?: string;
  /** The inline style of the field. */
  style?: StyleProp<ViewStyle>;
  /** The text changed. */
  onChange?: (value: string) => void;
  /** Return was pressed. */
  onSubmit?: (value: string) => void;
}

const metrics: Record<FormFieldSize, { height: number; inline: number; radius: number; gap: number }> = {
  small: { height: 40, inline: 15, radius: radius.m, gap: 10 },
  medium: { height: 60, inline: 25, radius: radius.l, gap: 15 },
};

const fills: Record<FormFieldColor, string> = {
  white: "bg-control-surface border-transparent",
  grey: "bg-control-surface-active border-transparent",
  outline: "bg-transparent border-border-strong",
};

/**
 * The Intent form field: a filled (or outlined) single-line input with an
 * optional glyph that becomes a clear control once there is text, and an
 * error message below.
 */
export function FormField(props: FormFieldProps) {
  const m = () => metrics[props.size ?? "small"];
  const clearable = () => props.clearable ?? props.icon != null;
  const filled = () => props.value.length > 0;

  return (
    <View class={`${props.disabled ? "opacity-30" : ""} ${props.class ?? ""}`} style={[{ width: props.width ?? 240 }, props.style ?? null]}>
      <View
        class={`flex items-center border ${fills[props.color ?? "white"]} ${props.error ? "border-accent-alert" : ""}`}
        style={{ height: m().height, paddingHorizontal: m().inline - 1, borderRadius: m().radius, gap: 15 }}
      >
        <Input
          testID={props.testID}
          value={props.value}
          placeholder={props.placeholder}
          masked={props.masked}
          autoFocus={props.autoFocus}
          readonly={props.disabled}
          accessibilityLabel={props.accessibilityLabel ?? props.placeholder}
          class="flex-1 text-control-ink placeholder:text-content-muted"
          style={[text.label, { lineHeight: 16.8, minWidth: 0 }]}
          onChange={(value: string) => props.onChange?.(value)}
          onSubmit={(e: { text: string }) => props.onSubmit?.(e.text)}
        />
        {clearable() && filled() && !props.disabled ? (
          <IconControl icon="close" label="Clear field" onPress={() => props.onChange?.("")} />
        ) : props.icon ? (
          <Icon name={props.icon} class="tint-control-ink" />
        ) : null}
      </View>
      {props.error ? (
        <View class="flex items-center" style={{ marginTop: m().gap, gap: 8 }} role="alert">
          <Icon name="attention-circle" size={12} class="tint-accent-alert" />
          <Text class="text-content" style={[text.message, { lineHeight: 13, letterSpacing: -0.2 }]}>
            {props.error}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
