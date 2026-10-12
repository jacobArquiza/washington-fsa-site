import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const code = ts.transpileModule(
  fs.readFileSync(
    new URL("../src/components/smooth-scroll.tsx", import.meta.url),
    "utf8",
  ),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;

test("back-to-top uses one Lenis controller, reduced-motion immediate scroll, or isolated native fallback", () => {
  for (const mode of ["normal", "reduced", "unavailable"]) {
    let cleanup,
      click,
      change,
      active = 0,
      animated = 0,
      focused = 0,
      prevented = 0;
    const native = [];
    const preference = {
      matches: mode === "reduced",
      addEventListener: (_name, callback) => {
        change = callback;
      },
      removeEventListener: () => {
        change = undefined;
      },
    };
    class Target {
      constructor(matches = true) {
        this.matches = matches;
      }
      closest() {
        return this.matches ? this : null;
      }
    }
    class Lenis {
      constructor() {
        if (mode === "unavailable")
          throw new Error("Fixture initialization failure");
        active++;
        assert.equal(active, 1);
      }
      destroy() {
        active--;
      }
      scrollTo(top, options) {
        assert.equal(top, 0);
        animated++;
        options.onComplete();
      }
    }
    const component = { exports: {} };
    vm.runInNewContext(code, {
      module: component,
      exports: component.exports,
      Element: Target,
      require: (name) =>
        name === "lenis"
          ? { default: Lenis }
          : {
              useEffect: (effect) => {
                cleanup = effect();
              },
            },
      window: {
        matchMedia: () => preference,
        scrollTo: (options) => {
          assert.equal(options.top, 0);
          native.push(options.behavior);
        },
      },
      document: {
        addEventListener: (_name, callback) => {
          click = callback;
        },
        removeEventListener: () => {
          click = undefined;
        },
        getElementById: (id) => {
          assert.equal(id, "main-content");
          return {
            focus: (options) => {
              assert.equal(options.preventScroll, true);
              focused++;
            },
          };
        },
      },
    });
    component.exports.default();
    const event = {
      target: new Target(),
      button: 0,
      preventDefault: () => {
        prevented++;
      },
    };
    click(event);
    assert.equal(prevented, 1);
    assert.equal(focused, 1);
    assert.equal(animated, mode === "normal" ? 1 : 0);
    assert.deepEqual(
      native,
      mode === "normal" ? [] : [mode === "reduced" ? "instant" : "smooth"],
    );
    click({ ...event, target: new Target(false) });
    click({ ...event, ctrlKey: true });
    assert.equal(prevented, 1);
    if (mode === "normal") {
      preference.matches = true;
      change();
      click(event);
      assert.equal(active, 0);
      assert.equal(animated, 1);
      assert.deepEqual(native, ["instant"]);
      preference.matches = false;
      change();
      assert.equal(active, 1);
    }
    cleanup();
    assert.equal(active, 0);
    assert.equal(click, undefined);
    assert.equal(change, undefined);
  }
});
