import type { JSX, StyleProp, ViewStyle } from "nsh";
import { Text, View } from "nsh";
import { radius } from "./tokens";

/** Who a message is from: the user, the assistant, or a quiet status line (feedback). */
export type ConversationRole = "user" | "assistant" | "feedback";

export interface ConversationMessageProps {
  /** Who it is from (default `assistant`). */
  role?: ConversationRole;
  /** The text; or give `children` for richer content. */
  text?: string;
  /** A one-line bubble: 40 pt tall, 10 pt vertical padding. */
  compact?: boolean;
  /** Finds the message in tests. */
  testID?: string;
  /** Extra Tailwind classes for the row. */
  class?: string;
  /** The inline style of the row. */
  style?: StyleProp<ViewStyle>;
  /** Content instead of `text`. */
  children?: JSX.Element;
}

/**
 * A message of an Intent conversation: the user's on a muted bubble at the
 * right, the assistant's in a hairline bubble at the left, feedback as a
 * small muted line.
 */
export function ConversationMessage(props: ConversationMessageProps) {
  const role = () => props.role ?? "assistant";
  const feedback = () => role() === "feedback";
  return (
    <View
      testID={props.testID}
      class={`w-full ${role() === "user" ? "items-end" : "items-start"} ${props.class ?? ""}`}
      style={[{ paddingRight: role() === "assistant" ? 20 : 0 }, props.style ?? null]}
    >
      <View
        class={role() === "user" ? "bg-app-surface-muted" : role() === "assistant" ? "border border-border" : ""}
        style={{
          maxWidth: feedback() ? "100%" : 360,
          padding: feedback() ? 0 : props.compact ? undefined : 20,
          paddingHorizontal: feedback() ? 0 : 20,
          paddingVertical: feedback() ? 0 : props.compact ? 10 : 20,
          minHeight: props.compact && !feedback() ? 40 : undefined,
          justifyContent: "center",
          borderRadius: radius.m,
        }}
      >
        {props.text != null ? (
          <Text
            class={feedback() ? "text-app-text-muted" : "text-app-text"}
            style={{ fontSize: feedback() ? 11 : 14, lineHeight: feedback() ? 14.3 : 18.2, fontWeight: "450" }}
          >
            {props.text}
          </Text>
        ) : (
          props.children
        )}
      </View>
    </View>
  );
}
