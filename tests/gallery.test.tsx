import { beforeEach, describe, expect, open, test } from "nsh/test";
import type { App } from "nsh/test";

// The gallery shows every component; these tests drive them as a user does.
// Less motion keeps the looping Bloom from running forever, so a real
// platform's steps (`nsh test --target`) see the app settle.
let app: App;
beforeEach(async () => {
  app = await open("../App.tsx", { platform: "web", width: 1200, height: 900, clock: {}, colorScheme: "light", reducedMotion: true });
});

// A real platform brings a view into view by scrolling for a few seconds
// (or, on a slow device, until the step's time runs out), which falls short
// of the gallery's lower pages, and Android makes no view for what is far
// off screen: scroll on and try again (a phone's narrow gallery runs long).
async function near(step: () => Promise<void>, by = 2500) {
  for (let tries = 0; ; tries++) {
    try {
      return await step();
    } catch (error) {
      const short = ["did not come into view", "did not take the step", "has no native view"].some((cause) => String(error).includes(cause));
      if (tries === 20 || !short) throw error;
      await app.scroll("id:gallery", by);
    }
  }
}
// A real platform may show a step's effect a moment after the step.
const shown = (condition: () => boolean) => app.waitUntil(condition, { timeout: 10_000 });
// A step that needs a mouse; false on a touch screen, which has none.
async function withMouse(step: () => Promise<void>) {
  try {
    await near(step);
    return true;
  } catch (error) {
    if (String(error).includes("no mouse")) return false;
    throw error;
  }
}
// What a real platform's scrolling can take.
const long = 300_000;

describe("button", () => {
  test("counts presses", async () => {
    await near(() => app.press("id:button-black"));
    await near(() => app.press("id:button-citrus"));
    await shown(() => {
      const texts = app.texts();
      return texts[texts.indexOf("presses") + 1] === "2";
    });
  }, long);

  test("disabled buttons take no presses", () => {
    expect(app.enabled("text:Disabled >> nth=0")).toBe(false);
  });
});

describe("tabs", () => {
  test("selects the tab pressed", async () => {
    await near(() => app.press("id:tabs-code"));
    await shown(() => app.texts().includes("Code"));
  }, long);
});

describe("dropdown", () => {
  test("opens and chooses an option", async () => {
    expect(app.shows("id:dropdown >> text:Claude Sonnet")).toBe(true);
    await near(() => app.press("id:dropdown"));
    await app.waitFor("id:dropdown-gpt");
    await app.press("id:dropdown-gpt");
    await app.waitFor("id:dropdown-gpt", { state: "gone" });
    await app.waitFor("id:dropdown >> text:GPT-5");
  }, long);

  test("disabled options cannot be chosen", async () => {
    await near(() => app.press("id:dropdown"));
    await app.waitFor("id:dropdown-gemini");
    expect(app.enabled("id:dropdown-gemini")).toBe(false);
  }, long);
});

describe("context menu", () => {
  test("opens on a right click", async () => {
    // A touch screen holds a finger on it instead.
    if (!(await withMouse(() => app.rightClick("label:More")))) await near(() => app.longPress("label:More"));
    await app.waitFor("id:context-delete");
    await app.press("id:context-delete");
    await app.waitFor("text:Chose delete");
  }, long);
});

describe("combo button", () => {
  test("reports the action pressed", async () => {
    await near(() => app.press("id:combo-edit"));
    await shown(() => app.texts().includes("edit"));
  }, long);
});

describe("form field", () => {
  test("takes typing and clears", async () => {
    await near(() => app.type("id:field", "intent"));
    await shown(() => app.value("id:field") === "intent");
    await app.press("label:Clear field");
    await shown(() => app.value("id:field") === "");
  }, long);
});

describe("slider", () => {
  test("moves with a drag", async () => {
    // The value reads after the label, inside the track.
    const value = () => {
      const texts = app.texts();
      return texts[texts.indexOf("inside") + 2];
    };
    expect(value()).toBe("40");
    // The adjustable view carries the testID twice headless; the inner one takes the drag.
    await near(() => app.drag("id:slider >> nth=1", { x: 40 }));
    await shown(() => Number(value()) > 40);
  }, long);
});

describe("tooltip", () => {
  test("shows after the pointer rests", async () => {
    expect(app.shows("text:Tip on top >> nth=1")).toBe(false);
    // A touch screen has no pointer to rest.
    if (!(await withMouse(() => app.hover("id:tooltip-anchor")))) return;
    await app.wait(900);
    await app.waitFor("text:Tip on top >> nth=1");
  }, long);
});

describe("color scheme", () => {
  test("switches to the other scheme and back", async () => {
    // The button names the scheme it switches to.
    const [first, second] = app.shows("label:Dark") ? ["Light", "Dark"] : ["Dark", "Light"];
    await app.press("id:scheme");
    await app.waitFor(`label:${first}`);
    await app.press("id:scheme");
    await app.waitFor(`label:${second}`);
  }, long);
});

describe("logo", () => {
  test("shows the mark, still and blooming", () => {
    expect(app.shows("id:mark-bloom")).toBe(true);
    expect(app.shows("label:Intent >> nth=0")).toBe(true);
  });

  test("the navigation reports the link, the mark and the button", async () => {
    await near(() => app.press("id:nav-updates"));
    await app.waitFor("text:Went: updates");
    await app.press("id:nav-home");
    await app.waitFor("text:Went: home");
    await app.press("id:nav-action");
    await app.waitFor("text:Went: download");
  }, long);
});

describe("gradients", () => {
  test("shows all six", () => {
    for (const name of ["lightGreyToYellow", "mediumGreyToYellow", "greyToYellow", "yellowWash", "yellowToGrey", "lightYellows"]) {
      expect(app.shows(`id:gradient-${name}`)).toBe(true);
    }
  });
});

describe("showcases", () => {
  test("a control sets the preview's prop", async () => {
    // The tooltip row shows only for an icon button.
    expect(app.shows("id:showcase-button >> text:Tooltip")).toBe(false);
    await near(() => app.press("id:showcase-button-variant"));
    await app.waitFor("id:showcase-button-variant-icon");
    await app.press("id:showcase-button-variant-icon");
    await app.waitFor("id:showcase-button >> text:Tooltip");
    await shown(() => app.shows("id:showcase-button-variant >> text:Icon Only"));
  }, long);

  test("swatches choose the color", async () => {
    // A black button's label is light, a citrus one's dark.
    const ink = () => String(app.spanStyle("id:showcase-button-target >> text:Download For MacOS >> nth=0").color);
    // A real platform reads no span styles: there the swatch need only take the press.
    let black: string | null = null;
    try {
      black = ink();
    } catch (error) {
      if (!String(error).includes("headless only")) throw error;
    }
    await near(() => app.press("id:showcase-button-color-citrus"));
    if (black != null) await shown(() => ink() !== black);
  }, long);

  test("the state control opens the dropdown and closing it resets the control", async () => {
    await near(() => app.press("id:showcase-dropdown-state"));
    await app.waitFor("id:showcase-dropdown-state-opened");
    await app.press("id:showcase-dropdown-state-opened");
    await app.waitFor("id:showcase-dropdown-target-medium");
    await app.press("id:showcase-dropdown-target-medium");
    await app.waitFor("id:showcase-dropdown-target >> text:Medium");
    await shown(() => app.shows("id:showcase-dropdown-state >> text:Closed"));
  }, long);

  test("the checkbox and its state control follow each other", async () => {
    await near(() => app.press("id:showcase-checkbox-target"));
    await shown(() => app.shows("id:showcase-checkbox-state >> text:On"));
  }, long);
});

describe("agent", () => {
  test("the composer sends only what is written", async () => {
    // The composer ends the page: come to the toolbar above it, then on in
    // steps short enough not to pass it (Android makes its views only once
    // they are near the screen).
    await near(() => app.press("id:toolbar-files"));
    await near(() => app.press("id:composer >> label:Voice"), 300);
    expect(app.enabled("id:composer-send")).toBe(false);
    await near(() => app.type("id:composer-field", "run it"));
    await shown(() => app.enabled("id:composer-send"));
    await app.press("id:composer-send");
    await app.waitFor("text:Sent: run it");
    await shown(() => app.value("id:composer-field") === "");
  }, 2 * long);

  test("the agent panel closes and opens again; the key policy toggles", async () => {
    await near(() => app.press("id:agent-panel-close"));
    await app.waitFor("id:agent-panel-open");
    await app.press("id:agent-panel-open");
    await app.waitFor("id:agent-panel-close");
    await near(() => app.press("id:save-key"), 300);
    await app.waitFor("text:Key: not kept");
  }, 2 * long);

  test("a panel tile opens its panel and the close button shuts it", async () => {
    await near(() => app.press("id:panels-context"));
    await app.waitFor("id:panels-panel");
    expect(app.shows("label:Context panel content")).toBe(true);
    await app.press("id:panels-close");
    await shown(() => !app.shows("id:panels-panel"));
  }, 2 * long);

  test("a task card's tile opens its panel", async () => {
    await near(() => app.press("id:task-panels-files"));
    await app.waitFor("id:task-panels-panel");
    await app.press("id:task-panels-close");
    await shown(() => !app.shows("id:task-panels-panel"));
  }, 2 * long);

  test("the activity replays a step at a time and its link reports the url", async () => {
    await near(() => app.press("id:activity-replay"));
    await app.waitFor("text:0 of 9 steps");
    await app.wait(400);
    await app.waitFor("text:1 of 9 steps");
    await app.wait(3500);
    await app.waitFor("text:9 of 9 steps");
    await near(() => app.press("text:http://localhost:4337 >> nth=0"), 300);
    await app.waitFor("text:Opened http://localhost:4337");
  }, 2 * long);

  test("a spec's box checks its item and checks it off again", async () => {
    await near(() => app.press("id:spec-0"));
    await app.waitFor("text:3 of 10 done");
    await app.press("id:spec-0");
    await app.waitFor("text:2 of 10 done");
  }, 2 * long);
});
