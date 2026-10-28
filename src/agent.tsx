import type { ImageAsset, JSX, StyleProp, ViewStyle } from "nsh";
import { colorScheme, Image, Text, View } from "nsh";
import { Button as BaseButton, Input } from "nsh/base";
import agentPreview from "./assets/agent-preview.svg";
import cardMore from "./assets/card-more.svg";
import panelClose from "./assets/panel-close.svg";
import agentsChips from "./assets/panels/panelbutton_agents_animation.svg";
import agentsChipsDark from "./assets/panels/panelbutton_agents_animation_dark.svg";
import agentsContent from "./assets/panels/panel_agents_content.svg";
import changesContent from "./assets/panels/panel_changes_content.svg";
import detailClose from "./assets/panels/panel_close.svg";
import contextContent from "./assets/panels/panel_context_content.svg";
import filesContent from "./assets/panels/panel_files_content.svg";
import specs from "./assets/panels/specs.svg";
import { Checkbox } from "./checkbox";
import { Icon, type IconName } from "./icon";
import { fontFamily } from "./tokens";

// The Intent app's agent surfaces, as intentapp.dev draws them. The page
// sizes them in a unit of its illustrations, in which a glyph is 12.556
// units; one unit here is what makes that glyph 16 pt.
const u = 16 / 12.556;

/** The model a composer sends to: its name and mark. */
export interface ComposerModel {
  label: string;
  icon: IconName;
}

export interface AgentComposerProps {
  /** The text being written. */
  value: string;
  /** What the empty field says (default "Ask anything"). */
  placeholder?: string;
  /** The model at the foot, left (default GPT-5.6 Sol). */
  model?: ComposerModel;
  /** Finds the composer in tests; its field is `<testID>-field`, the send button `<testID>-send`. */
  testID?: string;
  /** Extra Tailwind classes. */
  class?: string;
  /** The inline style. */
  style?: StyleProp<ViewStyle>;
  /** The text changed. */
  onChange?: (value: string) => void;
  /** The send button (or Return) was pressed with text written. */
  onSubmit?: (value: string) => void;
  /** The microphone was pressed. */
  onVoice?: () => void;
}

/**
 * The composer at the foot of an agent thread: a 120 pt band under a
 * hairline, the field above, the model at the left of the foot and the
 * microphone and send button at its right. The send button is grey until
 * there is text, then citrus.
 */
export function AgentComposer(props: AgentComposerProps) {
  const model = (): ComposerModel => props.model ?? { label: "GPT-5.6 Sol", icon: "openai" };
  const ready = () => props.value.trim().length > 0;
  const send = () => {
    if (ready()) props.onSubmit?.(props.value);
  };
  return (
    <View
      testID={props.testID}
      class={`bg-app-surface border-t border-app-border ${props.class ?? ""}`}
      style={[{ height: 120, paddingTop: 22, paddingHorizontal: 32 }, props.style ?? null]}
    >
      <Input
        testID={props.testID ? `${props.testID}-field` : undefined}
        value={props.value}
        placeholder={props.placeholder ?? "Ask anything"}
        accessibilityLabel={props.placeholder ?? "Ask anything"}
        class="text-app-text placeholder:text-app-placeholder"
        style={{ height: 32, fontSize: 13.5, lineHeight: 13.5, fontWeight: "450" }}
        onChange={(value: string) => props.onChange?.(value)}
        onSubmit={() => send()}
      />
      <View class="absolute flex flex-row items-center justify-between" style={{ left: 33.5, right: 32, bottom: 14 }}>
        <View class="flex flex-row items-center" style={{ gap: 6 }}>
          <Icon name={model().icon} class="tint-app-text" />
          <Text class="text-app-text-muted" style={{ fontSize: 12, lineHeight: 12, fontWeight: "500" }} numberOfLines={1}>
            {model().label}
          </Text>
        </View>
        <View class="flex flex-row items-center" style={{ gap: 14 }}>
          <BaseButton accessibilityLabel="Voice" onPress={() => props.onVoice?.()}>
            <Icon name="audio" class="tint-app-text" />
          </BaseButton>
          <BaseButton
            testID={props.testID ? `${props.testID}-send` : undefined}
            accessibilityLabel="Send"
            disabled={!ready()}
            class={`items-center justify-center focus-visible:outline-2 focus-visible:outline-app-focus-ring focus-visible:outline-offset-2 ${ready() ? "bg-app-accent" : "bg-app-control-disabled"}`}
            style={{ width: 32, height: 32, borderRadius: 16, transitionProperty: "backgroundColor", transitionDuration: 160 }}
            onPress={send}
          >
            <Icon name="submit" class="tint-app-on-accent" style={{ opacity: ready() ? 1 : 0.3, transitionProperty: "opacity", transitionDuration: 160 }} />
          </BaseButton>
        </View>
      </View>
    </View>
  );
}

/** A step of an agent thread. */
export type ThreadStep =
  /** The user's message, on a bubble at the right. */
  | { kind: "user"; text: string }
  /** The agent's prose; `code` in backticks reads as code. */
  | { kind: "text"; text: string }
  /** A tool the agent ran: its glyph and what it did, in the mono face. */
  | { kind: "tool"; icon: IconName; text: string }
  /** A heading in the agent's answer. */
  | { kind: "heading"; text: string };

export interface AgentThreadProps {
  /** The steps, in order. */
  steps: ThreadStep[];
  /** Finds the thread in tests. */
  testID?: string;
  /** Extra Tailwind classes. */
  class?: string;
  /** The inline style. */
  style?: StyleProp<ViewStyle>;
}

const body = { fontSize: 10.2 * u, lineHeight: 10.2 * u * 1.4 };

// Prose with `code` spans.
function Prose(props: { text: string }) {
  return (
    <Text class="text-app-text" style={body}>
      {props.text.split("`").map((part, i) =>
        i % 2 === 1 ? (
          <Text class="text-app-code-text bg-app-surface-muted" style={{ fontFamily: fontFamily.mono, borderRadius: 4 * u }}>
            {` ${part} `}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
}

/**
 * An agent thread: the user's messages on muted bubbles at the right
 * (rounded but at the foot of their tail), the agent's answer below them in
 * prose, tool lines and headings.
 */
export function AgentThread(props: AgentThreadProps) {
  // The agent's steps after a message gather into one answer.
  const groups = () => {
    const out: ThreadStep[][] = [];
    for (const step of props.steps) {
      const last = out[out.length - 1];
      if (step.kind !== "user" && last && last[0].kind !== "user") last.push(step);
      else out.push([step]);
    }
    return out;
  };
  const bubble = (text: string, first: boolean) => (
    <View
      class="bg-app-surface-muted self-end"
      style={{
        marginTop: first ? 0 : 28.25 * u,
        paddingVertical: 7.16 * u,
        paddingHorizontal: 12.556 * u,
        borderTopLeftRadius: 15.694 * u,
        borderTopRightRadius: 15.694 * u,
        borderBottomLeftRadius: 15.694 * u,
        borderBottomRightRadius: 0,
      }}
    >
      <Text class="text-app-text" style={body}>
        {text}
      </Text>
    </View>
  );
  const step = (s: ThreadStep) => {
    if (s.kind === "tool") {
      return (
        <View class="flex flex-row" style={{ alignItems: "flex-start", gap: 6.278 * u }}>
          <Icon name={s.icon} class="tint-app-text-subtle" />
          <Text class="text-app-text-subtle" style={{ flex: 1, fontFamily: fontFamily.mono, fontSize: body.fontSize, lineHeight: body.fontSize * 1.3 }}>
            {s.text}
          </Text>
        </View>
      );
    }
    if (s.kind === "heading") {
      return (
        <Text class="text-app-text" role="header" style={[body, { marginTop: 9.417 * u }]}>
          {s.text}
        </Text>
      );
    }
    return <Prose text={s.text} />;
  };
  return (
    <View testID={props.testID} class={props.class} style={[{ width: "100%", maxWidth: 502.222 * u }, props.style ?? null]}>
      {groups().map((group, i) =>
        group[0].kind === "user" ? (
          bubble(group[0].text, i === 0)
        ) : (
          <View style={{ marginTop: i === 0 ? 0 : 28.25 * u, paddingRight: 15.694 * u, gap: 12.556 * u }}>{group.map(step)}</View>
        ),
      )}
    </View>
  );
}

export interface AgentPanelProps {
  /** What the header says (default "Agent preview"). */
  title?: string;
  /** The thread inside. */
  steps: ThreadStep[];
  /** Under the thread, in the panel (a composer, say). */
  children?: JSX.Element;
  /** Finds the panel in tests; its close button is `<testID>-close`. */
  testID?: string;
  /** Extra Tailwind classes. */
  class?: string;
  /** The inline style. */
  style?: StyleProp<ViewStyle>;
  /** The close button was pressed; without it there is none. */
  onClose?: () => void;
}

/**
 * An agent's panel in the app window: a white card in a white frame, a
 * hairline round it, its header (the agent's chip and name at the left,
 * close at the right) over a hairline, then the thread.
 */
export function AgentPanel(props: AgentPanelProps) {
  return (
    <View
      testID={props.testID}
      class={`bg-app-surface ${props.class ?? ""}`}
      style={[{ width: "100%", maxWidth: 403.3 * u, padding: 6.278 * u }, props.style ?? null]}
    >
      <View class="bg-app-surface border border-app-border overflow-hidden" style={{ flex: 1, borderRadius: 9.417 * u, borderWidth: 0.78 * u }}>
        <View
          class="flex flex-row items-center justify-between border-b border-app-border"
          style={{ height: 36.1 * u, paddingHorizontal: 12.556 * u - 0.78 * u, borderBottomWidth: 0.78 * u }}
        >
          <View class="flex flex-row items-center" style={{ gap: 6.278 * u }}>
            <View class="items-center justify-center bg-app-control-disabled" style={{ width: 15.694 * u, height: 15.694 * u, borderRadius: 4 * u }}>
              <Image src={agentPreview} class="tint-app-text" style={{ width: 10.986 * u, height: 4.183 * u }} />
            </View>
            <Text class="text-app-text" role="header" style={{ fontSize: 9.417 * u, lineHeight: 9.417 * u, fontWeight: "500" }} numberOfLines={1}>
              {props.title ?? "Agent preview"}
            </Text>
          </View>
          {props.onClose ? (
            <BaseButton
              testID={props.testID ? `${props.testID}-close` : undefined}
              accessibilityLabel="Close"
              class="focus-visible:outline-2 focus-visible:outline-app-focus-ring"
              onPress={() => props.onClose?.()}
            >
              <Image src={panelClose} class="tint-app-text" style={{ width: 15.694 * u, height: 15.694 * u }} />
            </BaseButton>
          ) : null}
        </View>
        <View style={{ paddingVertical: 18.83 * u, paddingHorizontal: 25.1 * u }}>
          <AgentThread steps={props.steps} />
        </View>
        {props.children}
      </View>
    </View>
  );
}

/** A panel of the app window that the toolbar opens. */
export interface PanelTool<V extends string = string> {
  value: V;
  label: string;
  icon: IconName;
}

/** The app window's panels, as the toolbar lists them. */
export const panelTools: PanelTool[] = [
  { value: "agents", label: "Agents", icon: "agents" },
  { value: "context", label: "Context", icon: "list" },
  { value: "changes", label: "Changes", icon: "code" },
  { value: "files", label: "Files", icon: "folders" },
  { value: "browser", label: "Browser", icon: "globe" },
  { value: "shell", label: "Shell", icon: "terminal" },
];

export interface PanelToolbarProps<V extends string = string> {
  /** The panels (default `panelTools`). */
  tools?: PanelTool<V>[];
  /** The open panel, outlined (default none). */
  value?: V | null;
  /** Finds the toolbar in tests; each button is `<testID>-<value>`. */
  testID?: string;
  /** Extra Tailwind classes. */
  class?: string;
  /** The inline style. */
  style?: StyleProp<ViewStyle>;
  /** A panel's button was pressed. */
  onChange?: (value: V) => void;
}

/**
 * The toolbar of an app panel: a white bar with a hairline, its buttons
 * sharing the width, each a muted glyph; the open panel's button is
 * outlined and its glyph full strength.
 */
export function PanelToolbar<V extends string = string>(props: PanelToolbarProps<V>) {
  const tools = () => props.tools ?? (panelTools as PanelTool<V>[]);
  return (
    <View
      testID={props.testID}
      role="toolbar"
      class={`flex flex-row items-center bg-app-surface border border-app-border ${props.class ?? ""}`}
      style={[{ height: 37.667 * u, paddingVertical: 3.139 * u - 1, paddingHorizontal: 2.637 * u - 1, borderRadius: 9.417 * u }, props.style ?? null]}
    >
      {tools().map((tool) => {
        const open = () => props.value === tool.value;
        return (
          <BaseButton
            testID={props.testID ? `${props.testID}-${tool.value}` : undefined}
            accessibilityLabel={tool.label}
            selected={open()}
            class={`items-center justify-center border ${open() ? "bg-app-surface border-app-border" : "border-transparent hover:bg-app-surface-hover"}`}
            style={{ flex: 1, minWidth: 0, height: 31.389 * u, borderRadius: 6.278 * u }}
            onPress={() => props.onChange?.(tool.value)}
          >
            <Icon name={tool.icon} class={open() ? "tint-app-text" : "tint-app-text-muted"} />
          </BaseButton>
        );
      })}
    </View>
  );
}

// The panels' artwork in a panel group: the tile's graphic and the open
// panel's content (with its width and height), as intentapp.dev draws them.
const panelArt: Record<string, { content?: [ImageAsset, number, number] }> = {
  agents: { content: [agentsContent, 247, 411] },
  context: { content: [contextContent, 246, 383] },
  changes: { content: [changesContent, 246, 412] },
  files: { content: [filesContent, 246, 412] },
};

export interface PanelGroupProps<V extends string = string> {
  /** The panels, as tiles two abreast (default `panelTools`); the last two are short. */
  tools?: PanelTool<V>[];
  /** The open panel, over the tiles (default none). */
  value?: V | null;
  /** What an open panel shows under its header (default intentapp.dev's artwork for the first four). */
  detail?: (value: V) => JSX.Element;
  /** Finds the group in tests; each tile is `<testID>-<value>`, the open panel `<testID>-panel`, its close button `<testID>-close`. */
  testID?: string;
  /** Extra Tailwind classes. */
  class?: string;
  /** The inline style. */
  style?: StyleProp<ViewStyle>;
  /** A tile was pressed (its value), or the open panel closed (null). */
  onChange?: (value: V | null) => void;
}

/**
 * The app window's panels as a group of tiles two abreast at the foot, each
 * named at its foot (the agents' chips and the context's glyph at its head);
 * the last row is short. A tile opens its panel over the group: a white card,
 * its name and a close button at the head, its content under them.
 */
export function PanelGroup<V extends string = string>(props: PanelGroupProps<V>) {
  const tools = () => props.tools ?? (panelTools as PanelTool<V>[]);
  const open = () => tools().find((tool) => tool.value === props.value) ?? null;
  const graphic = (value: string) =>
    value === "agents" ? (
      <Image src={colorScheme() === "dark" ? agentsChipsDark : agentsChips} style={{ width: 83.965 * u, height: 17.264 * u }} />
    ) : value === "context" ? (
      <Image src={specs} style={{ width: 17.264 * u, height: 17.264 * u }} />
    ) : null;
  const content = (value: V) => {
    if (props.detail) return props.detail(value);
    const art = panelArt[value]?.content;
    return art ? <Image src={art[0]} style={{ width: "100%", aspectRatio: art[1] / art[2] }} accessibilityLabel={`${open()?.label} panel content`} /> : null;
  };
  return (
    <View testID={props.testID} class={props.class} style={[{ width: "100%", maxWidth: 500 * u, height: 687.5 * u }, props.style ?? null]}>
      <View class="absolute flex flex-row flex-wrap" style={{ left: 25.111 * u, right: 25.111 * u, bottom: 25.111 * u, gap: 9.417 * u }}>
        {tools().map((tool, i) => {
          const short = i >= tools().length - 2;
          return (
            <BaseButton
              testID={props.testID ? `${props.testID}-${tool.value}` : undefined}
              accessibilityLabel={tool.label}
              selected={props.value === tool.value}
              class="bg-app-surface border border-app-border hover:bg-app-surface-hover focus-visible:outline-2 focus-visible:outline-app-focus-ring"
              style={{
                flexBasis: "40%",
                flexGrow: 1,
                height: (short ? 37.667 : 86.319) * u,
                padding: 12.556 * u,
                borderRadius: 9.417 * u,
                borderWidth: 0.78 * u,
                justifyContent: short ? "flex-end" : "space-between",
              }}
              onPress={() => props.onChange?.(tool.value)}
            >
              {short ? null : <View style={{ height: 17.264 * u }}>{graphic(tool.value)}</View>}
              <Text class="text-app-text" style={{ fontSize: 10.201 * u, lineHeight: 10.201 * u, fontWeight: "600" }}>
                {tool.label}
              </Text>
            </BaseButton>
          );
        })}
      </View>
      {open() ? (
        <View
          testID={props.testID ? `${props.testID}-panel` : undefined}
          class="absolute bg-app-surface border border-app-border overflow-hidden"
          style={{ top: 139 * u, left: 25.111 * u, right: 25.111 * u, bottom: 69.056 * u, padding: 24 * u, borderRadius: 9.417 * u, borderWidth: 0.78 * u }}
        >
          <View class="flex flex-row items-center justify-between">
            <Text class="text-app-text" role="header" style={{ fontSize: 10.201 * u, lineHeight: 10.201 * u, fontWeight: "600" }}>
              {open()!.label}
            </Text>
            <BaseButton
              testID={props.testID ? `${props.testID}-close` : undefined}
              accessibilityLabel={`Close ${open()!.label} panel`}
              class="items-center justify-center hover:bg-app-surface-muted focus-visible:outline-2 focus-visible:outline-app-focus-ring"
              style={{ width: 18.833 * u, height: 18.833 * u, borderRadius: 3.139 * u, transitionProperty: "background-color", transitionDuration: 150 }}
              onPress={() => props.onChange?.(null)}
            >
              <Image src={detailClose} class="tint-app-text" style={{ width: 12.556 * u, height: 12.556 * u }} />
            </BaseButton>
          </View>
          <View style={{ marginTop: 32 * u }}>{content(open()!.value)}</View>
        </View>
      ) : null}
    </View>
  );
}

export interface TaskProgressProps {
  /** The steps of the task (default 3). */
  steps?: number;
  /** The steps done. */
  done: number;
  /** How far into the next step, 0 to 1 (default 0). */
  current?: number;
  /** Extra Tailwind classes. */
  class?: string;
  /** The inline style. */
  style?: StyleProp<ViewStyle>;
}

/** A task's progress: a pill of steps, the done ones dark, the step under way filling citrus. */
export function TaskProgress(props: TaskProgressProps) {
  const steps = () => Math.max(1, props.steps ?? 3);
  return (
    <View
      role="progressbar"
      accessibilityLabel={`${props.done} of ${steps()} steps done`}
      class={`flex flex-row bg-app-surface-muted overflow-hidden ${props.class ?? ""}`}
      style={[{ width: "100%", height: 10 * u, borderRadius: 5 * u, gap: 1 }, props.style ?? null]}
    >
      {Array.from({ length: steps() }, (_, i) => (
        <View style={{ flex: 1 }}>
          {i < props.done ? (
            <View class="bg-app-text" style={{ flex: 1 }} />
          ) : i === props.done && (props.current ?? 0) > 0 ? (
            <View class="bg-app-accent" style={{ height: "100%", width: `${Math.min(1, props.current ?? 0) * 100}%` }} />
          ) : null}
        </View>
      ))}
    </View>
  );
}

export interface TaskCardProps<V extends string = string> {
  /** The task, in the display face. */
  title: string;
  /** The repository under it. */
  repo?: string;
  /** What the agent is doing. */
  description?: string;
  /** The task's progress (default none shown). */
  progress?: TaskProgressProps;
  /** The open panel (default none). */
  value?: V | null;
  /** The panels (default `panelTools`). */
  tools?: PanelTool<V>[];
  /** Finds the card in tests; its panels are `<testID>-panels-…`, its menu button `<testID>-more`. */
  testID?: string;
  /** Extra Tailwind classes. */
  class?: string;
  /** The inline style. */
  style?: StyleProp<ViewStyle>;
  /** A panel opened (its value) or closed (null). */
  onChange?: (value: V | null) => void;
  /** The menu button was pressed; without it there is none. */
  onMore?: () => void;
}

/**
 * A task as a card of the app: its title and repository, a menu button,
 * its progress and what the agent is doing, over the panel tiles, which
 * open their panels over the card.
 */
export function TaskCard<V extends string = string>(props: TaskCardProps<V>) {
  return (
    <View testID={props.testID} class={props.class} style={[{ width: 282.5 * u, height: 660.8 * u }, props.style ?? null]}>
      <View class="absolute" style={{ top: 41.7 * u, left: 25.1 * u, right: 25.1 * u }}>
        <View class="flex flex-row" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
          <PanelTitle title={props.title} repo={props.repo} style={{ flex: 1, paddingLeft: 9 * u }} />
          {props.onMore ? (
            <BaseButton
              testID={props.testID ? `${props.testID}-more` : undefined}
              accessibilityLabel="Task options"
              class="focus-visible:outline-2 focus-visible:outline-app-focus-ring"
              style={{ marginTop: 7.6 * u }}
              onPress={() => props.onMore?.()}
            >
              <Image src={cardMore} class="tint-app-text" style={{ width: 15.694 * u, height: 15.694 * u }} />
            </BaseButton>
          ) : null}
        </View>
        {props.progress ? <TaskProgress {...props.progress} style={{ marginTop: 12 * u }} /> : null}
        {props.description ? (
          <Text class="text-app-text" style={{ marginTop: 16 * u, maxWidth: 232.3 * u, fontSize: 10.2 * u, lineHeight: 13.77 * u }}>
            {props.description}
          </Text>
        ) : null}
      </View>
      <PanelGroup
        testID={props.testID ? `${props.testID}-panels` : undefined}
        class="absolute"
        style={{ top: 0, left: 0, right: 0, bottom: 0, width: "auto", maxWidth: undefined, height: "auto" }}
        tools={props.tools}
        value={props.value}
        onChange={props.onChange}
      />
    </View>
  );
}

export interface PanelTitleProps {
  /** The task, in the display face. */
  title: string;
  /** The repository under it. */
  repo?: string;
  /** Finds the title in tests. */
  testID?: string;
  /** Extra Tailwind classes. */
  class?: string;
  /** The inline style. */
  style?: StyleProp<ViewStyle>;
}

/** The heading of an app panel: the task in the display face, the repository under it beside a branch glyph. */
export function PanelTitle(props: PanelTitleProps) {
  return (
    <View testID={props.testID} class={props.class} style={[{ gap: 10 }, props.style ?? null]}>
      <Text class="text-app-text" role="header" style={{ fontFamily: fontFamily.display, fontSize: 20, lineHeight: 20, letterSpacing: -0.4 }}>
        {props.title}
      </Text>
      {props.repo ? (
        <View class="flex flex-row items-center" style={{ gap: 4 }}>
          <Icon name="git-branch" size={12} class="tint-app-text" style={{ width: 10, height: 10 }} />
          <Text class="text-app-text" style={{ fontSize: 10, lineHeight: 10 }}>
            {props.repo}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export interface ApiKeyPolicyProps {
  /** Whether the key is kept on this machine. */
  saved: boolean;
  /** What the box says (default "Save key locally"). */
  label?: string;
  /** Finds the checkbox in tests. */
  testID?: string;
  /** Extra Tailwind classes. */
  class?: string;
  /** The box was pressed: the value asked for. */
  onChange?: (saved: boolean) => void;
}

/** Where an API key is kept: the checkbox under a key field, "Save key locally". */
export function ApiKeyPolicy(props: ApiKeyPolicyProps) {
  return (
    <Checkbox testID={props.testID} class={props.class} checked={props.saved} onChange={(x) => props.onChange?.(x)}>
      <Text class="text-content" style={{ fontSize: 16, lineHeight: 24 }}>
        {props.label ?? "Save key locally"}
      </Text>
    </Checkbox>
  );
}
