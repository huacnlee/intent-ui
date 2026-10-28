import type { ImageStyle, StyleProp } from "nsh";
import { Image } from "nsh";
import { icons12, icons16, type IconName, type SmallIconName } from "./icons";

export type { IconName, SmallIconName } from "./icons";

export type IconProps =
  | {
      /** The glyph, from the 16 px set. */
      name: IconName;
      /** The 16 px set (default). */
      size?: 16;
      /** Tailwind classes; a `tint-<token>` class colors the glyph (default `tint-content`). */
      class?: string;
      /** The inline style, over `class`; `tintColor` colors the glyph. */
      style?: StyleProp<ImageStyle>;
      /** What screen readers say; none hides the glyph from them (it is decoration). */
      accessibilityLabel?: string;
      /** Finds the icon in tests. */
      testID?: string;
    }
  | {
      /** The glyph, from the 12 px set. */
      name: SmallIconName;
      /** The 12 px set. */
      size: 12;
      /** Tailwind classes; a `tint-<token>` class colors the glyph. */
      class?: string;
      /** The inline style, over `class`; `tintColor` colors the glyph. */
      style?: StyleProp<ImageStyle>;
      /** What screen readers say; none hides the glyph from them. */
      accessibilityLabel?: string;
      /** Finds the icon in tests. */
      testID?: string;
    };

/**
 * A glyph of the Intent icon set: 1.33 pt line drawings on a 16 pt (or
 * 12 pt) grid, tinted one color.
 */
export function Icon(props: IconProps) {
  const size = () => props.size ?? 16;
  const src = () => (props.size === 12 ? icons12[props.name as SmallIconName] : icons16[props.name as IconName]);
  return (
    <Image
      src={src()}
      testID={props.testID}
      accessibilityLabel={props.accessibilityLabel}
      class={props.class ?? "tint-content"}
      style={[{ width: size(), height: size(), flexShrink: 0 }, props.style ?? null]}
    />
  );
}

/**
 * A glyph drawn from the 12 px set when it has one, else from the 16 px set:
 * the compact controls (dropdown rows, combo buttons) use 12 px glyphs.
 */
export function CompactIcon(props: { name: IconName; class?: string }) {
  return props.name in icons12 ? (
    <Icon name={props.name as SmallIconName} size={12} class={props.class} />
  ) : (
    <Icon name={props.name} class={props.class} />
  );
}
