import type { JSX } from "nsh";
import { Text, View } from "nsh";
import { Type } from "../src";

/** A showcase: a title, a line on what it is, and its specimens. */
export function Section(props: { id: string; title: string; note?: string; children?: JSX.Element }) {
  return (
    <View testID={props.id} class="gap-6" style={{ paddingVertical: 40 }}>
      <View class="gap-2">
        <Type variant="headline" heading>
          {props.title}
        </Type>
        {props.note ? (
          <Type variant="base" tone="text-content-muted">
            {props.note}
          </Type>
        ) : null}
      </View>
      {props.children}
    </View>
  );
}

/** A row of specimens with a caption at the left. */
export function Row(props: { label: string; surface?: boolean; children?: JSX.Element }) {
  return (
    <View
      class={`flex items-center ${props.surface ? "bg-surface" : ""}`}
      style={props.surface ? { gap: 20, flexWrap: "wrap", padding: 15, marginHorizontal: -15, borderRadius: 20 } : { gap: 20, flexWrap: "wrap" }}
    >
      <Text class="text-content-muted" style={{ width: 110, fontSize: 11, lineHeight: 14, fontWeight: "450" }}>
        {props.label}
      </Text>
      {props.children}
    </View>
  );
}

/** A panel the specimens sit on. */
export function Board(props: { tone?: "canvas" | "surface" | "muted"; children?: JSX.Element }) {
  const bg = props.tone === "surface" ? "bg-surface" : props.tone === "muted" ? "bg-control-surface-muted" : "bg-canvas";
  return (
    <View class={`${bg} border border-border gap-5`} style={{ padding: 30, borderRadius: 20 }}>
      {props.children}
    </View>
  );
}
