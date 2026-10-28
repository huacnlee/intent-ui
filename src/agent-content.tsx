import type { StyleProp, ViewStyle } from "nsh";
import { Image, Text, View } from "nsh";
import { Button as BaseButton } from "nsh/base";
import check from "./assets/spec-check.svg";
import { Icon, type IconName } from "./icon";

/** A step of an agent's activity log. */
export type ActivityStep =
  /** A tool the agent is using, its glyph in the gutter (`hold` for a command, `thinking` for reasoning). */
  | { kind: "activity"; icon: IconName; text: string }
  /** The agent's prose; `[label](url)` reads as a link. */
  | { kind: "text"; text: string }
  /** A heading in the agent's report. */
  | { kind: "title"; text: string }
  /** A line and the bullets under it. */
  | { kind: "list"; text: string; items: string[] };

export interface AgentActivityProps {
  /** The steps, in order. */
  steps: ActivityStep[];
  /** How many steps show, from the first (default all): an app reveals them as the agent works. */
  revealed?: number;
  /** Finds the log in tests. */
  testID?: string;
  /** Extra Tailwind classes. */
  class?: string;
  /** The inline style. */
  style?: StyleProp<ViewStyle>;
  /** A link was pressed: its url. */
  onLink?: (url: string) => void;
}

const line = { fontSize: 13.5, lineHeight: 17.55, fontWeight: "450" } as const;

// The space above each step, after the step before it, as intentapp.dev
// sets the agent's report.
function gap(step: ActivityStep, before: ActivityStep | undefined) {
  if (!before) return 0;
  if (step.kind === "activity") return before.kind === "text" ? 10 : before.kind === "activity" && before.icon === step.icon && step.icon !== "hold" ? 16 : 14;
  if (step.kind === "title") return 19;
  if (step.kind === "text" && before.kind === "list") return 16;
  return 18;
}

// Prose with `[label](url)` links.
function Linked(props: { text: string; onLink?: (url: string) => void }) {
  const parts = () => props.text.split(/(\[[^\]]+\]\([^)]+\))/);
  return (
    <Text class="text-app-text-muted" style={line}>
      {parts().map((part) => {
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        return link ? (
          <Text class="text-app-text underline" role="link" onPress={() => props.onLink?.(link[2])}>
            {link[1]}
          </Text>
        ) : (
          part
        );
      })}
    </Text>
  );
}

/**
 * An agent's activity log, as the Intent app shows it while the agent works:
 * muted lines, each tool's glyph out in the gutter, a heading for its report,
 * lists and links in its prose. `revealed` shows the steps as they come.
 */
export function AgentActivity(props: AgentActivityProps) {
  const shown = () => props.steps.slice(0, props.revealed ?? props.steps.length);
  return (
    <View testID={props.testID} class={props.class} style={[{ paddingTop: 24, paddingLeft: 26 }, props.style ?? null]}>
      {shown().map((step, i) => {
        const marginTop = gap(step, props.steps[i - 1]);
        if (step.kind === "activity") {
          return (
            <View style={{ marginTop }}>
              <Icon name={step.icon} class="tint-app-text-muted absolute" style={{ left: -24.7, top: 0.8 }} />
              <Text class="text-app-text-muted" style={line}>
                {step.text}
              </Text>
            </View>
          );
        }
        if (step.kind === "title") {
          return (
            <Text class="text-app-text" role="header" style={{ marginTop, fontSize: 15, lineHeight: 18, fontWeight: "500" }}>
              {step.text}
            </Text>
          );
        }
        if (step.kind === "list") {
          return (
            <View style={{ marginTop }}>
              <Linked text={step.text} onLink={props.onLink} />
              {step.items.map((item) => (
                <View class="flex flex-row" style={{ paddingLeft: 8 }}>
                  <Text class="text-app-text-muted" style={[line, { width: 11.5 }]}>
                    •
                  </Text>
                  <Text class="text-app-text-muted" style={[line, { flex: 1 }]}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          );
        }
        return (
          <View style={{ marginTop }}>
            <Linked text={step.text} onLink={props.onLink} />
          </View>
        );
      })}
    </View>
  );
}

/** An item of a spec's checklist. */
export interface SpecItem {
  text: string;
  done?: boolean;
}

export interface SpecDocumentProps {
  /** The paragraph that opens the spec. */
  intro?: string;
  /** The checklist's heading (default "Fidelity Checklist"). */
  title?: string;
  /** The checklist. */
  items: SpecItem[];
  /** Finds the spec in tests; each box is `<testID>-<index>`. */
  testID?: string;
  /** Extra Tailwind classes. */
  class?: string;
  /** The inline style. */
  style?: StyleProp<ViewStyle>;
  /** A box was pressed: its index and the value asked for. Without it the boxes are only shown. */
  onToggle?: (index: number, done: boolean) => void;
}

const body = { fontSize: 13.5, lineHeight: 18.9 } as const;

/**
 * A spec the agent works to, as the Intent app shows it: a paragraph, then a
 * checklist under its heading, each item's box white with a faint ring, or
 * citrus with a bold check once done.
 */
export function SpecDocument(props: SpecDocumentProps) {
  const box = (done: boolean) => (
    <View
      class={done ? "bg-app-accent items-center justify-center" : "bg-app-surface"}
      style={{ width: 16, height: 16, borderRadius: 3, borderWidth: done ? 0 : 1.3, borderColor: "rgba(0, 0, 0, 0.2)", marginTop: 1 }}
    >
      {done ? <Image src={check} class="tint-app-on-accent" style={{ width: 8, height: 8 }} /> : null}
    </View>
  );
  return (
    <View testID={props.testID} class={`bg-app-surface ${props.class ?? ""}`} style={[{ paddingVertical: 48, paddingHorizontal: 40 }, props.style ?? null]}>
      {props.intro ? (
        <Text class="text-app-text" style={body}>
          {props.intro}
        </Text>
      ) : null}
      <Text class="text-app-text" role="header" style={{ marginTop: props.intro ? 24 : 0, fontSize: 16, lineHeight: 19.2, fontWeight: "600" }}>
        {props.title ?? "Fidelity Checklist"}
      </Text>
      <View style={{ marginTop: 20, gap: 10 }}>
        {props.items.map((item, i) => (
          <View class="flex flex-row" style={{ alignItems: "flex-start", gap: 12 }}>
            {props.onToggle ? (
              <BaseButton
                testID={props.testID ? `${props.testID}-${i}` : undefined}
                role="checkbox"
                accessibilityLabel={item.text}
                selected={!!item.done}
                class="focus-visible:outline-2 focus-visible:outline-app-focus-ring"
                onPress={() => props.onToggle?.(i, !item.done)}
              >
                {box(!!item.done)}
              </BaseButton>
            ) : (
              box(!!item.done)
            )}
            <Text class="text-app-text" style={[body, { flex: 1 }]}>
              {item.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
