import type { JSX } from "nsh";
import { Checkbox as BaseCheckbox } from "nsh/base";
import { Icon } from "./icon";
import { radius } from "./tokens";

/** The size of a checkbox: 20 or 15 points. */
export type CheckboxSize = "medium" | "small";

export interface CheckboxProps {
  /** Checked or not; the app owns it and sets it in `onChange`. */
  checked: boolean;
  /** Neither (a "select all" over part of a selection), over `checked` while it holds. */
  indeterminate?: boolean;
  /** The size (default `medium`, 20 points). */
  size?: CheckboxSize;
  /** No presses: a muted box with a faint mark. */
  disabled?: boolean;
  /** What screen readers say, when the children carry no text. */
  accessibilityLabel?: string;
  /** Finds the checkbox in tests. */
  testID?: string;
  /** Extra Tailwind classes for the checkbox. */
  class?: string;
  /** A label after the box. */
  children?: JSX.Element;
  /** The checkbox asks for a value: `true` from unchecked or indeterminate. */
  onChange?: (checked: boolean) => void;
}

/**
 * The Intent checkbox: a light box with a hairline edge that fills citrus
 * with a dark check (or a dash, indeterminate).
 */
export function Checkbox(props: CheckboxProps) {
  const box = () => (props.size === "small" ? 15 : 20);
  const marked = () => props.checked || props.indeterminate;
  return (
    <BaseCheckbox
      checked={props.checked}
      indeterminate={props.indeterminate}
      disabled={props.disabled}
      accessibilityLabel={props.accessibilityLabel}
      testID={props.testID}
      class={`flex items-center gap-2.5 ${props.class ?? ""}`}
      indicatorClass={[
        "items-center justify-center transition-colors duration-180 focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-3",
        props.disabled ? "bg-control-surface-muted border border-transparent" : marked() ? "bg-accent border border-transparent" : "bg-control-surface border border-control-edge",
      ].join(" ")}
      indicatorStyle={{ width: box(), height: box(), borderRadius: radius.xs }}
      indicator={
        marked() ? (
          <Icon
            name={props.indeterminate ? "disabled-small" : "check-small"}
            size={12}
            class={props.disabled ? "tint-control-ink opacity-15" : "tint-content-fixed-dark"}
          />
        ) : undefined
      }
      onChange={props.onChange}
    >
      {props.children}
    </BaseCheckbox>
  );
}
