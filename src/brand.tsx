import type { ImageStyle, StyleProp, ViewStyle } from "nsh";
import { Image, Text, View, windowSize } from "nsh";
import { Button as BaseButton } from "nsh/base";
import apple from "./assets/apple.svg";
import github from "./assets/github.svg";
import windows from "./assets/windows.svg";
import wordmark from "./assets/intent_wordmark.svg";
import { Button } from "./button";
import { Mark } from "./mark";

// The wordmark's proportions (its viewBox is 895 × 260).
const wordmarkRatio = 895 / 260;

export interface WordmarkProps {
  /** The width, in points; the height keeps the artwork's proportions (default 172, as intentapp.dev shows it). */
  size?: number;
  /** A `tint-<token>` class (default `tint-content`). */
  class?: string;
  /** The inline style. */
  style?: StyleProp<ImageStyle>;
  /** What screen readers say (default "Intent"). */
  accessibilityLabel?: string;
  /** Finds the wordmark in tests. */
  testID?: string;
}

/** The Intent wordmark (intentapp.dev's SystemIcon), tinted one color. */
export function Wordmark(props: WordmarkProps) {
  const size = () => props.size ?? 172;
  return (
    <Image
      src={wordmark}
      testID={props.testID}
      accessibilityLabel={props.accessibilityLabel ?? "Intent"}
      class={props.class ?? "tint-content"}
      style={[{ width: size(), height: size() / wordmarkRatio }, props.style ?? null]}
    />
  );
}

/** A platform Intent runs on, or ships from. */
export type Platform = "apple" | "github" | "windows";

const platforms: Record<Platform, { src: typeof apple; label: string }> = {
  apple: { src: apple, label: "macOS" },
  github: { src: github, label: "GitHub" },
  windows: { src: windows, label: "Windows" },
};

export interface PlatformIconProps {
  /** The platform. */
  name: Platform;
  /** The side, in points (default 28). */
  size?: number;
  /** A `tint-<token>` class (default `tint-content`). */
  class?: string;
  /** The inline style. */
  style?: StyleProp<ImageStyle>;
  /** What screen readers say; none hides the glyph from them. */
  accessibilityLabel?: string;
  /** Finds the icon in tests. */
  testID?: string;
}

/** A platform's logo — Apple, GitHub or Windows — filled one color. */
export function PlatformIcon(props: PlatformIconProps) {
  const size = () => props.size ?? 28;
  return (
    <Image
      src={platforms[props.name].src}
      testID={props.testID}
      accessibilityLabel={props.accessibilityLabel}
      class={props.class ?? "tint-content"}
      style={[{ width: size(), height: size(), flexShrink: 0 }, props.style ?? null]}
    />
  );
}

/** A link of the navigation bar. */
export interface NavigationLink<V extends string = string> {
  value: V;
  label: string;
}

export interface NavigationProps<V extends string = string> {
  /** The links at the left (default Docs and Updates). */
  links?: NavigationLink<V>[];
  /** The button at the right (default "Download"). */
  action?: string;
  /** Finds the bar in tests; each link is `<testID>-<value>`, the mark `<testID>-home`, the button `<testID>-action`. */
  testID?: string;
  /** Extra Tailwind classes. */
  class?: string;
  /** The inline style. */
  style?: StyleProp<ViewStyle>;
  /** A link was pressed. */
  onNavigate?: (value: V) => void;
  /** The mark was pressed. */
  onHome?: () => void;
  /** The button was pressed. */
  onAction?: () => void;
}

/**
 * intentapp.dev's site navigation: the links at the left, the mark in the
 * middle, a small citrus button at the right.
 */
export function Navigation<V extends string = string>(props: NavigationProps<V>) {
  // As intentapp.dev's page: the mark is 35 pt, 40 pt from 480 pt wide.
  const mark = () => (windowSize().width < 480 ? 35 : 40);
  const links = () => props.links ?? ([{ value: "docs", label: "Docs" }, { value: "updates", label: "Updates" }] as NavigationLink<V>[]);
  return (
    <View
      testID={props.testID}
      accessibilityLabel="Primary"
      class={`flex flex-row items-center ${props.class ?? ""}`}
      style={props.style}
    >
      <View class="flex flex-row items-center" style={{ flex: 1, flexBasis: 0, gap: 24 }}>
        {links().map((link) => (
          <BaseButton
            testID={props.testID ? `${props.testID}-${link.value}` : undefined}
            role="link"
            accessibilityLabel={link.label}
            class="focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
            onPress={() => props.onNavigate?.(link.value)}
          >
            <Text class="text-content" style={{ fontSize: windowSize().width < 768 ? 13 : 14, lineHeight: 15.4, fontWeight: "500" }}>
              {link.label}
            </Text>
          </BaseButton>
        ))}
      </View>
      <BaseButton
        testID={props.testID ? `${props.testID}-home` : undefined}
        role="link"
        accessibilityLabel="Intent home"
        class="items-center justify-center focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
        style={{ width: mark(), height: mark() }}
        onPress={() => props.onHome?.()}
      >
        <Mark size={mark()} class="tint-content" accessibilityLabel="" />
      </BaseButton>
      <View class="flex flex-row items-center justify-end" style={{ flex: 1, flexBasis: 0 }}>
        <Button
          testID={props.testID ? `${props.testID}-action` : undefined}
          label={props.action ?? "Download"}
          color="citrus"
          onPress={() => props.onAction?.()}
        />
      </View>
    </View>
  );
}
