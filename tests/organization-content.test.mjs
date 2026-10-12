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
    const expectedStem =
      chapter.id === "shoreline-community-college"
        ? "shoreline-college"
        : chapter.id;
    assert.match(
      chapter.image,
      new RegExp(`^/chapters/${expectedStem}\\.(jpg|webp|png)$`),
    );
    assert.equal(chapter.imageAlt, `Exterior of ${chapter.schoolName}`);
    assert.ok(
      fs.existsSync(new URL(`../public${chapter.image}`, import.meta.url)),
    );
  }
  assert.equal(chapters.chapterPreviews.filter((x) => x.image).length, 21);
  assert.equal(new Set(chapters.chapterPreviews.map((x) => x.image)).size, 21);
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
  assert.equal((html.match(/<img/g) || []).length, 21);
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

test("mission motif uses the same non-animated fixed frame across all four drawer states", () => {
  const css = fs.readFileSync(
    new URL("../src/app/globals.css", import.meta.url),
    "utf8",
  );
  const frame = css.split(".mission-motif-anchor {")[1].split("}")[0];
  assert.match(frame, /position: absolute/);
  assert.match(frame, /top: 0/);
  assert.match(frame, /height: 28rem/);
  assert.doesNotMatch(frame, /transition|animation|transform|height:.*%/);
  const wrapper = ({ children, ...props }) =>
    React.createElement("div", props, children);
  for (let index = 0; index < 4; index++) {
    const Mission = load("../src/components/mission.tsx", {
      react: { useState: () => [`mission-${index}`, () => {}] },
      "@/components/mission-card": {
        __esModule: true,
        default: ({ title, isActive }) =>
          React.createElement("article", { "data-active": isActive }, title),
      },
      "@radix-ui/react-accordion": {
        Root: ({ children, className }) => wrapper({ children, className }),
      },
      "motion/react": { MotionConfig: ({ children }) => children },
    }).default;
    const html = renderToStaticMarkup(React.createElement(Mission));
    assert.match(
      html,
      /<div aria-hidden="true" class="mission-motif-anchor"><span class="section-motif mission-motif"><\/span><\/div>/,
    );
    assert.match(html, /class="relative isolate mt-8 lg:mt-10"/);
    assert.equal((html.match(/data-active="true"/g) || []).length, 1);
    assert.equal((html.match(/<article/g) || []).length, 4);
  }
});

test("Washington motif anchors to the full section with independent foreground layers", () => {
  const Overview = load("../src/components/leadership-overview.tsx", {
    "next/link": {
      __esModule: true,
      default: ({ children, ...props }) =>
        React.createElement("a", props, children),
    },
    "@/components/organization-chart": {
      __esModule: true,
      default: () => React.createElement("figure", null, "Chart"),
    },
  }).default;
  const html = renderToStaticMarkup(React.createElement(Overview));
  assert.match(html, /class="relative isolate overflow-hidden bg-dark-cream/);
  assert.match(html, /<div class="mx-auto grid/);
  assert.match(
    html,
    /<div class="leadership-motif-anchor min-w-0"><span aria-hidden="true" class="section-motif leadership-motif"><\/span><div class="relative z-10"><figure>/,
  );
  assert.equal((html.match(/class="relative z-10"/g) || []).length, 2);
  const css = fs.readFileSync(
    new URL("../src/app/globals.css", import.meta.url),
    "utf8",
  );
  assert.match(
    css.split(".leadership-motif-anchor {")[1].split("}")[0],
    /position: static/,
  );
  const shared = css.split(".section-motif {")[1].split("}")[0];
  for (const rule of [
    "top: 50%",
    "left: 50%",
    "translate(-50%, -50%)",
    "pointer-events: none",
    "mask-size: contain",
  ])
    assert.ok(shared.includes(rule));
});

test("all 21 local chapter photos decode, have unique content, and support consistent cover crops", async () => {
  const sharp = nodeRequire("sharp");
  const { createHash } = nodeRequire("node:crypto");
  const digests = new Set();
  for (const chapter of chapters.chapterPreviews) {
    const file = new URL(`../public${chapter.image}`, import.meta.url);
    const bytes = fs.readFileSync(file);
    const metadata = await sharp(bytes).metadata();
    assert.ok(metadata.width > 0 && metadata.height > 0, chapter.schoolName);
    assert.ok(["jpeg", "png", "webp"].includes(metadata.format));
    digests.add(createHash("sha256").update(bytes).digest("hex"));
    const crop = await sharp(bytes)
      .rotate()
      .resize(300, 200, { fit: "cover" })
      .webp()
      .toBuffer();
    const result = await sharp(crop).metadata();
    assert.equal(result.width, 300);
    assert.equal(result.height, 200);
  }
  assert.equal(digests.size, 21);
});

test("chapter cards retain lazy Next Image sizing, configurable crop position, and branded fallback", () => {
  const calls = [];
  const wrapper = ({ children, className }) =>
    React.createElement("div", { className }, children);
  const Card = load("../src/components/chapter-preview-card.tsx", {
    "@/data/chapter-previews": chapters,
    "@/components/ui/card": { Card: wrapper, CardContent: wrapper },
    "next/image": {
      __esModule: true,
      default: (props) => {
        calls.push(props);
        return React.createElement("img", { src: props.src, alt: props.alt });
      },
    },
  }).default;
  for (const chapter of chapters.chapterPreviews) {
    const html = renderToStaticMarkup(React.createElement(Card, { chapter }));
    assert.match(html, /aspect-\[1\.5\]/);
    assert.ok(
      html.includes(
        renderToStaticMarkup(
          React.createElement(React.Fragment, null, chapter.schoolName),
        ),
      ),
    );
    assert.ok(html.includes("Joined June 2026"));
  }
  assert.equal(calls.length, 21);
  for (const props of calls) {
    assert.equal(props.fill, true);
    assert.equal(props.loading, "lazy");
    assert.equal(props.priority, undefined);
    assert.equal(props.className, "object-cover");
    assert.equal(props.style.objectPosition, "center");
    assert.ok(props.sizes.includes("767px") && props.sizes.includes("1023px"));
  }
  renderToStaticMarkup(
    React.createElement(Card, {
      chapter: { ...chapters.chapterPreviews[0], imagePosition: "50% 35%" },
    }),
  );
  assert.equal(calls.at(-1).style.objectPosition, "50% 35%");
  const fallback = renderToStaticMarkup(
    React.createElement(Card, {
      chapter: { ...chapters.chapterPreviews[0], image: undefined },
    }),
  );
  assert.match(fallback, /WFSA/);
  assert.doesNotMatch(fallback, /<img/);
});

test("public audience copy includes AAPI communities while retaining WFSA's Filipino roots and official name", () => {
  const copy = (file) =>
    fs
      .readFileSync(new URL(`../src/${file}`, import.meta.url), "utf8")
      .replace(/\s+/g, " ");
  const mission = copy("components/mission.tsx");
  assert.ok(
    mission.includes(
      "Create a welcoming statewide network where Asian American and Pacific Islander students can find belonging, support, and a community that feels like home.",
    ),
  );
  assert.ok(
    mission.includes(
      "Celebrate the diverse cultures, stories, and identities of AAPI communities while honoring the Filipino roots that brought our alliance together.",
    ),
  );
  assert.ok(
    mission.includes(
      "Bring chapters together through shared experiences, collaboration, and opportunities to learn from one another.",
    ),
  );
  assert.ok(
    mission.includes(
      "Equip students with the confidence, relationships, and skills to lead both on campus and beyond graduation.",
    ),
  );
  const chaptersCopy = copy("components/chapters-overview.tsx");
  assert.ok(
    chaptersCopy.includes(
      "Our chapters connect AAPI student organizations across Washington. Explore the schools and communities that make up our growing statewide network.",
    ),
  );
  const leadershipCopy = copy("components/leadership-overview.tsx");
  assert.ok(
    leadershipCopy.includes(
      "See how student leadership connects our statewide alliance, campus chapters, and AAPI communities across Washington.",
    ),
  );
  const footer = copy("components/site-footer.tsx");
  assert.ok(
    footer.includes(
      "Rooted in Filipino heritage, the Washington Filipino Student Alliance connects AAPI student communities across Washington through culture, collaboration, and student leadership.",
    ),
  );
  assert.equal(
    (footer.match(/Washington Filipino Student Alliance/g) || []).length,
    2,
  );
  const layout = copy("app/layout.tsx");
  assert.ok(layout.includes('title: "Washington Filipino Student Alliance"'));
  assert.ok(
    layout.includes(
      "Connecting Asian American and Pacific Islander (AAPI) student communities across Washington through culture, collaboration, and leadership.",
    ),
  );
  for (const source of [mission, chaptersCopy, leadershipCopy, footer, layout])
    assert.doesNotMatch(
      source,
      /where Filipino students|connects Filipino student|Filipino communities across|Honor Filipino stories/,
    );
});
