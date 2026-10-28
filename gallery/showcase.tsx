import type { JSX } from "nsh";
import { platform, signal, Text, View } from "nsh";
import { Button as Pressable } from "nsh/base";
import { Dropdown, fontFamily, Icon, type MenuOption } from "../src";

/** What a showcase's preview sits on. */
export type Backdrop = "white" | "grey" | "citrus";

const backdrops: { value: Backdrop; label: string; dot: string }[] = [
  { value: "white", label: "White", dot: "bg-control-surface border border-border" },
  { value: "grey", label: "Grey 900", dot: "bg-control-surface-muted" },
  { value: "citrus", label: "Citrus", dot: "bg-accent" },
];
const fills: Record<Backdrop, string> = {
  white: "bg-control-surface border border-transparent",
  grey: "bg-control-surface-muted border border-border",
  citrus: "bg-accent border border-transparent",
};

// A touch screen has no pointer to hover the preview with: its dots stay.
const touch = platform.os === "ios" || platform.os === "android";

/**
 * intentapp.dev's component showcase: the title and the controls that set the
 * component's props on the left, and a preview on the right, whose backdrop
 * three dots at its foot switch (shown while the pointer is over it).
 */
export function Showcase(props: { id: string; title: string; controls: JSX.Element; children: (backdrop: Backdrop) => JSX.Element }) {
  const backdrop = signal<Backdrop>("white");
  const hovered = signal(false);
  return (
    <View testID={props.id} class="flex flex-row" style={{ flexWrap: "wrap", gap: 20, maxWidth: 740 }}>
      <View style={{ width: 265, gap: 60 }}>
        <Text class="text-content" role="header" style={{ fontFamily: fontFamily.display, fontSize: 26, lineHeight: 24.7, letterSpacing: -0.91 }}>
          {props.title}
        </Text>
        <View style={{ gap: 10 }}>{props.controls}</View>
      </View>
      <View
        testID={`${props.id}-preview`}
        class={`items-center justify-center ${fills[backdrop()]}`}
        style={{ flexGrow: 1, flexShrink: 1, flexBasis: 455, maxWidth: 455, minWidth: 280, height: 440, borderRadius: 20 }}
        onHoverIn={() => hovered.set(true)}
        onHoverOut={() => hovered.set(false)}
      >
        {/* Some components keep to the start of their row: this view hugs them, centered. */}
        <View>
          {props.children(backdrop())}
        </View>
        <View
          class="absolute flex flex-row"
          style={{ left: 20, bottom: 20, gap: 5, opacity: touch || hovered() ? 1 : 0, transitionProperty: "opacity", transitionDuration: 160 }}
        >
          {backdrops.map((b) => (
            <Pressable
              testID={`${props.id}-backdrop-${b.value}`}
              accessibilityLabel={b.label}
              selected={backdrop() === b.value}
              class={b.dot}
              style={{ width: 10, height: 10, borderRadius: 5 }}
              onPress={() => backdrop.set(b.value)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const labelStyle = { width: 80, fontSize: 14, lineHeight: 16.8, letterSpacing: -0.28, fontWeight: "500" } as const;

/** A control row: a label and a small white dropdown of the prop's values. */
export function Choice<V extends string>(props: { testID?: string; label: string; options: MenuOption<V>[]; value: V; disabled?: boolean; onChange: (value: V) => void }) {
  return (
    <View class="flex flex-row items-center" style={{ gap: 10, opacity: props.disabled ? 0.3 : 1 }}>
      <Text class="text-content" style={labelStyle}>
        {props.label}
      </Text>
      <Dropdown
        testID={props.testID}
        options={props.options}
        value={props.value}
        color="white"
        size="s"
        width={175}
        disabled={props.disabled}
        accessibilityLabel={props.label}
        onChange={(v) => props.onChange(v)}
      />
    </View>
  );
}

/** Options from labels, each value the label lowercased and hyphenated (or given). */
export function opts<V extends string>(...items: (string | [V, string])[]): MenuOption<V>[] {
  return items.map((item) => (typeof item === "string" ? { value: item.toLowerCase().replace(/[^a-z0-9]+/g, "-") as V, label: item } : { value: item[0], label: item[1] }));
}

/** A swatch of the color control: its fill and the check's ink. */
export interface Swatch<V extends string> {
  value: V;
  label: string;
  class: string;
  ink: string;
}

/** A control row of color swatches; the chosen one shows a check. */
export function Swatches<V extends string>(props: { testID?: string; label: string; swatches: Swatch<V>[]; value: V; onChange: (value: V) => void }) {
  return (
    <View class="flex flex-row" style={{ gap: 10, alignItems: "flex-start" }}>
      <Text class="text-content" style={[labelStyle, { lineHeight: 35 }]}>
        {props.label}
      </Text>
      <View class="flex flex-row" style={{ flex: 1, minWidth: 0, flexWrap: "wrap", gap: 2 }}>
        {props.swatches.map((s) => (
          <Pressable
            testID={props.testID ? `${props.testID}-${s.value}` : undefined}
            accessibilityLabel={s.label}
            selected={props.value === s.value}
            class={`items-center justify-center ${s.class}`}
            style={{ width: 35, height: 35, borderRadius: 15 }}
            onPress={() => props.onChange(s.value)}
          >
            <Icon name="check" size={12} class={s.ink} style={{ opacity: props.value === s.value ? 1 : 0 }} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
