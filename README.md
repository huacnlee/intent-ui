# Intent UI

把 [Intent](https://github.com/intent-hq/intent) 的 Design System（[intentapp.dev/design-system](https://intentapp.dev/design-system)）实现为 NSH（Native Shell）0.3.0 的 UI 组件库。同一份 TSX 在 iOS、Android、macOS、Windows、Linux 与 Web 上原生渲染，明暗两套配色都按设计稿还原。

仓库同时是一个 gallery app（`App.tsx`），按设计系统页面的顺序展示：Logo、Color、Gradients、Typography、Iconography、Foundations，然后是全部组件。

```sh
nsh run --target web     # 在浏览器中打开 gallery
nsh run                  # 在本机桌面窗口中打开
nsh test                 # headless 交互测试
nsh check                # 类型检查（含测试文件）
```

## 使用

1. 把本仓库加入你的 NSH app（例如复制到 `vendor/intent-ui`，或作为 git 依赖）。
2. 在 `nsh.json` 中使用 Intent 的主题，组件的颜色类（`bg-control-surface`、`text-content-muted` …）都来自它：

   ```json
   { "theme": "vendor/intent-ui/theme.json", "appearance": "system" }
   ```

3. 从入口导入组件。入口同时注册 Inter 字体：

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

所有组件都是受控组件：值由 app 持有，在 `onChange` 中更新。

> 回调请写成箭头函数（`onChange={(v) => model.set(v)}`）。直接传 `onChange={model.set}` 会让 `set` 脱离它的 signal，调用时抛出 `not a live signal`。

## 组件

| 组件 | 说明 | 主要属性 |
|---|---|---|
| `Button` | 五种填充、四种高度；悬停时填充变化、文字上滚；图标按钮自带 tooltip | `label` `color` (black/citrus/white/grey/outline) `size` (extra-small/small/large/extra-large) `variant` (text/text-icon/icon/icon-expand) `icon` `disabled` `tooltip` `roll` |
| `Switch` | 胶囊开关，滑块带弹性 | `checked` `size` (large/small/small-short) `tone` (normal/inverted) `disabled` |
| `Checkbox` | 勾选、半选 | `checked` `indeterminate` `size` (medium/small) `disabled` |
| `Tabs` | 选中的胶囊滑向按下的标签 | `items` `value` `size` (small/large) `color` (grey/white-dark/white-grey) `variant` (text/icon) |
| `Dropdown` | 填充的触发器 + 浮起的选项菜单，箭头翻转 | `options` `value` `placeholder` `size` (s/m/l) `margin` (tight/default) `color` (grey/white) `placement` (bottom/top/center) `icon` (none/left/right) |
| `ContextMenu` | 右键（触屏长按）打开的菜单，行样式同 Dropdown | `options` `icon` `width` `onSelect` `children`（被右键的内容） |
| `ComboButton` | 两三个图标操作合成一个胶囊，分隔细线 | `actions` `color` (grey/white/dark) `size` (small/medium) `variant` (divider/simple) `tooltips` |
| `IconControl` | 无底色的图标按钮 | `icon` `label` `tint` `disabled` |
| `SideNav` | 眉标题 + 链接列表；可编号，或行内悬停操作 | `groups` `value` `variant` (simple/itemized/actions) `color` (white/grey) `width` (hug/fixed) `actions` `onAction` |
| `Slider` | 轨道从左填充，名称与数值写在轨道内（填充处反色） | `value` `min` `max` `step` `label` `variant` (inside/none/inline/above) `size` (small/large) `color` (yellow/grey/black) `handle` (true/false/"hover") `editable` `format` `onSurface`（放在白色 surface 上时轨道改用 muted 色，同原站白色预览面板） |
| `FormField` | 输入框，可带图标、清除、错误提示、掩码 | `value` `placeholder` `size` (small/medium) `color` (grey/white/outline) `icon` `clearable` `error` `masked` |
| `ModelSwitcher` | 模型选择单选组，选中项展开显示名称 | `options`（`icon` 可为图标名或图片） `value` `color` (grey/white) |
| `SegmentedControl` | 毛玻璃底的分段单选 | `segments` `value` |
| `ApplicationSurface` | app 窗口里的浮起面板 | `radius` `clip` `onPress` |
| `ConversationMessage` | 对话气泡：用户、助手、反馈 | `role` (user/assistant/feedback) `text` `compact` |
| `PanelToolbar` | app 面板顶部的工具栏，按钮均分宽度，打开的面板描边 | `tools`（默认 `panelTools`：Agents/Context/Changes/Files/Browser/Shell） `value` `onChange` |
| `PanelTitle` | app 面板标题：display 字体的任务名，下方是仓库名与分支图标 | `title` `repo` |
| `AgentThread` | agent 对话线程：右侧用户气泡（右下直角），下方是回答的正文、工具行（mono）与小标题，反引号内为代码 | `steps`（`user`/`text`/`tool`/`heading`） |
| `AgentComposer` | 线程底部的输入区：输入框、左下模型名、右下麦克风与发送按钮（有文字时变为 citrus） | `value` `placeholder` `model` `onChange` `onSubmit` `onVoice` |
| `AgentPanel` | 嵌在白框里的 agent 预览窗：标题栏（预览芯片、标题、关闭按钮）与其中的 `AgentThread` | `title` `steps` `children` `onClose` |
| `PanelGroup` | 面板入口：底部两列图块，按下打开对应面板的详情卡片（默认显示原站插图） | `tools` `value` `detail` `onChange`（关闭时为 `null`） |
| `TaskCard` / `TaskProgress` | 任务卡片：标题、仓库、分段进度、描述，铺满卡片的 `PanelGroup`；进度条的已完成段为深色、进行中段为 citrus 按比例填充 | `title` `repo` `description` `progress`（`steps` `done` `current`） `value` `onChange` `onMore` |
| `AgentActivity` | agent 工作记录：灰色正文，工具图标放在左侧沟槽，报告标题、列表，正文里的 `[文字](url)` 为链接；`revealed` 逐步显示 | `steps`（`activity`/`text`/`title`/`list`） `revealed` `onLink` |
| `SpecDocument` | agent 遵循的规格：引言，标题下的勾选清单，完成项为 citrus 方框加勾 | `intro` `title` `items` `onToggle` |
| `ApiKeyPolicy` | “在本机保存密钥”勾选项 | `saved` `label` `onChange` |
| `Mark` | Intent 标志，单色着色；`bloom` 播放原站的 Bloom 动画（由 Lottie 原始关键帧逐帧计算，见下文），尊重“减少动态效果” | `size` `animation` (none/bloom) `loop`（循环播放整段，如原站；否则播到第 35 帧定格） `class="tint-…"` |
| `Wordmark` | “intent” 字标，单色着色，保持原图比例 | `size`（宽，默认 172） `class="tint-…"` |
| `PlatformIcon` | 平台标志：Apple、GitHub、Windows | `name` `size` |
| `Navigation` | 原站页头：左侧链接、中间标志、右侧 citrus 按钮；窄窗口下字号与标志缩小 | `links` `action` `onNavigate` `onHome` `onAction` |
| `Gradient` | 用设计系统的渐变填充的视图（Canvas 精确绘制，径向渐变也一致），子元素叠在上面 | `name` `radius` `outlined` |
| `Type` | 按排版阶梯输出文字，按窗口宽度自动切换断点字号 | `variant`（`text` 的键） `at` (desktop/tablet/mobile) `tone` `numberOfLines` `heading` |
| `TooltipContent` / `tooltipProps` | Tooltip 的气泡与设置，见下文 | `label` `variant` (simple/tip) `placement` |
| `Icon` | 图标：16 pt 161 个，12 pt（XS）82 个，按 token 着色 | `name` `size` (16/12) `class="tint-…"` |

每个组件都接受 `testID`、`class`、`style`。带选项的组件，其选项的 testID 为 `<testID>-<value>`（如 `id:dropdown-gpt`），便于 `nsh test` 定位。

## Tooltip

NSH 的 `tooltip` 属性只认**内联写出**的 `nsh/base` `<Tooltip>`：把它包进自定义组件或由函数返回都不会显示。所以本库不提供 `Tooltip` 组件，而是提供设置与气泡两部分：

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

`tooltipProps` 默认停留 800 ms 后出现、距离 5 pt。`nsh/base` 的 `Button` 自身的 `tooltip` 不显示，要放在它里面的 `View` 上（本库的 `Button`、`ComboButton` 已这样处理）。

## 设计 token

- **颜色**：`theme.json`，亮/暗两套，通过类使用：`bg-canvas`、`bg-surface`、`bg-control-surface(-active|-muted|-strong)`、`text-content(-muted)`、`text-control-ink`、`bg-inverse-surface`、`border-border(-strong)`、`bg-slider-fill`、`outline-focus-ring` 等；图标用 `tint-<token>`。
- **几何**：`src/tokens.ts` 导出 `radius`（xs 5 / s 10 / m 15 / l 20 / xl 25 / 2xl 45）、`space`（5–80）、`controlHeight`（35/40/60，XL 90 圆形）、`shadowElevated`（`0 10px 20px rgba(0,0,0,.1)`）、`ease`、`duration`、`colorTransition`。
- **排版**：`text` 是原站的排版阶梯——display 90/85.5/-3.6（380）、title 60/60/-2.1、headline 48/45.6/-2.16、featureTitle 26/26/-0.52、featureBody 16/20.8/-0.08、body 32/41.6/+0.64、base 18/23.4/-0.18、mono 14/15.4/-0.28，以及 label、button、small、caption、eyebrow、message。`textScale` 是平板（<768）与手机（<480）的字号，`breakpoint(width)` 判断断点，`textAt(variant, at)` 取某断点下的样式。
- **渐变**：原站有六个渐变：lightGreyToYellow、mediumGreyToYellow、greyToYellow、yellowWash、yellowToGrey、lightYellows。
  - **精确绘制**：用 `<Gradient name="greyToYellow" radius={20} style={{ width: 170, aspectRatio: 1.75 }}>…</Gradient>`。它按 `gradientSpecs`（原站 CSS 的形状、椭圆尺寸、圆心和色标）在 Canvas 上绘制：
    - 径向渐变先 `scale` 成椭圆再画；
    - 线性渐变把超出 0–100% 的色标放到延长后的渐变线上；
    - 圆角在 Canvas 里裁剪，所以 Android 上也有圆角；
    - `outlined` 加 1pt 描边，内侧圆角相应减 1。
  - **`backgroundImage` 近似值**：`gradients` 里的字符串可以直接当 `backgroundImage` 用，但不精确。NSH 的 `radial-gradient` 不接受显式尺寸，还会把负色标钳到 0%，所以两个径向渐变换算成了沿中线逐点相同的线性渐变，负色标预先插值成 0% 处的颜色，原始 CSS 写在注释里。需要和原站一致时请用 `Gradient`。

## 字体

- **Inter**（界面文字）：SIL OFL 1.1，随库附带（`src/fonts/`，授权见 `src/fonts/Inter-LICENSE.txt`）。
- **ABC Arizona Mix**（display、title、headline、featureTitle）与 **Aeonik Mono**（mono）：商业字体，授权不允许随库再分发，所以不附带。默认回落到系统衬线（`serif`）与系统等宽（`monospace`），与原站 CSS 的 `ui-serif` / `ui-monospace` 回落一致。持有授权的 app 在首次渲染前注册即可：

  ```tsx
  import Arizona from "./fonts/ABCArizonaMix-Regular.otf";
  import Aeonik from "./fonts/AeonikMono-Regular.otf";
  import { configureFonts } from "./vendor/intent-ui/src";

  configureFonts({ display: Arizona, mono: Aeonik });
  ```

## 与原站的核对

逐项对照 [intentapp.dev/design-system](https://intentapp.dev/design-system)，亮色（`?light-mode=`）与暗色（`?dark-mode=`）两种主题都核对过。依据是原站 DOM 的 `getComputedStyle` 取值和原站 CSS 源码中的规则，而不是目测：

- **Logo**：使用官方路径（viewBox 264×260）。Bloom 动画由原站 `intent_mark_bloom_256.json` 的关键帧直接计算：每条臂的角度 = CTRL 曲线 + 本臂曲线（三次贝塞尔，求解方式与 lottie-web 相同），每 1/4 帧采样一次；旋转中心取自文件中的 (132, 126.5)；第 56–61 帧为空白；`loop` 时第 61 帧立即重播（由计时器控制），与原站 `loadAnimation({ loop: true })` 一致。`tests/mark.test.tsx` 用 lottie-web 实际渲染出的 14 个帧、5 条臂的角度作基准，误差小于 0.02°，仅来自基准数据保留两位小数。
- **Color**：Spectrum 22 色，以及亮/暗两套 Semantics，与 `theme.json` 逐值一致。
- **Gradients**：`Gradient` 绘制的六张卡片（170 宽、`aspect-ratio: 1.75`、圆角 20，第一张带描边，均同原站）与原站截图逐像素比对，卡片内部每个通道的最大误差为 2/255，平均不到 1/255。圆角弧线上的抗锯齿像素不计入。
- **Typography**：各步的字号、行高、字距、字重，以及平板/手机断点，均一致。
- **Iconography**：16 pt 161 个、12 pt 82 个，名称一一对应；每个组件内用 12 还是 16 pt 也与原站一致。
- **Foundations**：圆角、间距、控件高度、阴影一致。
- **组件尺寸**：Buttons（60 高 / 20 圆角 / 左右 30 / 14·15.4·500·-0.14）、Dropdown（触发器 35 高·15 圆角·左右 15，箭头与选项图标 12 pt）、Model switcher（60×60 / 20 圆角 / 间距 2 / 选中展开到 126，`cubic-bezier(.6,0,.1,1)` 300 ms）、Tabs（内边距 2，选中块圆角 18/13）、Combo Button（35/40 高、15 圆角、分隔线 1×20、图标 12 pt）、Switch（40×20 / 圆角 10 / 内边距 2 / 滑块 20×16 圆角 8）、Slider（200×30 / 圆角 10 / 手柄 2×14 / 文字 11·20·450·-0.11）、Checkbox（20 / 圆角 5 / 1 px 描边 / 勾 12 pt）、Form field（图标 16 pt、错误图标 12 pt）、Tooltip（30 高 / 圆角 10 / 左右 15 / 12·15.6·500·-0.24）、Context menu（行图标 16 pt）、Side navigation（220 宽 / 组间距 30 / 眉标题 11·12.1·+0.66 大写、下距 10 / 行 34 高、圆角 14、左右 14）。
- **参数展示区**：gallery 的 Components 一节复刻了原站的 12 个展示区（`gallery/showcase.tsx`、`gallery/showcases.tsx`）。布局同原站：左侧 265 宽的标题与参数栏（标题 26·24.7·-0.91，标签 80 宽、14·16.8·500·-0.28，参数用 175 宽的白色小号 Dropdown，Button 的 Color 用 35×35 色块），右侧 455×440、圆角 20 的预览区，悬停时左下角出现 White / Grey 900 / Citrus 三个背景切换圆点。每个参数的选项与默认值同原站，Button 的 Tooltip 一行只在 Icon Only 时出现。12 个预览内容的位置和尺寸与原站逐个比对，误差 ≤1 px（来自字体）。
- **组件配色**：原站 CSS 中每条变体规则（button 五色及 hover/disabled、combo grey/white/dark 及其暗色覆盖、dropdown/form-field/model-switcher/section-nav/tabs 各色、switch normal/inverted、slider yellow/grey/black 及白色面板上的覆盖）都已对应到同名语义 token；12 个默认演示在亮色下的实测颜色与本库一致。

### 已知偏差与未覆盖项

- **字体**：ABC Arizona Mix（Dinamo）与 Aeonik Mono（CoType）是商业字体，授权不允许随库再分发，所以本库不附带。在注册它们之前，display/title/headline/featureTitle 用系统衬线字体，mono 用系统等宽字体，**字形与原站不同**；字号、行高、字距、字重仍按规范。持有授权的 app 调用 `configureFonts` 后即与原站一致。
- **渐变的 `backgroundImage` 写法**：只有 `gradients` 字符串（`backgroundImage` 近似值）在两个径向渐变上有偏差。Grey To Yellow 的左右边缘处渐变进度最多相差约 4%，Yellow Wash 顶部两角最多相差约 13%。用 `Gradient` 组件则没有这个偏差。
- **文档站点自身的界面**（页面滚动渐显、页内导航、主题切换按钮）不属于组件规范，没有实现；gallery 用自己的标题栏和明暗切换按钮。
- **`.component-demos` 中 `display:none` 的内部演示**（共 24 个）不属于公开规范，原站上不显示，其中不少本身渲染残缺。凡是能用原生视图复刻的都已实现：SegmentedControl、IconControl、Icon、Mark（LogoAnimation 即 Bloom）、SideNav（SectionNav）、ApplicationSurface、ConversationMessage、PanelToolbar、PanelTitle（PanelCopy）、AgentThread、AgentComposer、Navigation、Wordmark（SystemIcon）、PlatformIcon、ApiKeyPolicy、AgentPanel、PanelGroup、TaskCard（CardUI）、AgentActivity（ApplicationAnimationsAgentContent）、SpecDocument（MapSpec）。app 界面部件的尺寸取自原站 CSS，原站插图单位换算到图标为 16 pt（1 单位 ≈ 1.274 pt）。与原站不同的地方：
  - 原站线程示例里残缺的一句（"exited with code 1 because and the"）在 gallery 中改写成了完整句子。
  - 原站 CardUI 的进度条压在仓库名一行上，`TaskCard` 把它放在仓库名下方。
  - PanelGroup 详情卡片的内容沿用原站的 SVG 插图，app 可以用 `detail` 换成自己的内容。

  未实现的：FluidSurface（WebGL 画布）、ApplicationAnimationsBrowserContent（WebGL 齿轮，以及与之叠在一起的贝塞尔曲线编辑器和库存表）、FullCycleFeatureGraphic（PNG 加 canvas 动画）。它们是营销插图，没有可遵循的组件规范。
- **平台差异**：上面的数值核对是在 Web 目标上做的（只有 Web 能和原站 DOM 直接比对取值）。原生端用 `nsh test --target macos|ios|android` 打开 gallery 并 `app.screenshot()` 截图检查，见下一节；与原站之间没有逐像素比对（原站只有 Web 版）。

### 原生平台

在 macOS、iOS 模拟器（iPhone 18 Pro Max）、Android 模拟器上截过 gallery 的图。macOS 和 iOS 与 Web 一致；Android 上发现 NSH 0.3.0 的两处宿主差异，已在组件里绕开：

- **Android 不按 `overflow: hidden` 裁剪子视图**（iOS、macOS、Web 都裁剪）。受影响的地方：
  - Button 悬停滚动用的副本放在按钮下方，原本靠裁剪藏住，在 Android 上会露出来。Android 没有指针悬停，所以那里不渲染这两份副本。
  - Slider 的填充层原本靠轨道的圆角裁出左侧圆角。现在填充层自己带圆角，右侧圆角随填充接近末端逐渐出现，各平台都这样画。
  - 其余用到裁剪的地方（Combo、Model switcher、ApplicationSurface 的圆角）在 Android 上目测没有可见差异。Slider 反色文字在填充层外侧不会被截断，但它和轨道同色，看不出来。
- **Android 上动画结束的 promise 会晚到**（模拟器上实测每轮 2.6–4.5 s，应为 2.03 s）。Bloom 的 `loop` 原本在动画结束后才重播，空白段因此被拉长。现在改由计时器控制：第 56 帧隐藏、第 61 帧重播。在 Android 上连拍 12 张，空白 1 张，与空白段应占的约 8% 一致。

iOS 上发现一处需要使用者配合的地方：FormField 放在 `Scroll` 里时，键盘弹起后第一次点清除按钮只会收起键盘（`keyboardShouldPersistTaps` 默认为 `"never"`），要点第二次才会清空。外层 `Scroll` 设置 `keyboardShouldPersistTaps="handled"` 后，点一次就能清空。gallery 已经这样设置。

## 测试

`tests/gallery.test.tsx` 打开 gallery，像用户一样操作：
- 标志显示
- 按钮计数
- tabs 切换
- dropdown 选择与禁用项
- 右键菜单（触屏上改为长按）
- combo button
- 输入与清除
- slider 拖动
- tooltip 悬停（触屏上没有指针，跳过）
- 明暗切换
- 参数展示区：参数切换预览、色块选色、State 控件与 Dropdown 开合双向同步、Checkbox 与其 State 控件同步
- 站点导航：链接、标志、按钮各自上报
- agent 输入区：没有文字时发送按钮禁用，输入后发送并清空
- agent 预览窗关闭后可重新打开；保存密钥勾选项切换
- 面板图块打开详情卡片，关闭按钮收起；任务卡片中的图块同样可用
- 工作记录按 Replay 后逐步出现，链接上报 url
- 规格清单的方框勾选与取消

测试统一以减弱动效打开 App。否则无限循环的 Bloom 会让 App 一直不稳定，真实平台的测试步骤会一直等待。在真实平台上，步骤够不到页面下方时，会先滚动再重试（见 `near()`）。

各目标的结果（2026-10-28）：
- headless：19/19
- `--target macos`：19/19
- `--target ios`（iPhone 18 Pro Max 模拟器）：19/19
- `--target android`（模拟器）：最近一轮 17/19（之前是 4/13）。每一项都至少在一轮中通过过，失败的项每轮不同。报错是 "the host did not take the step in 30 s"，或者测试超时。
  - agent 输入区一项原先始终没过，原因是 gallery 里的 app 面板固定 560 宽，在手机屏幕上超出右边，发送按钮落在屏幕外。现在面板改为随窗口变窄，这项已经通过。
  - 这类失败此前已经查过一次，以下是当时的分析：失败的都是 "the host did not take the step in 30 s"：步骤的效果比步骤返回晚约 1 s 才出现，测试代理也一直报告有动画在运行，而 App 此时并没有任何动画（减弱动效下 Mark 是静态的）。这是 NSH 0.3.0 Android 宿主的问题。Android 上的渲染改用截图检查，见“原生平台”。

`tests/mark.test.tsx` 逐帧比对 Bloom 动画与 lottie-web 的渲染结果。

```sh
nsh test
# 在真实平台上运行同样的测试（iOS 会启动模拟器，Android 用 adb 列出的第一台设备）
nsh test --target macos
nsh test --target ios
nsh test --target android
```

## 授权

代码以 Apache-2.0 授权。Intent 的名称与视觉设计归其作者所有。
