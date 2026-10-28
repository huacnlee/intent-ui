import type { JSX } from "nsh";
import { ContextMenu as BaseContextMenu } from "nsh/base";
import { menuSurfaceClass, MenuRows, type MenuIconSide, type MenuOption } from "./menu-parts";
import { radius, shadowElevated } from "./tokens";

export interface ContextMenuProps<V extends string = string> {
  /** The commands. */
  options: MenuOption<V>[];
  /** Where the commands' glyphs go (default `left`). */
  icon?: MenuIconSide;
  /** The width of the menu (default 140). */
  width?: number;
  /** No menu. */
  disabled?: boolean;
  /** Open (controlled). Without it the menu keeps its own state. */
  open?: boolean;
  /** It opened or closed. */
  onOpenChange?: (open: boolean) => void;
  /** Finds the commands in tests: `<testID>-<value>`. */
  testID?: string;
  /** What it is about: a right click on it (a held finger on touch screens) opens the menu. */
  children: JSX.Element;
  /** A command was chosen. */
  onSelect?: (value: V) => void;
}

/**
 * The Intent context menu: a compact light popup of 35 pt rows at the
 * pointer, opened by a right click (a held finger on touch screens).
 */
export function ContextMenu<V extends string = string>(props: ContextMenuProps<V>) {
  return (
    <BaseContextMenu
      open={props.open}
      disabled={props.disabled}
      popupClass={menuSurfaceClass}
      popupStyle={{ width: props.width ?? 140, padding: 5, borderRadius: radius.m, boxShadow: shadowElevated }}
      onOpenChange={props.onOpenChange ? (open) => props.onOpenChange?.(open) : undefined}
      trigger={props.children}
    >
      <MenuRows
        options={props.options}
        metrics={{ height: 35, inline: 10, gap: 10, radius: radius.s }}
        icon={props.icon ?? "left"}
        testID={props.testID}
        onSelect={(value) => props.onSelect?.(value)}
      />
    </BaseContextMenu>
  );
}
