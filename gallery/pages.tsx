import { cleanup, signal, Text, View } from "nsh";
import { Tooltip as BaseTooltip } from "nsh/base";
import {
  AgentComposer,
  AgentPanel,
  AgentActivity,
  ApiKeyPolicy,
  PanelGroup,
  SpecDocument,
  TaskCard,
  type ActivityStep,
  type SpecItem,
  AgentThread,
  ApplicationSurface,
  PanelTitle,
  PanelToolbar,
  type ThreadStep,
  Button,
  Checkbox,
  ComboButton,
  ContextMenu,
  ConversationMessage,
  Dropdown,
  FormField,
  Icon,
  IconControl,
  ModelSwitcher,
  SegmentedControl,
  SideNav,
  Slider,
  Switch,
  Tabs,
  TooltipContent,
  tooltipProps,
  Type,
  Mark,
  Navigation as SiteNavigation,
  PlatformIcon,
  Wordmark,
  Gradient,
  type GradientName,
  radius,
  space,
  shadowElevated,
  type ButtonColor,
  type ComboAction,
  type IconName,
  type MenuOption,
  type TypeVariant,
} from "../src";
import { icons12, icons16, type SmallIconName } from "../src/icons";
import { Board, Row, Section } from "./section";

const colors: ButtonColor[] = ["black", "citrus", "white", "grey", "outline"];

export function Buttons() {
  const pressed = signal(0);
  return (
    <Section id="buttons" title="Button" note="Five fills, four heights. Hover to see the fill change and the label roll.">
      <Board>
        {colors.map((color) => (
          <Row label={color} surface={color === "grey"}>
            <Button testID={`button-${color}`} label="Get started" color={color} size="extra-small" onPress={() => pressed.set(pressed() + 1)} />
            <Button label="Get started" color={color} />
            <Button label="Download for macOS" icon="arrow-right" color={color} size="large" />
            <Button label="Add" icon="add" variant="icon" color={color} />
            <Button label="Settings" icon="settings" variant="icon-expand" color={color} />
            <Button label="Disabled" color={color} disabled />
          </Row>
        ))}
        <Row label="extra-large">
          <Button label="Play" icon="arrow-right" size="extra-large" />
          <Button label="Play" icon="arrow-right" size="extra-large" color="citrus" />
        </Row>
        <Row label="presses">
          <Text testID="button-presses" class="text-content" style={{ fontSize: 14 }}>{`${pressed()}`}</Text>
        </Row>
      </Board>
    </Section>
  );
}

export function Toggles() {
  const a = signal(true);
  const b = signal(false);
  const c = signal(true);
  const d = signal(false);
  return (
    <Section id="toggles" title="Switch & Checkbox">
      <Board>
        <Row label="switch">
          <Switch testID="switch" checked={a()} onChange={(x) => a.set(x)} accessibilityLabel="Notifications" />
          <Switch checked={b()} size="small" onChange={(x) => b.set(x)} accessibilityLabel="Sounds" />
          <Switch checked={a()} size="small-short" onChange={(x) => a.set(x)} accessibilityLabel="Compact" />
          <Switch checked={a()} tone="inverted" onChange={(x) => a.set(x)} accessibilityLabel="Inverted" />
          <Switch checked disabled accessibilityLabel="Disabled" />
        </Row>
        <Row label="checkbox">
          <Checkbox testID="checkbox" checked={c()} onChange={(x) => c.set(x)} accessibilityLabel="Agree" />
          <Checkbox checked={d()} onChange={(x) => d.set(x)} accessibilityLabel="Off" />
          <Checkbox checked={false} indeterminate accessibilityLabel="Some" />
          <Checkbox checked={c()} size="small" onChange={(x) => c.set(x)} accessibilityLabel="Small" />
          <Checkbox checked disabled accessibilityLabel="Disabled" />
        </Row>
      </Board>
    </Section>
  );
}

export function TabsPage() {
  const v1 = signal("chat");
  const v2 = signal("week");
  const v3 = signal("grid");
  const items = [
    { value: "chat", label: "Chat" },
    { value: "code", label: "Code" },
  ];
  return (
    <Section id="tabs" title="Tabs" note="The selected pill slides to the tab pressed.">
      <Board>
        <Row label="grey" surface>
          <Tabs testID="tabs" items={items} value={v1()} onChange={(x) => v1.set(x)} />
          <Tabs items={items} value={v1()} size="large" onChange={(x) => v1.set(x)} />
        </Row>
        <Row label="white-dark">
          <Tabs
            items={[
              { value: "day", label: "Day" },
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
            ]}
            value={v2()}
            color="white-dark"
            onChange={(x) => v2.set(x)}
          />
        </Row>
        <Row label="icon">
          <Tabs
            items={[
              { value: "grid", label: "Grid", icon: "menu-quad" },
              { value: "list", label: "List", icon: "list" },
            ]}
            value={v3()}
            variant="icon"
            color="white-grey"
            onChange={(x) => v3.set(x)}
          />
        </Row>
      </Board>
    </Section>
  );
}

const models: MenuOption[] = [
  { value: "opus", label: "Claude Opus", group: "a" },
  { value: "sonnet", label: "Claude Sonnet", group: "a" },
  { value: "gpt", label: "GPT-5", group: "b" },
  { value: "gemini", label: "Gemini", group: "b", disabled: true },
];

export function Menus() {
  const v = signal<string | null>("sonnet");
  const w = signal<string | null>(null);
  const last = signal("");
  return (
    <Section id="menus" title="Dropdown & Context menu">
      <Board>
        <Row label="grey dropdown" surface>
          <Dropdown testID="dropdown" options={models} value={v()} onChange={(x) => v.set(x)} accessibilityLabel="Model" />
          <Dropdown options={models} value={v()} size="s" placement="center" onChange={(x) => v.set(x)} />
          <Dropdown options={models} value={v()} disabled />
        </Row>
        <Row label="white dropdown">
          <Dropdown options={models} value={w()} placeholder="Choose…" size="l" color="white" onChange={(x) => w.set(x)} />
          <Dropdown options={models} value={w()} placeholder="Above" color="white" placement="top" onChange={(x) => w.set(x)} />
        </Row>
        <Row label="context menu">
          <ContextMenu
            testID="context"
            options={[
              { value: "copy", label: "Copy", icon: "copy" },
              { value: "edit", label: "Edit", icon: "edit" },
              { value: "delete", label: "Delete", icon: "delete", group: "danger" },
            ]}
            onSelect={(x) => last.set(x)}
          >
            <Button label="More" icon="more" variant="icon" color="grey" tooltip={false} />
          </ContextMenu>
          <Text class="text-content-muted" style={{ fontSize: 11 }}>{last() ? `Chose ${last()}` : "Right-click the button"}</Text>
        </Row>
      </Board>
    </Section>
  );
}

export function Combos() {
  const last = signal("");
  const actions: ComboAction[] = [
    { value: "copy", label: "Copy", icon: "copy" },
    { value: "edit", label: "Edit", icon: "edit" },
    { value: "external", label: "Share", icon: "external" },
  ];
  return (
    <Section id="combo" title="Combo button & Icon control">
      <Board>
        <Row label="grey combo" surface>
          <ComboButton testID="combo" actions={actions} onPress={(x) => last.set(x)} />
        </Row>
        <Row label="combo">
          <ComboButton actions={actions} color="white" variant="simple" onPress={(x) => last.set(x)} />
          <ComboButton actions={actions} color="dark" size="medium" onPress={(x) => last.set(x)} />
        </Row>
        <Row label="icon control">
          <IconControl icon="copy" label="Copy" onPress={() => last.set("icon copy")} />
          <IconControl icon="settings" label="Settings" />
          <IconControl icon="close" label="Close" disabled />
          <Text class="text-content-muted" style={{ fontSize: 11 }}>{last()}</Text>
        </Row>
      </Board>
    </Section>
  );
}

export function Navigation() {
  const v = signal("intro");
  const groups = [
    { title: "Getting started", items: [{ value: "intro", label: "Introduction" }, { value: "install", label: "Installation" }] },
    { title: "Components", items: [{ value: "button", label: "Button" }, { value: "tabs", label: "Tabs" }] },
  ];
  return (
    <Section id="sidenav" title="Side navigation">
      <Board>
        <View class="flex" style={{ gap: 40, flexWrap: "wrap", alignItems: "flex-start" }}>
          <SideNav testID="sidenav" groups={groups} value={v()} onChange={(x) => v.set(x)} />
          <View class="bg-surface" style={{ padding: 15, borderRadius: 20 }}>
            <SideNav groups={groups} value={v()} variant="itemized" color="grey" onChange={(x) => v.set(x)} />
          </View>
          <SideNav
            groups={groups}
            value={v()}
            variant="actions"
            style={{ width: 240 }}
            actions={[
              { value: "edit", label: "Rename", icon: "edit" },
              { value: "delete", label: "Delete", icon: "delete" },
            ]}
            onChange={(x) => v.set(x)}
          />
        </View>
      </Board>
    </Section>
  );
}

export function Sliders() {
  const a = signal(40);
  const b = signal(0.7);
  const c = signal(100);
  return (
    <Section id="slider" title="Slider" note="Drag or press the track; the value field of editable sliders takes typing.">
      <Board>
        <Row label="inside">
          <Slider testID="slider" label="Volume" value={a()} onChange={(x) => a.set(x)} />
          <Slider label="Volume" value={a()} size="large" color="grey" onChange={(x) => a.set(x)} />
          <Slider label="Max" value={c()} color="black" onChange={(x) => c.set(x)} />
        </Row>
        <Row label="on surface" surface>
          <Slider testID="slider-surface" label="Property" value={c()} onSurface onChange={(x) => c.set(x)} />
          <Slider label="Property" value={c()} onSurface editable onChange={(x) => c.set(x)} />
        </Row>
        <Row label="inline">
          <Slider label="Temperature" variant="inline" value={b()} min={0} max={1} step={0.1} editable format={(n) => n.toFixed(1)} onChange={(x) => b.set(x)} />
        </Row>
        <Row label="above">
          <Slider label="Opacity" variant="above" value={a()} handle="hover" format={(n) => `${n}%`} onChange={(x) => a.set(x)} />
          <Slider label="Disabled" value={30} disabled />
        </Row>
      </Board>
    </Section>
  );
}

export function Fields() {
  const a = signal("");
  const b = signal("Intent");
  const c = signal("hello@");
  return (
    <Section id="fields" title="Form field">
      <Board>
        <Row label="grey" surface>
          <FormField testID="field" color="grey" value={a()} placeholder="Search" icon="search" clearable onChange={(x) => a.set(x)} accessibilityLabel="Search" />
          <FormField value={b()} color="grey" size="small" onChange={(x) => b.set(x)} accessibilityLabel="Name" />
        </Row>
        <Row label="white / outline">
          <FormField value={b()} color="white" onChange={(x) => b.set(x)} accessibilityLabel="Name" />
          <FormField value={c()} color="outline" error="Enter a valid email" onChange={(x) => c.set(x)} accessibilityLabel="Email" />
          <FormField value="secret" masked disabled accessibilityLabel="Password" />
        </Row>
      </Board>
    </Section>
  );
}

// The thread intentapp.dev shows in its app window.
const thread: ThreadStep[] = [
  { kind: "user", text: "can you run this locally?" },
  { kind: "text", text: "I'll inspect the project's local run instructions, then start the appropriate development process and report the URL or app status." },
  { kind: "tool", icon: "folder", text: "Name the workspace and agent for running the app locally" },
  { kind: "tool", icon: "file", text: "Read SKILL.md /Users/…" },
  { kind: "text", text: "The repository provides a standalone mock backend fallback, so I can start it without a daemon." },
  { kind: "tool", icon: "terminal", text: "Run pnpm run dev" },
  { kind: "tool", icon: "terminal", text: "Run terminal 18297" },
  { kind: "heading", text: "Blocked on dependencies" },
  { kind: "text", text: "`pnpm run dev` exited with code 1 before the app started." },
  { kind: "text", text: "May I run `pnpm install`, then restart the app?" },
  { kind: "user", text: "Yes" },
];

const activity: ActivityStep[] = [
  { kind: "activity", icon: "hold", text: "Run pnpm build" },
  { kind: "activity", icon: "hold", text: "Run git diff --check && git diff -- src/components/InventoryCard.astro" },
  { kind: "text", text: "The page builds cleanly." },
  { kind: "activity", icon: "thinking", text: "Managing external monitoring" },
  { kind: "activity", icon: "thinking", text: "Summary using controls" },
  { kind: "title", text: "GUI Ready" },
  { kind: "text", text: "A motion tuning panel is available top-right at [http://localhost:4337](http://localhost:4337)." },
  { kind: "list", text: "It includes:", items: ["Click timing and scrub", "Card reveal behavior", "Reset and Copy JSON"] },
  { kind: "text", text: "The GUI is development-only and excluded from production builds." },
];

const spec: SpecItem[] = [
  { text: "Color palette (brand, status: en route / arriving / delivered / delayed, neutrals, map-tinted surfaces) encoded as tokens." },
  { text: "Type scale (font family, sizes, weights, line-heights, letter-spacing) matches Figma; correct web fonts loaded with fallbacks.", done: true },
  { text: "Light theme complete; dark/map-dark surface tokens defined", done: true },
  { text: "Icon set matches Figma (size, stroke, optical alignment)" },
  { text: "Zoom control disabled state at min/max zoom rendered per design." },
  { text: "Destination pin variants (active, arriving, delivered, delayed)" },
  { text: "Dropped pin has its own styled variant + drag affordance." },
  { text: "Status badges use correct status color tokens" },
  { text: "Loading skeletons/empty states for rail and card match design." },
  { text: "Contrast (WCAG AA) verified for text/markers over the map at multiple zoom levels." },
];

export function Application() {
  const model = signal("claude");
  const seg = signal("chat");
  const panel = signal<string | null>("agents");
  const draft = signal("");
  const sent = signal("");
  const panelOpen = signal(true);
  const saveKey = signal(true);
  const group = signal<string | null>(null);
  const card = signal<string | null>(null);
  const items = signal(spec);
  const link = signal("");
  // The activity comes in a step at a time, as the agent works.
  const revealed = signal(activity.length);
  let timer: ReturnType<typeof setInterval> | undefined;
  const replay = () => {
    clearInterval(timer);
    revealed.set(0);
    timer = setInterval(() => {
      if (revealed() >= activity.length) clearInterval(timer);
      else revealed.set(revealed() + 1);
    }, 350);
  };
  cleanup(() => clearInterval(timer));
  return (
    <Section id="app" title="Application" note="The surfaces of the Intent app window.">
      <Board tone="muted">
        <Row label="model switcher">
          <ModelSwitcher
            testID="models"
            options={[
              { value: "claude", label: "Claude", icon: "agents" },
              { value: "openai", label: "OpenAI", icon: "openai" },
              { value: "gemini", label: "Gemini", icon: "gemini" },
              { value: "grok", label: "Grok", icon: "grok" },
            ]}
            value={model()}
            onChange={(x) => model.set(x)}
          />
        </Row>
        <Row label="segmented">
          <SegmentedControl
            testID="segments"
            segments={[
              { value: "chat", label: "Chat" },
              { value: "plan", label: "Plan" },
              { value: "build", label: "Build" },
            ]}
            value={seg()}
            onChange={(x) => seg.set(x)}
          />
        </Row>
        <ApplicationSurface style={{ width: "100%", maxWidth: 420, padding: 20 }}>
          <View class="gap-4">
            <ConversationMessage role="user" text="Make the onboarding screen feel calmer." />
            <ConversationMessage text="I softened the palette, cut the copy to one line per step and slowed the transitions to 400 ms." />
            <ConversationMessage role="feedback" text="Edited 3 files · 12 s" />
            <ConversationMessage role="user" compact text="Ship it" />
          </View>
        </ApplicationSurface>
        <Row label="panel toolbar">
          <PanelToolbar testID="toolbar" value={panel()} style={{ width: 320, maxWidth: "100%" }} onChange={(x) => panel.set(x)} />
        </Row>
        <Row label="panel title">
          <PanelTitle title="Add Interactive Map" repo="logistics-ai/app" />
        </Row>
      </Board>
      <Board tone="muted">
        <ApplicationSurface style={{ width: "100%", maxWidth: 560, overflow: "hidden" }}>
          <View style={{ paddingVertical: 24, paddingHorizontal: 32 }}>
            <AgentThread testID="thread" steps={thread} />
          </View>
          <AgentComposer
            testID="composer"
            value={draft()}
            onChange={(x) => draft.set(x)}
            onSubmit={(x) => {
              sent.set(x);
              draft.set("");
            }}
          />
        </ApplicationSurface>
        {sent() ? <Text class="text-content-muted">{`Sent: ${sent()}`}</Text> : null}
      </Board>
      <Board tone="muted">
        {panelOpen() ? (
          <AgentPanel testID="agent-panel" steps={thread} onClose={() => panelOpen.set(false)} />
        ) : (
          <Button testID="agent-panel-open" label="Open the panel" color="white" onPress={() => panelOpen.set(true)} />
        )}
        <ApiKeyPolicy testID="save-key" saved={saveKey()} onChange={(x) => saveKey.set(x)} />
        <Text class="text-content-muted">{saveKey() ? "Key: kept on this machine" : "Key: not kept"}</Text>
      </Board>
      <Board tone="muted">
        <PanelGroup testID="panels" class="bg-canvas" style={{ borderRadius: 14 }} value={group()} onChange={(x) => group.set(x)} />
      </Board>
      <Board tone="muted">
        <TaskCard
          testID="task"
          title="Add Interactive Map"
          repo="logistics-ai/app"
          progress={{ steps: 3, done: 2, current: 0.17 }}
          description="Redoing the Figma deliverable from live web-app imports, then promoting repeated UI into real components and variants."
          value={card()}
          onChange={(x) => card.set(x)}
          onMore={() => undefined}
        />
      </Board>
      <Board tone="muted">
        <ApplicationSurface style={{ width: "100%", maxWidth: 700, overflow: "hidden" }}>
          <AgentActivity testID="activity" steps={activity} revealed={revealed()} style={{ alignSelf: "center", width: "100%", maxWidth: 440, minHeight: 420, paddingHorizontal: 16 }} onLink={(url) => link.set(url)} />
          <AgentComposer value="" style={{ paddingHorizontal: 48 }} />
        </ApplicationSurface>
        <Row label="activity">
          <Button testID="activity-replay" label="Replay" color="white" onPress={replay} />
          <Text class="text-content-muted">{link() ? `Opened ${link()}` : `${revealed()} of ${activity.length} steps`}</Text>
        </Row>
      </Board>
      <Board tone="muted">
        <SpecDocument
          testID="spec"
          style={{ width: "100%", maxWidth: 700, borderRadius: 14 }}
          intro="The Live Map must read as a polished, production-grade dispatcher console — not a map with widgets bolted on. Every surface is measured against the Figma design."
          items={items()}
          onToggle={(i, done) => items.set(items().map((item, j) => (j === i ? { ...item, done } : item)))}
        />
        <Text class="text-content-muted">{`${items().filter((x) => x.done).length} of ${items().length} done`}</Text>
      </Board>
    </Section>
  );
}

export function Tooltips() {
  return (
    <Section id="tooltips" title="Tooltip" note="Shown after the pointer rests 800 ms on an element. Rest on the buttons; the bubbles below are the content alone.">
      <Board>
        <Row label="on hover">
          <View
            testID="tooltip-anchor"
            role="button"
            accessibilityLabel="Rest here"
            class="bg-surface items-center justify-center"
            style={{ height: 40, paddingHorizontal: 20, borderRadius: 15 }}
            tooltip={
              <BaseTooltip {...tooltipProps()}>
                <TooltipContent label="Tip on top" />
              </BaseTooltip>
            }
          >
            <Text class="text-content" style={{ fontSize: 14 }}>Rest here (top)</Text>
          </View>
          <View
            class="bg-surface items-center justify-center"
            style={{ height: 40, paddingHorizontal: 20, borderRadius: 15 }}
            tooltip={
              <BaseTooltip {...tooltipProps({ placement: "bottom" })}>
                <TooltipContent label="Tip below" placement="bottom" />
              </BaseTooltip>
            }
          >
            <Text class="text-content" style={{ fontSize: 14 }}>Rest here (bottom)</Text>
          </View>
        </Row>
        <Row label="content">
          <TooltipContent label="Tip on top" />
          <TooltipContent label="Simple" variant="simple" />
          <TooltipContent label="Tip below" placement="bottom" />
        </Row>
      </Board>
    </Section>
  );
}

const steps: TypeVariant[] = ["display", "title", "headline", "featureTitle", "featureBody", "body", "base", "mono", "label", "button", "small", "caption", "eyebrow", "message"];

export function Typography() {
  return (
    <Section id="type" title="Typography" note="Display steps use the display face (bring your own ABC Arizona Mix); the rest is Inter.">
      <Board>
        {steps.map((step) => (
          <View class="flex items-baseline" style={{ gap: 20 }}>
            <Text class="text-content-muted" style={{ width: 110, fontSize: 11, lineHeight: 14 }}>
              {step}
            </Text>
            <Type variant={step} numberOfLines={1} class="flex-1">
              {step === "eyebrow" ? "INTENT DESIGN SYSTEM" : "Build with intent"}
            </Type>
          </View>
        ))}
      </Board>
    </Section>
  );
}

const glyphs = Object.keys(icons16) as IconName[];
const smallGlyphs = Object.keys(icons12) as SmallIconName[];

export function Icons() {
  return (
    <Section id="icons" title="Iconography" note={`${glyphs.length} glyphs at 16 pt, ${smallGlyphs.length} at 12 pt (XS), tinted by token.`}>
      <Board>
        <View class="flex" style={{ gap: 10, flexWrap: "wrap" }}>
          {glyphs.map((name) => (
            <View class="items-center gap-2" style={{ width: 80 }}>
              <Icon name={name} accessibilityLabel={name} />
              <Text class="text-content-muted" numberOfLines={1} style={{ fontSize: 10 }}>
                {name}
              </Text>
            </View>
          ))}
        </View>
        <Type variant="eyebrow">XS 12</Type>
        <View class="flex" style={{ gap: 10, flexWrap: "wrap" }}>
          {smallGlyphs.map((name) => (
            <View class="items-center gap-2" style={{ width: 80 }}>
              <Icon name={name} size={12} accessibilityLabel={name} />
              <Text class="text-content-muted" numberOfLines={1} style={{ fontSize: 10 }}>
                {name}
              </Text>
            </View>
          ))}
        </View>
      </Board>
    </Section>
  );
}

export function Logo() {
  const went = signal("");
  return (
    <Section id="logo" title="Logo" note="The mark and wordmark, tinted one color. Bloom swings the mark's arms into place.">
      <View class="flex" style={{ gap: 20, flexWrap: "wrap" }}>
        <View class="items-center justify-center" style={{ width: 240, height: 200, borderRadius: 20, backgroundColor: "#ffffff" }}>
          <Mark size={80} style={{ tintColor: "#080808" }} />
        </View>
        <View class="items-center justify-center" style={{ width: 240, height: 200, borderRadius: 20, backgroundColor: "#080808" }}>
          <Mark size={80} style={{ tintColor: "#f0f0eb" }} />
        </View>
        <View class="items-center justify-center bg-surface border border-border" style={{ width: 240, height: 200, borderRadius: 20 }}>
          <Mark testID="mark-bloom" size={80} animation="bloom" loop />
        </View>
        <View class="items-center justify-center bg-surface border border-border" style={{ width: 240, height: 200, borderRadius: 20 }}>
          <Wordmark testID="wordmark" size={172} />
        </View>
        <View class="flex flex-row items-center justify-center bg-surface border border-border" style={{ width: 240, height: 200, borderRadius: 20, gap: 12 }}>
          <PlatformIcon name="apple" accessibilityLabel="macOS" />
          <PlatformIcon name="github" accessibilityLabel="GitHub" />
          <PlatformIcon name="windows" accessibilityLabel="Windows" />
        </View>
      </View>
      <View class="bg-surface border border-border" style={{ width: "100%", maxWidth: 700, marginTop: 20, paddingHorizontal: 24, paddingVertical: 50, borderRadius: 14 }}>
        <SiteNavigation testID="nav" onNavigate={(v: string) => went.set(v)} onHome={() => went.set("home")} onAction={() => went.set("download")} />
      </View>
      <Text testID="nav-went" class="text-content-muted" style={{ marginTop: 8, fontSize: 12 }}>
        {went() ? `Went: ${went()}` : " "}
      </Text>
    </Section>
  );
}

const spectrum: [string, string][] = [
  ["yellow-200", "#c0cc54"],
  ["yellow-300", "#d3de5d"],
  ["yellow-500", "#ddec61"],
  ["yellow-700", "#fef99d"],
  ["yellow-800", "#ffffc7"],
  ["yellow-900", "#fcfcf9"],
  ["black", "#080808"],
  ["grey-50", "#161616"],
  ["grey-100", "#1a1a19"],
  ["grey-200", "#272727"],
  ["grey-300", "#3d3d3c"],
  ["grey-400", "#525250"],
  ["grey-500", "#8c8c89"],
  ["grey-600", "#babab7"],
  ["grey-700", "#cfcfcd"],
  ["grey-800", "#e1e1de"],
  ["grey-900", "#f0f0eb"],
  ["white", "#ffffff"],
  ["moss-400", "#717453"],
  ["moss-500", "#979a73"],
  ["orange-500", "#faa755"],
  ["red-500", "#e87f39"],
];

const semantics = [
  "canvas",
  "surface",
  "surface-muted",
  "inverse-surface",
  "control-surface",
  "control-surface-strong",
  "control-ink",
  "content",
  "content-muted",
  "accent-secondary",
  "accent-tertiary",
  "accent-alert",
];

function Swatch(props: { name: string; hex?: string; token?: string }) {
  return (
    <View class="gap-2" style={{ width: 100 }}>
      <View
        class={`border border-border ${props.token ? `bg-${props.token}` : ""}`}
        style={{ height: 70, borderRadius: 15, ...(props.hex ? { backgroundColor: props.hex } : {}) }}
      />
      <Type variant="caption">{props.name}</Type>
      {props.hex ? <Type variant="caption" tone="text-content-muted">{props.hex}</Type> : null}
    </View>
  );
}

export function Colors() {
  return (
    <Section id="color" title="Color" note="The spectrum, and the semantic tokens over it (switch the scheme to see both sets).">
      <Board>
        <Type variant="eyebrow">SPECTRUM</Type>
        <View class="flex" style={{ gap: 15, flexWrap: "wrap" }}>
          {spectrum.map(([name, hex]) => (
            <Swatch name={name} hex={hex} />
          ))}
        </View>
        <Type variant="eyebrow">SEMANTICS</Type>
        <View class="flex" style={{ gap: 15, flexWrap: "wrap" }}>
          {semantics.map((token) => (
            <Swatch name={token} token={token} />
          ))}
        </View>
      </Board>
    </Section>
  );
}

const gradientNames: [GradientName, string][] = [
  ["lightGreyToYellow", "Light Grey To Yellow"],
  ["mediumGreyToYellow", "Medium Grey to Yellow"],
  ["greyToYellow", "Grey To Yellow"],
  ["yellowWash", "Yellow Wash"],
  ["yellowToGrey", "Yellow To Grey"],
  ["lightYellows", "Light Yellows"],
];

export function Gradients() {
  return (
    <Section id="gradients" title="Gradients" note="For subtle backgrounds beside the flat colors; use them sparingly.">
      <View class="flex" style={{ gap: 20, flexWrap: "wrap" }}>
        {gradientNames.map(([key, name]) => (
          <View class="gap-2">
            <Gradient
              testID={`gradient-${key}`}
              name={key}
              radius={20}
              // The lightest one is outlined, as on intentapp.dev.
              outlined={key === "lightGreyToYellow"}
              style={{ width: 170, aspectRatio: 1.75 }}
            />
            <Type variant="caption">{name}</Type>
          </View>
        ))}
      </View>
    </Section>
  );
}

export function Foundations() {
  return (
    <Section id="foundations" title="Foundations" note="Radii, spacing, control sizes and elevation.">
      <Board>
        <Type variant="eyebrow">RADII</Type>
        <View class="flex" style={{ gap: 20, flexWrap: "wrap" }}>
          {Object.entries(radius).map(([name, r]) => (
            <View class="gap-2 items-center">
              <View class="bg-control-surface-strong" style={{ width: 80, height: 80, borderRadius: r }} />
              <Type variant="caption">{`${name} ${r}`}</Type>
            </View>
          ))}
        </View>
        <Type variant="eyebrow">MARGINS</Type>
        <View class="flex items-end" style={{ gap: 20, flexWrap: "wrap" }}>
          {Object.values(space).map((s) => (
            <View class="gap-2 items-center">
              <View style={{ width: s, height: s, backgroundColor: "#ddec61" }} />
              <Type variant="caption">{`${s}`}</Type>
            </View>
          ))}
        </View>
        <Type variant="eyebrow">SIZES</Type>
        <View class="flex items-end" style={{ gap: 20, flexWrap: "wrap" }}>
          {([35, 40, 60, 90] as const).map((h) => (
            <View class="gap-2 items-center">
              <View class="bg-inverse-surface" style={{ width: h === 90 ? 90 : 120, height: h, borderRadius: h / 2 }} />
              <Type variant="caption">{h === 90 ? "XL 90" : `${h}`}</Type>
            </View>
          ))}
        </View>
        <Type variant="eyebrow">ELEVATION</Type>
        <View class="bg-surface items-center justify-center" style={{ width: 240, height: 120, borderRadius: 20, boxShadow: shadowElevated }}>
          <Type variant="caption">0 10 20 · 10%</Type>
        </View>
      </Board>
    </Section>
  );
}
