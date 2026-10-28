import { signal, Text, View } from "nsh";
import {
  Button,
  Checkbox,
  ComboButton,
  ContextMenu,
  Dropdown,
  FormField,
  ModelSwitcher,
  SideNav,
  Slider,
  Switch,
  Tabs,
  TooltipContent,
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
  type ComboAction,
  type ComboButtonColor,
  type ComboButtonSize,
  type ComboButtonVariant,
  type DropdownColor,
  type DropdownMargin,
  type DropdownPlacement,
  type DropdownSize,
  type FormFieldColor,
  type FormFieldSize,
  type MenuIconSide,
  type MenuOption,
  type ModelOption,
  type SideNavColor,
  type SideNavGroup,
  type SideNavVariant,
  type SideNavWidth,
  type SliderColor,
  type SliderSize,
  type SliderVariant,
  type SwitchSize,
  type SwitchTone,
  type TabsColor,
  type TabsSize,
  type TabsVariant,
  type TooltipPlacement,
  type TooltipVariant,
} from "../src";
import { Choice, opts, Showcase, Swatches, type Swatch } from "./showcase";

// intentapp.dev's showcases, each prop a control beside the preview, with
// the page's options and defaults (the first of each).

const buttonSwatches: Swatch<ButtonColor>[] = [
  { value: "black", label: "Black", class: "bg-inverse-surface", ink: "tint-inverse-content" },
  { value: "citrus", label: "Citrus", class: "bg-accent", ink: "tint-content-fixed-dark" },
  { value: "white", label: "White", class: "bg-control-surface border border-border", ink: "tint-content" },
  { value: "grey", label: "Grey", class: "bg-control-surface-active border border-palette-black-10", ink: "tint-content" },
  { value: "outline", label: "Outline", class: "border border-border-strong", ink: "tint-content" },
];

export function ButtonShowcase() {
  const color = signal<ButtonColor>("black");
  const size = signal<ButtonSize>("large");
  const variant = signal<ButtonVariant>("text");
  const state = signal("default");
  const tooltip = signal("enabled");
  return (
    <Showcase
      id="showcase-button"
      title="Buttons"
      controls={
        <>
          <Swatches testID="showcase-button-color" label="Color" swatches={buttonSwatches} value={color()} onChange={(x) => color.set(x)} />
          <Choice label="Size" options={opts<ButtonSize>("Large", "Small", "Extra Small")} value={size()} onChange={(x) => size.set(x)} />
          <Choice
            testID="showcase-button-variant"
            label="Variant"
            options={opts<ButtonVariant>(["text", "Text Only"], ["text-icon", "Text + Icon"], ["icon", "Icon Only"], ["icon-expand", "Icon Expand"])}
            value={variant()}
            onChange={(x) => variant.set(x)}
          />
          <Choice label="State" options={opts("Default", "Disabled")} value={state()} onChange={(x) => state.set(x)} />
          {/* The tooltip is an icon button's: the row shows for one. */}
          {variant() === "icon" ? <Choice label="Tooltip" options={opts("Enabled", "Disabled")} value={tooltip()} onChange={(x) => tooltip.set(x)} /> : null}
        </>
      }
    >
      {() => (
        <Button
          testID="showcase-button-target"
          label="Download For MacOS"
          icon="arrow-right"
          color={color()}
          size={size()}
          variant={variant()}
          disabled={state() === "disabled"}
          tooltip={tooltip() === "enabled"}
        />
      )}
    </Showcase>
  );
}

const sizes: MenuOption[] = [
  { value: "small", label: "Small", icon: "save" },
  { value: "medium", label: "Medium", icon: "eye" },
  { value: "large", label: "Large", icon: "check" },
];

export function DropdownShowcase() {
  const color = signal<DropdownColor>("grey");
  const size = signal<DropdownSize>("s");
  const list = signal("simple");
  const icon = signal<MenuIconSide>("none");
  const margin = signal<DropdownMargin>("tight");
  const placement = signal<DropdownPlacement>("center");
  const state = signal("closed");
  const value = signal("small");
  const options = () => (list() === "grouped" ? sizes.map((o) => ({ ...o, group: o.value === "small" ? "Recent" : "All" })) : sizes);
  return (
    <Showcase
      id="showcase-dropdown"
      title="Dropdown"
      controls={
        <>
          <Choice label="Color" options={opts<DropdownColor>("Grey", "White")} value={color()} onChange={(x) => color.set(x)} />
          <Choice label="Size" options={opts<DropdownSize>(["s", "Small"], ["m", "Medium"], ["l", "Large"])} value={size()} onChange={(x) => size.set(x)} />
          <Choice label="List" options={opts("Simple", "Grouped")} value={list()} onChange={(x) => list.set(x)} />
          <Choice label="Item icon" options={opts<MenuIconSide>("None", "Left", "Right")} value={icon()} onChange={(x) => icon.set(x)} />
          <Choice label="Margin" options={opts<DropdownMargin>("Tight", "Default")} value={margin()} onChange={(x) => margin.set(x)} />
          <Choice label="Position" options={opts<DropdownPlacement>("Center", "Bottom", "Top")} value={placement()} onChange={(x) => placement.set(x)} />
          <Choice testID="showcase-dropdown-state" label="State" options={opts("Closed", "Opened")} value={state()} onChange={(x) => state.set(x)} />
        </>
      }
    >
      {() => (
        <Dropdown
          testID="showcase-dropdown-target"
          options={options()}
          value={value()}
          color={color()}
          size={size()}
          icon={icon()}
          margin={margin()}
          placement={placement()}
          width={180}
          open={state() === "opened"}
          onOpenChange={(open) => state.set(open ? "opened" : "closed")}
          onChange={(x) => value.set(x)}
        />
      )}
    </Showcase>
  );
}

const models: ModelOption[] = [
  { value: "gpt", label: "GPT-Live", icon: "openai" },
  { value: "grok", label: "Grok", icon: "grok" },
  { value: "gemini", label: "Gemini", icon: "gemini" },
];

export function ModelSwitcherShowcase() {
  const color = signal<"grey" | "white">("grey");
  const amount = signal("three");
  const value = signal("gpt");
  return (
    <Showcase
      id="showcase-model"
      title="Model switcher"
      controls={
        <>
          <Choice label="Color" options={opts<"grey" | "white">("Grey", "White")} value={color()} onChange={(x) => color.set(x)} />
          <Choice label="Models" options={opts("Three", "Two")} value={amount()} onChange={(x) => amount.set(x)} />
        </>
      }
    >
      {() => <ModelSwitcher options={amount() === "two" ? models.slice(0, 2) : models} value={value()} color={color()} onChange={(x) => value.set(x)} />}
    </Showcase>
  );
}

export function TabsShowcase() {
  const color = signal<TabsColor>("grey");
  const size = signal<TabsSize>("large");
  const variant = signal<TabsVariant>("text");
  const amount = signal("two");
  const value = signal("one");
  const items = () => ["One", "Two", "Three"].slice(0, amount() === "two" ? 2 : 3).map((label) => ({ value: label.toLowerCase(), label, icon: "flower-burst" as const }));
  return (
    <Showcase
      id="showcase-tabs"
      title="Tabs"
      controls={
        <>
          <Choice label="Color" options={opts<TabsColor>(["grey", "Grey"], ["white-dark", "White + Dark"], ["white-grey", "White + Grey"])} value={color()} onChange={(x) => color.set(x)} />
          <Choice label="Size" options={opts<TabsSize>("Large", "Small")} value={size()} onChange={(x) => size.set(x)} />
          <Choice label="Variant" options={opts<TabsVariant>("Text", "Icon")} value={variant()} onChange={(x) => variant.set(x)} />
          <Choice label="Amount" options={opts("Two", "Three")} value={amount()} onChange={(x) => amount.set(x)} />
        </>
      }
    >
      {() => <Tabs items={items()} value={value()} color={color()} size={size()} variant={variant()} onChange={(x) => value.set(x)} />}
    </Showcase>
  );
}

const comboActions: ComboAction[] = [
  { value: "confirm", label: "Confirm", icon: "check" },
  { value: "delete", label: "Delete", icon: "delete" },
  { value: "pin", label: "Pin", icon: "pin" },
];

export function ComboButtonShowcase() {
  const variant = signal<ComboButtonVariant>("divider");
  const size = signal<ComboButtonSize>("small");
  const color = signal<ComboButtonColor>("grey");
  const amount = signal("two");
  const state = signal("default");
  const actions = () => comboActions.slice(0, amount() === "two" ? 2 : 3).map((a) => ({ ...a, disabled: state() === "disabled" }));
  return (
    <Showcase
      id="showcase-combo"
      title="Combo Button"
      controls={
        <>
          <Choice label="Variant" options={opts<ComboButtonVariant>("Divider", "Simple")} value={variant()} onChange={(x) => variant.set(x)} />
          <Choice label="Size" options={opts<ComboButtonSize>("Small", "Medium")} value={size()} onChange={(x) => size.set(x)} />
          <Choice label="Color" options={opts<ComboButtonColor>("Grey", "White", "Dark")} value={color()} onChange={(x) => color.set(x)} />
          <Choice label="Amount" options={opts("Two", "Three")} value={amount()} onChange={(x) => amount.set(x)} />
          <Choice label="State" options={opts("Default", "Disabled")} value={state()} onChange={(x) => state.set(x)} />
        </>
      }
    >
      {() => <ComboButton actions={actions()} variant={variant()} size={size()} color={color()} />}
    </Showcase>
  );
}

export function SwitchShowcase() {
  const size = signal<SwitchSize>("small");
  const tone = signal<SwitchTone>("normal");
  const on = signal(false);
  return (
    <Showcase
      id="showcase-switch"
      title="Switch"
      controls={
        <>
          <Choice label="Size" options={opts<SwitchSize>("Small", "Large", "Small Short")} value={size()} onChange={(x) => size.set(x)} />
          <Choice label="Color" options={opts<SwitchTone>("Normal", "Inverted")} value={tone()} onChange={(x) => tone.set(x)} />
        </>
      }
    >
      {() => <Switch testID="showcase-switch-target" checked={on()} size={size()} tone={tone()} accessibilityLabel="Switch preview" onChange={(x) => on.set(x)} />}
    </Showcase>
  );
}

export function SliderShowcase() {
  const color = signal<SliderColor>("yellow");
  const variant = signal<SliderVariant>("inside");
  const size = signal<SliderSize>("small");
  const handle = signal("on");
  const editable = signal("off");
  const value = signal(0.8);
  return (
    <Showcase
      id="showcase-slider"
      title="Slider"
      controls={
        <>
          <Choice label="Color" options={opts<SliderColor>(["yellow", "Primary"], ["grey", "Grey"], ["black", "Black"])} value={color()} onChange={(x) => color.set(x)} />
          <Choice
            label="Label"
            options={opts<SliderVariant>(["inside", "Inside"], ["none", "None"], ["inline", "Inline Before"], ["above", "Above"])}
            value={variant()}
            onChange={(x) => variant.set(x)}
          />
          <Choice label="Size" options={opts<SliderSize>("Small", "Large")} value={size()} onChange={(x) => size.set(x)} />
          <Choice label="Handle" options={opts("On", "Off", "On Hover")} value={handle()} onChange={(x) => handle.set(x)} />
          <Choice label="Editable value" options={opts("Off", "On")} value={editable()} onChange={(x) => editable.set(x)} />
        </>
      }
    >
      {(backdrop) => (
        <Slider
          label="Property"
          value={value()}
          min={0}
          max={1}
          step={0.1}
          format={(v) => v.toFixed(1)}
          color={color()}
          variant={variant()}
          size={size()}
          handle={handle() === "on" ? true : handle() === "off" ? false : "hover"}
          editable={editable() === "on"}
          onSurface={backdrop === "white"}
          width={200}
          onChange={(x) => value.set(x)}
        />
      )}
    </Showcase>
  );
}

export function CheckboxShowcase() {
  const size = signal<"medium" | "small">("medium");
  const state = signal("off");
  return (
    <Showcase
      id="showcase-checkbox"
      title="Checkbox"
      controls={
        <>
          <Choice label="Size" options={opts<"medium" | "small">("Medium", "Small")} value={size()} onChange={(x) => size.set(x)} />
          <Choice testID="showcase-checkbox-state" label="State" options={opts("Off", "On", "Disabled", "Mixed")} value={state()} onChange={(x) => state.set(x)} />
        </>
      }
    >
      {() => (
        <Checkbox
          testID="showcase-checkbox-target"
          checked={state() === "on"}
          indeterminate={state() === "mixed"}
          disabled={state() === "disabled"}
          size={size()}
          accessibilityLabel={`${size()} ${state()} checkbox preview`}
          onChange={(x) => state.set(x ? "on" : "off")}
        />
      )}
    </Showcase>
  );
}

export function FormFieldShowcase() {
  const color = signal<FormFieldColor>("grey");
  const size = signal<FormFieldSize>("medium");
  const state = signal("enabled");
  const icon = signal("right");
  const value = signal("");
  const field = (focus: boolean) => (
    <FormField
      testID="showcase-field-target"
      value={value()}
      placeholder="Search"
      color={color()}
      size={size()}
      icon={icon() === "right" ? "search" : undefined}
      clearable
      error={state() === "error" ? "Error message" : null}
      disabled={state() === "disabled"}
      autoFocus={focus}
      width={240}
      onChange={(x) => value.set(x)}
    />
  );
  return (
    <Showcase
      id="showcase-field"
      title="Form field"
      controls={
        <>
          <Choice label="Color" options={opts<FormFieldColor>("Grey", "White", "Outline")} value={color()} onChange={(x) => color.set(x)} />
          <Choice label="Size" options={opts<FormFieldSize>("Medium", "Small")} value={size()} onChange={(x) => size.set(x)} />
          <Choice label="State" options={opts("Enabled", "Focus", "Error", "Disabled")} value={state()} onChange={(x) => state.set(x)} />
          <Choice label="Icon" options={opts("Right", "None")} value={icon()} onChange={(x) => icon.set(x)} />
        </>
      }
    >
      {/* Focus is a field's on coming in: the focused one is a new field. */}
      {() => (state() === "focus" ? field(true) : field(false))}
    </Showcase>
  );
}

export function TooltipShowcase() {
  const variant = signal<TooltipVariant>("simple");
  const placement = signal<TooltipPlacement>("top");
  return (
    <Showcase
      id="showcase-tooltip"
      title="Tooltip"
      controls={
        <>
          <Choice label="Variant" options={opts<TooltipVariant>("Simple", "Tip")} value={variant()} onChange={(x) => variant.set(x)} />
          <Choice label="Placement" options={opts<TooltipPlacement>("Top", "Bottom")} value={placement()} onChange={(x) => placement.set(x)} />
        </>
      }
    >
      {() => <TooltipContent label="Copy" variant={variant()} placement={placement()} />}
    </Showcase>
  );
}

const edits: MenuOption[] = [
  { value: "copy", label: "Copy", icon: "copy" },
  { value: "duplicate", label: "Duplicate", icon: "save" },
  { value: "rename", label: "Rename", icon: "selection-text" },
  { value: "delete", label: "Delete", icon: "delete" },
];

export function ContextMenuShowcase() {
  const list = signal("simple");
  const icon = signal<MenuIconSide>("left");
  const chosen = signal("");
  const options = () => (list() === "grouped" ? edits.map((o, i) => ({ ...o, group: i < 2 ? "Clipboard" : "Item" })) : edits);
  return (
    <Showcase
      id="showcase-context"
      title="Context menu"
      controls={
        <>
          <Choice label="List" options={opts("Simple", "Grouped")} value={list()} onChange={(x) => list.set(x)} />
          <Choice label="Item icon" options={opts<MenuIconSide>("Left", "None")} value={icon()} onChange={(x) => icon.set(x)} />
        </>
      }
    >
      {() => (
        <View class="items-center" style={{ gap: 10 }}>
          <ContextMenu options={options()} icon={icon()} onSelect={(x) => chosen.set(x)}>
            <Text class="text-content" style={{ fontSize: 14, lineHeight: 24, letterSpacing: -0.28, fontWeight: "500" }}>
              Selected text
            </Text>
          </ContextMenu>
          {chosen() ? <Text class="text-content-muted" style={{ fontSize: 12 }}>{`Chose ${chosen()}`}</Text> : null}
        </View>
      )}
    </Showcase>
  );
}

const navs: Record<SideNavVariant, SideNavGroup> = {
  simple: { title: "Introduction", items: [{ value: "logo", label: "Logo" }, { value: "color", label: "Color" }, { value: "typography", label: "Typography" }] },
  itemized: { title: "Design system", items: [{ value: "logo", label: "Logo" }, { value: "color", label: "Color" }, { value: "typography", label: "Typography" }] },
  actions: { title: "Saved sessions", items: [{ value: "onboarding", label: "Onboarding flow" }, { value: "pricing", label: "Pricing page" }, { value: "mobile", label: "Mobile app" }] },
};

export function SideNavShowcase() {
  const variant = signal<SideNavVariant>("simple");
  const color = signal<SideNavColor>("grey");
  const width = signal<SideNavWidth>("hug");
  const eyebrow = signal("shown");
  const value = signal<string | null>(null);
  const group = () => (eyebrow() === "shown" ? navs[variant()] : { items: navs[variant()].items });
  return (
    <Showcase
      id="showcase-nav"
      title="Side navigation"
      controls={
        <>
          <Choice label="List" options={opts<SideNavVariant>(["simple", "Simple"], ["itemized", "Itemized"], ["actions", "With actions"])} value={variant()} onChange={(x) => variant.set(x)} />
          <Choice label="Color" options={opts<SideNavColor>("Grey", "White")} value={color()} onChange={(x) => color.set(x)} />
          <Choice label="Width" options={opts<SideNavWidth>(["hug", "Hug content"], ["fixed", "Fixed"])} value={width()} onChange={(x) => width.set(x)} />
          <Choice label="Eyebrow" options={opts("Shown", "Hidden")} value={eyebrow()} onChange={(x) => eyebrow.set(x)} />
        </>
      }
    >
      {() => (
        <SideNav
          groups={[group()]}
          value={value()}
          variant={variant()}
          color={color()}
          width={width()}
          actions={[
            { value: "rename", label: "Rename", icon: "edit" },
            { value: "delete", label: "Delete", icon: "delete" },
          ]}
          style={{ width: 220 }}
          onChange={(x) => value.set(x)}
        />
      )}
    </Showcase>
  );
}

/** All of intentapp.dev's showcases, one after another. */
export function Showcases() {
  return (
    <View style={{ gap: 20 }}>
      <ButtonShowcase />
      <DropdownShowcase />
      <ModelSwitcherShowcase />
      <TabsShowcase />
      <ComboButtonShowcase />
      <SwitchShowcase />
      <SliderShowcase />
      <CheckboxShowcase />
      <FormFieldShowcase />
      <TooltipShowcase />
      <ContextMenuShowcase />
      <SideNavShowcase />
    </View>
  );
}
