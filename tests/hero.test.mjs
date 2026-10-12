import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const code = ts.transpileModule(
  fs.readFileSync(
    new URL("../src/components/hero.tsx", import.meta.url),
    "utf8",
  ),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  },
).outputText;

function harness({ reduced = false, blocked = false } = {}) {
  const state = [false, false];
  let cursor = 0,
    effect,
    video,
    button,
    listener;
  const preference = {
    matches: reduced,
    addEventListener: (_, callback) => {
      listener = callback;
    },
    removeEventListener: (_, callback) => {
      if (listener === callback) listener = undefined;
    },
  };
  const player = {
    paused: true,
    src: "",
    plays: 0,
    canPlayType: () => "probably",
    getAttribute: () => player.src,
    removeAttribute: () => {
      player.src = "";
    },
    load: () => video.onEmptied(),
    play: () => {
      player.plays++;
      if (blocked) return Promise.reject(new Error("Autoplay blocked"));
      player.paused = false;
      video.onPlay();
      return Promise.resolve();
    },
    pause: () => {
      player.paused = true;
      video.onPause();
    },
  };
  const compiled = { exports: {} };
  new Function("exports", "require", "module", "window", code)(
    compiled.exports,
    (name) =>
      name === "react"
        ? {
            useState: () => {
              const index = cursor++;
              return [
                state[index],
                (value) => {
                  state[index] = value;
                },
              ];
            },
            useRef: () => ({ current: player }),
            useEffect: (callback) => {
              effect = callback;
            },
          }
        : name === "next/link"
          ? {
              __esModule: true,
              default: ({ children, ...props }) =>
                React.createElement("a", props, children),
            }
          : require(name),
    compiled,
    { matchMedia: () => preference },
  );
  function render() {
    cursor = 0;
    const tree = compiled.exports.default({
      video: "intro",
      subtitle: "Welcome",
      title: "WFSA",
      buttonText: "Explore chapters",
    });
    function visit(node) {
      if (!node || typeof node !== "object") return;
      if (node.type === "video") video = node.props;
      if (node.type === "button") button = node.props;
      React.Children.forEach(node.props?.children, visit);
    }
    button = undefined;
    visit(tree);
    return renderToStaticMarkup(tree);
  }
  render();
  return {
    render,
    player,
    preference,
    mount: () => effect(),
    changePreference: (matches) => {
      preference.matches = matches;
      listener?.();
    },
    get button() {
      return button;
    },
    get video() {
      return video;
    },
    get listener() {
      return listener;
    },
  };
}

test("hero keeps restored styling and a 44px icon-only accessible control", () => {
  const hero = harness();
  const html = hero.render();
  assert.match(html, /bg-black\/20/);
  assert.match(html, /md:bg-transparent/);
  assert.match(html, /md:ml-12/);
  assert.doesNotMatch(html, /max-w-\[1440px\]|bg-black\/55/);
  assert.equal(hero.button["aria-label"], "Play background video");
  assert.match(hero.button.className, /size-11/);
  assert.match(hero.button.className, /bg-black\/45/);
  assert.match(hero.button.className, /focus-visible:outline/);
  const control = html.split("<button")[1].split("</button>")[0];
  assert.match(control, /lucide-play/);
  assert.match(control, /aria-hidden="true"/);
  assert.equal(
    control.slice(control.indexOf(">") + 1).replace(/<[^>]+>/g, ""),
    "",
  );
});

test("hero control follows actual playback, toggles, and external pause events", async () => {
  const hero = harness();
  hero.mount();
  assert.match(hero.render(), /lucide-pause/);
  assert.equal(hero.button["aria-label"], "Pause background video");
  hero.button.onClick();
  assert.equal(hero.player.paused, true);
  assert.match(hero.render(), /lucide-play/);
  hero.button.onClick();
  assert.equal(hero.player.paused, false);
  hero.render();
  hero.player.pause();
  hero.render();
  assert.equal(hero.button["aria-label"], "Play background video");
  // A stale rendered label must not determine the toggle action.
  await hero.player.play();
  hero.button.onClick();
  assert.equal(hero.player.paused, true);
});

test("autoplay rejection, reduced motion, resource reset, and video errors retain correct control state", async () => {
  const blocked = harness({ blocked: true });
  blocked.mount();
  await Promise.resolve();
  blocked.render();
  assert.equal(blocked.button["aria-label"], "Play background video");
  const hero = harness({ reduced: true });
  const cleanup = hero.mount();
  assert.equal(hero.player.plays, 0);
  assert.equal(hero.player.src, "");
  hero.render();
  hero.button.onClick();
  hero.render();
  assert.equal(hero.button["aria-label"], "Pause background video");
  hero.changePreference(true);
  hero.render();
  assert.equal(hero.player.paused, true);
  assert.equal(hero.button["aria-label"], "Play background video");
  hero.video.onError();
  hero.render();
  assert.equal(hero.button, undefined);
  cleanup();
  assert.equal(hero.listener, undefined);
});
