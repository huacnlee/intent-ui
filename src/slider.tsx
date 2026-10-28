import type { GestureResponderEvent, StyleProp, TextStyle, ViewStyle } from "nsh";
import { signal, Text, View } from "nsh";
import { Input } from "nsh/base";
import { radius } from "./tokens";

/** The height of a slider: 30 or 50. */
export type SliderSize = "small" | "large";

/** The fill of the part up to the value. */
export type SliderColor = "yellow" | "grey" | "black";

/** Where the slider's name goes: inside the track, nowhere, to its left, or above it. */
export type SliderVariant = "inside" | "none" | "inline" | "above";

/** The thin handle at the end of the fill: always, never, or while the pointer is over the track or dragging. */
export type SliderHandle = boolean | "hover";

export interface SliderProps {
  /** The value; the app owns it and sets it in `onChange`. */
  value: number;
  /** The lowest value (default 0). */
  min?: number;
  /** The highest value (default 100). */
  max?: number;
  /** The values it snaps to, from `min` (default 1). */
  step?: number;
  /** What the value is: inside the track, left of it, or above it, by `variant`. */
  label?: string;
  /** Where the label goes (default `inside`). */
  variant?: SliderVariant;
  /** The height (default `small`, 30). */
  size?: SliderSize;
  /** The fill (default `yellow`). */
  color?: SliderColor;
  /** The handle (default true). */
  handle?: SliderHandle;
  /** On a white surface (`bg-surface`): the track and handle take the muted control color, the value field the plain one, as the system's sliders on white panels (default false). */
  onSurface?: boolean;
  /** Pressing the value turns it into a field to type one (default false). */
  editable?: boolean;
  /** How the value reads (default: the number). */
  format?: (value: number) => string;
  /** No presses or drags; the slider fades to 40%. */
  disabled?: boolean;
  /** The track's width (default 200, or 240 large; `inline` and `above` sliders are 280 wide in all). */
  width?: number;
  /** Finds the track in tests. */
  testID?: string;
  /** Extra Tailwind classes for the slider. */
  class?: string;
  /** The inline style of the slider. */
  style?: StyleProp<ViewStyle>;
  /** The value changed, by a drag, a press, a screen reader or the field. */
  onChange?: (value: number) => void;
  /** A drag or press ended (to commit the value). */
  onChangeEnd?: (value: number) => void;
}

const metrics: Record<SliderSize, { height: number; width: number; radius: number; padding: number; handle: number }> = {
  small: { height: 30, width: 200, radius: radius.s, padding: 10, handle: 14 },
  large: { height: 50, width: 240, radius: radius.m, padding: 15, handle: 20 },
};

const fills: Record<SliderColor, { fill: string; ink: string }> = {
  yellow: { fill: "bg-slider-fill", ink: "text-content-fixed-dark" },
  grey: { fill: "bg-control-edge", ink: "text-control-ink" },
  black: { fill: "bg-inverse-surface", ink: "text-inverse-content" },
};

const copy: TextStyle = { fontSize: 11, lineHeight: 20, fontWeight: "450", letterSpacing: -0.11, fontVariant: ["tabular-nums"] };

/**
 * The Intent slider: a rounded track that fills from the left as it is
 * dragged, its name and value written inside (in the fill's ink where the
 * fill covers them), with a thin handle at the fill's edge.
 */
export function Slider(props: SliderProps) {
  const trackWidth = signal(0);
  const hovered = signal(false);
  const dragging = signal(false);
  const editing = signal(false);
  const draft = signal("");
  let grant = { x: 0, pageX: 0 };

  const min = () => props.min ?? 0;
  const max = () => props.max ?? 100;
  const m = () => metrics[props.size ?? "small"];
  const fill = () => fills[props.color ?? "yellow"];
  const variant = () => props.variant ?? "inside";
  const outside = () => variant() === "inline" || variant() === "above";
  const progress = () => (max() === min() ? 0 : Math.min(1, Math.max(0, (props.value - min()) / (max() - min()))));
  const atMax = () => props.value >= max();
  const empty = () => props.value <= min();
  const shown = () => (props.format ? props.format(props.value) : String(props.value));
  const fillWidth = () => progress() * trackWidth();
  const fillEnd = () => Math.max(0, m().radius - (trackWidth() - fillWidth()));
  const track = () => (props.onSurface ? "bg-control-surface-muted" : "bg-control-surface");
  const editor = () => (props.onSurface ? "bg-control-surface" : "bg-control-surface-muted");
  const valuePadding = () => (atMax() ? (variant() === "inside" && props.size === "large" ? 20 : 15) : m().padding);
  const handleVisible = () => props.handle !== false && !empty() && (props.handle !== "hover" || hovered() || dragging());

  const snap = (raw: number) => {
    const step = props.step ?? 1;
    const snapped = Math.round((raw - min()) / step) * step + min();
    return Math.min(max(), Math.max(min(), Number(snapped.toFixed(10))));
  };
  const setFromX = (x: number) => {
    if (trackWidth() <= 0) return;
    const next = snap(min() + (x / trackWidth()) * (max() - min()));
    if (next !== props.value) props.onChange?.(next);
  };
  const commit = () => {
    const parsed = Number(draft().trim());
    editing.set(false);
    if (Number.isFinite(parsed)) {
      const next = snap(parsed);
      props.onChange?.(next);
      props.onChangeEnd?.(next);
    }
  };

  const texts = (ink: string) => (
    <View
      class="absolute flex items-center justify-between"
      style={{ top: 0, bottom: 0, left: 0, width: trackWidth(), paddingLeft: m().padding, paddingRight: valuePadding() }}
      pointerEvents="none"
    >
      {variant() === "inside" ? (
        <Text
          class={ink}
          style={[copy, { flexShrink: 1, transform: [{ translateX: empty() ? 5 : 0 }], transitionProperty: "transform", transitionDuration: 80 }]}
          numberOfLines={1}
        >
          {props.label ?? ""}
        </Text>
      ) : (
        <View />
      )}
      <Text
        class={ink}
        style={[copy, { paddingLeft: 5, fontWeight: variant() === "inside" ? "450" : "500", opacity: editing() ? 0 : variant() === "inside" && !atMax() ? 0.5 : props.editable ? 0.5 : 1 }]}
        numberOfLines={1}
      >
        {shown()}
      </Text>
    </View>
  );

  const control = () => (
    <View
      testID={props.testID}
      role="adjustable"
      accessibilityLabel={props.label}
      accessibilityValue={{ min: min(), max: max(), now: props.value, text: shown() }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(e) => {
        const step = props.step ?? 1;
        const next = snap(props.value + (e.actionName === "increment" ? step : -step));
        props.onChange?.(next);
        props.onChangeEnd?.(next);
      }}
      disabled={props.disabled}
      class={`relative overflow-hidden ${track()} text-control-ink`}
      style={{ height: m().height, borderRadius: m().radius, width: outside() ? undefined : props.width ?? m().width, flexGrow: outside() ? 1 : 0, minWidth: 0 }}
      onLayout={(b) => trackWidth.set(b.size.width)}
      onHoverIn={() => hovered.set(true)}
      onHoverOut={() => hovered.set(false)}
      onStartShouldSetResponder={() => !props.disabled && !editing()}
      onMoveShouldSetResponder={() => !props.disabled && !editing()}
      onResponderTerminationRequest={() => false}
      onResponderGrant={(e: GestureResponderEvent) => {
        grant = { x: e.locationX, pageX: e.pageX };
        dragging.set(true);
        setFromX(e.locationX);
      }}
      onResponderMove={(e: GestureResponderEvent) => setFromX(grant.x + (e.pageX - grant.pageX))}
      onResponderRelease={() => {
        dragging.set(false);
        props.onChangeEnd?.(props.value);
      }}
    >
      {texts("text-control-ink")}
      <View
        class={`absolute overflow-hidden ${fill().fill}`}
        // The fill carries the track's corners itself, its right ones as it
        // nears the end: Android does not clip it to the track.
        style={{ top: 0, bottom: 0, left: 0, width: fillWidth(), borderTopLeftRadius: m().radius, borderBottomLeftRadius: m().radius, borderTopRightRadius: fillEnd(), borderBottomRightRadius: fillEnd() }}
        pointerEvents="none"
      >
        {texts(fill().ink)}
      </View>
      {empty() && props.handle !== false ? (
        <View class="absolute bg-control-ink" pointerEvents="none" style={{ left: 6, width: 2, height: m().handle, top: (m().height - m().handle) / 2, borderRadius: 2, opacity: 0.2 }} />
      ) : null}
      <View
        class={`absolute ${track()} transition-opacity duration-150`}
        pointerEvents="none"
        style={{ left: Math.max(6, fillWidth() - 8), width: 2, height: m().handle, top: (m().height - m().handle) / 2, borderRadius: 2, opacity: handleVisible() ? 1 : 0 }}
      />
      {props.editable ? (
        editing() ? (
          <View class="absolute" style={{ top: 3, bottom: 3, right: 3, width: 40 + valuePadding() - 3 }}>
            <Input
              value={draft()}
              autoFocus
              keyboardType="decimal-pad"
              class={`h-full ${editor()} text-control-ink`}
              style={[copy, { fontWeight: "500", textAlign: "right", paddingLeft: 5, paddingRight: valuePadding() - 3, borderRadius: m().radius - 3 }]}
              onChange={(value: string) => draft.set(value)}
              onSubmit={() => commit()}
              onBlur={() => commit()}
            />
          </View>
        ) : (
          <View
            role="button"
            accessibilityLabel={`Edit ${props.label ?? "value"}`}
            disabled={props.disabled}
            class="absolute"
            style={{ top: 0, bottom: 0, right: 0, width: 40 + valuePadding() }}
            onPress={() => {
              draft.set(String(props.value));
              editing.set(true);
            }}
          />
        )
      ) : null}
    </View>
  );

  return (
    <View
      class={`${variant() === "above" ? "" : "flex items-center"} ${props.disabled ? "opacity-40" : ""} ${props.class ?? ""}`}
      style={[{ width: outside() ? props.width ?? 280 : undefined, gap: variant() === "above" ? 10 : 20, alignSelf: "flex-start" }, props.style ?? null]}
    >
      {outside() && props.label ? (
        <Text class="text-content" style={[copy, variant() === "inline" ? { width: 80, flexShrink: 0 } : { lineHeight: 8 }]} numberOfLines={1}>
          {props.label}
        </Text>
      ) : null}
      {control()}
    </View>
  );
}
