import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRequire } from "node:module";

const nodeRequire = createRequire(import.meta.url);
function load(relative, dependencies = {}) {
  const code = ts.transpileModule(
    fs.readFileSync(new URL(relative, import.meta.url), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    },
  ).outputText;
  const result = { exports: {} };
  new Function("exports", "require", "module", code)(
    result.exports,
    (name) => dependencies[name] ?? nodeRequire(name),
    result,
  );
  return result.exports;
}
const chapters = load("../src/data/chapter-previews.ts");
const leadership = load("../src/data/leadership.ts");
const expectedClubs = {
  "Mariner High School": ["PUSO", "ASU", "PI Club"],
  "Mountlake Terrace High School": ["FASA", "ASU"],
  "Meadowdale High School": ["FASA", "ASU"],
  "Kamiak High School": ["FSU"],
  "Everett High School": ["FSU"],
  "Shorecrest High School": ["SC FSU"],
  "Lynnwood High School": ["ASU"],
  "Edmonds-Woodway High School": ["ASU"],
  "Inglemoor High School": ["AAPI", "FASA"],
  "Sammamish High School": ["Filipino Club"],
  "Shoreline College": ["FASA"],
  "Juanita High School": ["Vietnamese Club"],
  "Seattle Preparatory School": ["APIC"],
  "O'Dea High School": [],
  "Bishop Blanchet High School": ["AAPISU"],
  "Archbishop Murphy High School": ["API"],
  "Interlake High School": ["FASA"],
  "Forest Ridge School of the Sacred Heart": ["AAPISU"],
  "Bothell High School": [],
  "Hazen High School": [],
  "Kennedy Catholic High School": [],
};

test("chapter inventory has 21 unique schools, 22 approved affiliations, and month-precision join dates", () => {
  assert.equal(chapters.chapterPreviews.length, 21);
  assert.equal(new Set(chapters.chapterPreviews.map((x) => x.id)).size, 21);
  assert.equal(
    new Set(chapters.chapterPreviews.map((x) => x.schoolName)).size,
    21,
  );
  for (const chapter of chapters.chapterPreviews) {
    assert.match(chapter.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.deepEqual(chapter.clubs, expectedClubs[chapter.schoolName]);
    assert.equal(new Set(chapter.clubs).size, chapter.clubs.length);
    assert.equal(chapter.joinMonth, "2026-06");
    assert.equal(chapters.formatJoinMonth(chapter.joinMonth), "June 2026");
    assert.equal(chapter.href, undefined);
    assert.equal(chapter.description, undefined);
    if (chapter.image) {
      assert.equal(chapter.id, "mariner");
      assert.equal(chapter.image, "/chapters/mariner-high.jpg");
      assert.ok(chapter.imageAlt);
      assert.ok(
        fs.existsSync(new URL(`../public${chapter.image}`, import.meta.url)),
      );
    }
  }
  assert.equal(chapters.chapterPreviews.filter((x) => x.image).length, 1);
  assert.equal(
    chapters.chapterPreviews.filter((x) => !x.clubs.length).length,
    4,
  );
  assert.equal(chapters.chapterPreviews[0].id, "mariner");
  const names = chapters.chapterPreviews.slice(1).map((x) => x.schoolName);
  assert.deepEqual(names, [...names].sort());
  assert.equal(chapters.knownAffiliationCount, 22);
  assert.equal(chapters.chapterNetworkStats.schools, 21);
  assert.equal(chapters.chapterNetworkStats.organizations, "20+");
  assert.throws(() => chapters.formatJoinMonth("2026-06-01"), RangeError);
});
test("approved roster combines the top position once and leaves Finance explicitly vacant", () => {
  const approved = leadership.getApprovedOfficers();
  assert.equal(approved.length, 5);
  assert.deepEqual(
    approved.map((x) => x.name),
    ["Jerico Magat", "Alice Pham", "Jeohnavi Bandoy", null, "Oliver Casimiro"],
  );
  assert.equal(
    leadership.organizationHierarchy[0].label,
    "Commissioner / Executive Director",
  );
  assert.equal(leadership.organizationHierarchy[0].officerId, "jerico-magat");
  const roles = leadership.organizationHierarchy[1].roles;
  assert.equal(
    roles.find((x) => x.id === "cultural-chiefs").personnelStatus,
    "pending",
  );
  assert.equal(
    approved.find((x) => x.role === "Finance Director").vacant,
    true,
  );
  assert.equal(roles.length, 5);
  assert.equal(leadership.organizationHierarchy.length, 5);
  assert.equal(
    roles.some((x) => x.officerId === "oliver-casimiro"),
    true,
  );
});
test("chart renders every approved name, vacancy, and governance level without the obsolete warning", () => {
  const Chart = load("../src/components/organization-chart.tsx", {
    "@/data/leadership": leadership,
  }).default;
  const html = renderToStaticMarkup(React.createElement(Chart));
  for (const label of [
    "Commissioner / Executive Director",
    "Jerico Magat",
    "Alice Pham",
    "Jeohnavi Bandoy",
    "Finance Director",
    "Vacant",
    "Cultural Chiefs",
    "Chief of Staff",
    "Oliver Casimiro",
    "Regional Senate",
    "Campus Chapter Officers",
    "General Body",
    "Two representatives per chapter",
  ])
    assert.ok(html.includes(label), label);
  assert.equal((html.match(/Jerico Magat/g) || []).length, 1);
  assert.doesNotMatch(
    html,
    /Title pending|organization-terminology|Historical records|confirmation before publication/,
  );
  assert.doesNotMatch(html, /<aside/);
  assert.match(html, /Name pending confirmation/);
  assert.equal((html.match(/class="org-level"/g) || []).length, 5);
  const executive = html
    .split('aria-label="Executive Team roles"')[1]
    .split("</ul>")[0];
  assert.ok(executive.includes("Oliver Casimiro"));
  assert.ok(
    executive.indexOf("Alice Pham") < executive.indexOf("Vice President"),
  );
  assert.ok(
    executive.indexOf("Vacant") < executive.indexOf("Finance Director"),
  );
  assert.match(html, /org-person-name/);
  assert.doesNotMatch(html, /Tier [1-5]|org-tier-label/);
});
test("carousel renders exactly 21 real cards with native looping and a logical 1\/21 counter", () => {
  const wrapper = ({ children, className, ...props }) =>
    React.createElement(
      "div",
      { className, "aria-label": props["aria-label"] },
      children,
    );
  const Card = load("../src/components/chapter-preview-card.tsx", {
    "@/data/chapter-previews": chapters,
    "@/components/ui/card": { Card: wrapper, CardContent: wrapper },
    "next/image": {
      __esModule: true,
      default: ({ src, alt }) => React.createElement("img", { src, alt }),
    },
  }).default;
  let options;
  const carousel = {
    Carousel: (props) => {
      options = props.opts;
      return wrapper(props);
    },
    CarouselContent: wrapper,
    CarouselItem: wrapper,
    CarouselNext: ({ children, ...props }) =>
      React.createElement("button", props, children),
    CarouselPrevious: ({ children, ...props }) =>
      React.createElement("button", props, children),
  };
  const Overview = load("../src/components/chapters-overview.tsx", {
    "@/data/chapter-previews": chapters,
    "@/components/chapter-preview-card": { __esModule: true, default: Card },
    "@/components/ui/carousel": carousel,
  }).default;
  const html = renderToStaticMarkup(React.createElement(Overview));
  assert.equal((html.match(/<h3/g) || []).length, 21);
  assert.equal((html.match(/Joined June 2026/g) || []).length, 21);
  assert.equal((html.match(/Club details forthcoming/g) || []).length, 4);
  assert.match(html.replace(/<[^>]+>/g, ""), /1\/21/);
  assert.match(html, /Mariner High School, 1 of 21/);
  assert.match(html, /bg-deep-blue/);
  assert.doesNotMatch(html, /2050ad|Across Washington|More to explore/);
  assert.equal(options.loop, true);
  assert.equal(options.startIndex, 0);
  assert.equal(
    options.breakpoints["(prefers-reduced-motion: reduce)"].duration,
    0,
  );
  assert.match(html, /Previous chapter/);
  assert.match(html, /Next chapter/);
});

test("carousel counter responds to selected-snap changes and native wraparound", () => {
  let selected = 0;
  const listeners = new Map();
  const api = {
    selectedScrollSnap: () => selected,
    on: (event, callback) => listeners.set(event, callback),
    off: (event) => listeners.delete(event),
    rootNode: () => ({ querySelector: () => null }),
  };
  const state = [api, 0];
  let cursor = 0,
    mounted = false;
  const cleanups = [];
  const mockReact = {
    useState: () => {
      const index = cursor++;
      return [
        state[index],
        (value) => {
          state[index] = value;
        },
      ];
    },
    useEffect: (effect) => {
      if (!mounted) {
        const cleanup = effect();
        if (cleanup) cleanups.push(cleanup);
      }
    },
  };
  const wrapper = ({ children }) => React.createElement("div", null, children);
  const Overview = load("../src/components/chapters-overview.tsx", {
    react: mockReact,
    "@/data/chapter-previews": chapters,
    "@/components/chapter-preview-card": {
      __esModule: true,
      default: ({ chapter }) =>
        React.createElement("h3", null, chapter.schoolName),
    },
    "@/components/ui/carousel": {
      Carousel: wrapper,
      CarouselContent: wrapper,
      CarouselItem: wrapper,
      CarouselPrevious: wrapper,
      CarouselNext: wrapper,
    },
  }).default;
  const render = () => {
    cursor = 0;
    const tree = Overview();
    mounted = true;
    return renderToStaticMarkup(tree).replace(/<[^>]+>/g, "");
  };
  assert.match(render(), /1\/21/);
  selected = 20;
  listeners.get("select")();
  assert.match(render(), /21\/21/);
  selected = 0;
  listeners.get("select")();
  assert.match(render(), /1\/21/);
  selected = 10;
  listeners.get("reInit")();
  assert.match(render(), /11\/21/);
  cleanups.forEach((cleanup) => cleanup());
  assert.equal(listeners.size, 0);
});
