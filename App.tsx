import { colorScheme, mount, Scroll, setColorScheme, View } from "nsh";
import { Button, SideNav, Type } from "./src";
import {
  Application,
  Buttons,
  Colors,
  Foundations,
  Gradients,
  Logo,
  Combos,
  Fields,
  Icons,
  Menus,
  Navigation,
  Sliders,
  TabsPage,
  Toggles,
  Tooltips,
  Typography,
} from "./gallery/pages";
import { Section } from "./gallery/section";
import { Showcases } from "./gallery/showcases";

/** The Intent UI gallery: every component of the design system, side by side. */
function App() {
  return (
    <View class="flex-1 bg-canvas">
      <View class="flex items-center justify-between border-b border-border" style={{ height: 70, paddingHorizontal: 30 }}>
        <Type variant="featureTitle">Intent UI</Type>
        <Button
          testID="scheme"
          label={colorScheme() === "dark" ? "Light" : "Dark"}
          icon={colorScheme() === "dark" ? "brightness-full" : "night"}
          variant="icon"
          color="grey"
          onPress={() => setColorScheme(colorScheme() === "dark" ? "light" : "dark")}
        />
      </View>
      <Scroll testID="gallery" class="flex-1" keyboardShouldPersistTaps="handled">
        <View style={{ paddingHorizontal: 30, paddingBottom: 60, maxWidth: 1100 }}>
          <Logo />
          <Colors />
          <Gradients />
          <Typography />
          <Icons />
          <Foundations />
          <Section id="showcases" title="Components" note="Each prop a control beside the preview, as on intentapp.dev; the dots at the foot of a preview switch its backdrop.">
            <Showcases />
          </Section>
          <Buttons />
          <Toggles />
          <TabsPage />
          <Menus />
          <Combos />
          <Navigation />
          <Sliders />
          <Fields />
          <Application />
          <Tooltips />
        </View>
      </Scroll>
    </View>
  );
}

mount(App);
