# Intent UI

An implementation of the [Intent design system](https://intentapp.dev/design-system) for NSH (Native Shell) 0.3.0. The same TSX renders natively on iOS, Android, macOS, Windows, Linux, and the web, with light and dark themes.

The repository also contains a gallery app (`App.tsx`) showing the design system's logo, colors, gradients, typography, iconography, foundations, and components.

<img width="1312" height="940" alt="image" src="https://github.com/user-attachments/assets/452b3d5a-9b71-4065-99dc-1171d46b737e" />

```sh
nsh run --target web     # Open the gallery in a browser
nsh run                  # Open it in a desktop window
nsh test                 # Run headless interaction tests
nsh check                # Type-check the app and tests
```

## Usage

1. Add this repository to your NSH app, for example by copying it to `vendor/intent-ui` or adding it as a Git dependency.
2. Set the Intent theme in `nsh.json`. Component color classes such as `bg-control-surface` and `text-content-muted` depend on it:

   ```json
   { "theme": "vendor/intent-ui/theme.json", "appearance": "system" }
   ```

3. Import components from the entry point, which also registers the Inter font:

   ```tsx
   import { signal, View } from "nsh";
   import { Button, Dropdown, Switch } from "./vendor/intent-ui/src";

   export default function App() {
     const model = signal("sonnet");
     const on = signal(true);
     return (
       <View class="flex-1 bg-canvas p-[30px] gap-[20px]">
         <Button label="Get started" color="citrus" onPress={() => {}} />
         <Dropdown
           value={model()}
           options={[
             { value: "opus", label: "Claude Opus" },
             { value: "sonnet", label: "Claude Sonnet" },
           ]}
           onChange={(v) => model.set(v)}
         />
         <Switch checked={on()} accessibilityLabel="Notifications" onChange={(v) => on.set(v)} />
       </View>
     );
   }
   ```

Components are controlled: the app owns their values and updates them in `onChange`. Use an arrow function for callbacks such as `onChange={(v) => model.set(v)}`. Passing `model.set` directly detaches it from its signal and throws `not a live signal`.

## Components

| Component | Description | Main props |
|---|---|---|
| `Button` | Five colors, four sizes, hover animation and icon tooltips | `label`, `color`, `size`, `variant`, `icon`, `disabled`, `tooltip`, `roll` |
| `Switch` | Pill switch with a springing thumb | `checked`, `size`, `tone`, `disabled` |
| `Checkbox` | Checked and indeterminate states | `checked`, `indeterminate`, `size`, `disabled` |
| `Tabs` | Tabs with an animated selection | `items`, `value`, `size`, `color`, `variant` |
| `Dropdown` | Trigger and floating option menu | `options`, `value`, `placeholder`, `size`, `margin`, `color`, `placement`, `icon` |
| `ContextMenu` | Right-click or long-press menu | `options`, `icon`, `width`, `onSelect`, `children` |
| `ComboButton` | Grouped icon actions | `actions`, `color`, `size`, `variant`, `tooltips` |
| `IconControl` | Unfilled icon button | `icon`, `label`, `tint`, `disabled` |
| `SideNav` | Grouped navigation with optional numbering or actions | `groups`, `value`, `variant`, `color`, `width`, `actions`, `onAction` |
| `Slider` | Filled track with optional label and editable value | `value`, `min`, `max`, `step`, `label`, `variant`, `size`, `color`, `handle`, `editable`, `format`, `onSurface` |
| `FormField` | Input with optional icon, clear button, error and masking | `value`, `placeholder`, `size`, `color`, `icon`, `clearable`, `error`, `masked` |
| `ModelSwitcher` | Model selection group | `options`, `value`, `color` |
| `SegmentedControl` | Segmented single selection | `segments`, `value` |
| `ApplicationSurface` | Raised application panel | `radius`, `clip`, `onPress` |
| `ConversationMessage` | User, assistant or feedback message | `role`, `text`, `compact` |
| `PanelToolbar` | Toolbar for application panels | `tools`, `value`, `onChange` |
| `PanelTitle` | Task title and repository | `title`, `repo` |
| `AgentThread` | Conversation thread with text, tools and headings | `steps` |
| `AgentComposer` | Thread input, model, voice and send controls | `value`, `placeholder`, `model`, `onChange`, `onSubmit`, `onVoice` |
| `AgentPanel` | Agent preview panel | `title`, `steps`, `children`, `onClose` |
| `PanelGroup` | Panel tiles and detail card | `tools`, `value`, `detail`, `onChange` |
| `TaskCard` / `TaskProgress` | Task details and segmented progress | `title`, `repo`, `description`, `progress`, `value`, `onChange`, `onMore` |
| `AgentActivity` | Progressively revealed activity log | `steps`, `revealed`, `onLink` |
| `SpecDocument` | Specification with a checklist | `intro`, `title`, `items`, `onToggle` |
| `ApiKeyPolicy` | Save-key-on-device checkbox | `saved`, `label`, `onChange` |
| `Mark` | Intent mark with optional Bloom animation | `size`, `animation`, `loop`, `class` |
| `Wordmark` | Intent wordmark | `size`, `class` |
| `PlatformIcon` | Apple, GitHub and Windows marks | `name`, `size` |
| `Navigation` | Site header with links, mark and action | `links`, `action`, `onNavigate`, `onHome`, `onAction` |
| `Gradient` | Canvas-rendered design system gradient | `name`, `radius`, `outlined` |
| `Type` | Responsive typography scale | `variant`, `at`, `tone`, `numberOfLines`, `heading` |
| `TooltipContent` / `tooltipProps` | Tooltip content and configuration | `label`, `variant`, `placement` |
| `Icon` | Token-tinted 16 pt and 12 pt icons | `name`, `size`, `class` |

All components accept `testID`, `class`, and `style`. Options use `<testID>-<value>` as their test ID, making them easy to locate in `nsh test`.

## Tooltips

NSH requires an inline `nsh/base` `<Tooltip>` for the `tooltip` prop. Wrapping it in a component or returning it from a function does not display it, so this library provides the content and configuration separately:

```tsx
import { View } from "nsh";
import { Tooltip } from "nsh/base";
import { TooltipContent, tooltipProps } from "./vendor/intent-ui/src";

<View
  tooltip={
    <Tooltip {...tooltipProps({ placement: "top" })}>
      <TooltipContent label="Copy" />
    </Tooltip>
  }
/>;
```

By default, `tooltipProps` uses an 800 ms delay and a 5 pt offset. A tooltip on an `nsh/base` `Button` must be attached to a `View` inside it; this library's `Button` and `ComboButton` handle that already.

## Design tokens

- **Colors:** `theme.json` provides light and dark semantic tokens, used through classes such as `bg-canvas`, `bg-surface`, `bg-control-surface`, `text-content-muted`, `border-border`, and `outline-focus-ring`. Icons use `tint-<token>`.
- **Geometry:** `src/tokens.ts` exports `radius`, `space`, `controlHeight`, `shadowElevated`, `ease`, `duration`, and `colorTransition`.
- **Typography:** `text` contains the design system's typography scale. `textScale`, `breakpoint(width)`, and `textAt(variant, at)` provide tablet and mobile sizes.
- **Gradients:** Six gradients are available: `lightGreyToYellow`, `mediumGreyToYellow`, `greyToYellow`, `yellowWash`, `yellowToGrey`, and `lightYellows`. Use `Gradient` for accurate Canvas rendering, including elliptical radial gradients and rounded clipping. The `gradients` strings can be used as `backgroundImage` approximations, but NSH's radial gradient limitations make them less accurate.

## Fonts

Inter is included under the SIL OFL 1.1; see `src/fonts/Inter-LICENSE.txt`. ABC Arizona Mix and Aeonik Mono are commercial fonts and are not redistributed. Display text and mono text fall back to the system serif and monospace fonts respectively. Apps with licenses can register the fonts before the first render:

```tsx
import Arizona from "./fonts/ABCArizonaMix-Regular.otf";
import Aeonik from "./fonts/AeonikMono-Regular.otf";
import { configureFonts } from "./vendor/intent-ui/src";

configureFonts({ display: Arizona, mono: Aeonik });
```

## Fidelity and platform notes

The light and dark themes were checked against the [original design system](https://intentapp.dev/design-system), using computed styles and CSS as references. Colors, typography, icons, foundations, component dimensions and variants were compared. The six Canvas gradients were compared pixel by pixel: excluding antialiased rounded edges, maximum channel error was 2/255 and mean error was below 1/255. The Bloom animation is calculated from the original Lottie keyframes and tested against lottie-web.

Licensed fonts differ until registered. The `backgroundImage` gradient strings are approximations; use `Gradient` for fidelity. The documentation site's own navigation, scroll effects and theme switch are outside the component specification. Marketing illustrations requiring WebGL or canvas animation are not implemented.

Native screenshots were checked on macOS, an iOS simulator and an Android emulator. Android's host does not clip child views with `overflow: hidden`, so the components account for this where needed. Bloom looping uses a timer to avoid delayed animation completion on Android. On iOS, place `FormField` inside a `Scroll` with `keyboardShouldPersistTaps="handled"` so its clear button works on the first tap while the keyboard is open.

## Tests

`tests/gallery.test.tsx` exercises the gallery's controls, navigation, previews, panels and agent interfaces. Tests enable reduced motion to avoid waiting for the looping Bloom animation. `tests/mark.test.tsx` compares Bloom frames with lottie-web.

```sh
nsh test
nsh test --target macos
nsh test --target ios
nsh test --target android
```

As of 2026-10-28, headless, macOS and iOS runs passed 19/19 tests. The latest Android run passed 17/19; each test has passed in at least one run, but host step and test timeouts vary between runs.

## License

The code is licensed under Apache-2.0. The Intent name and visual design belong to their authors.
