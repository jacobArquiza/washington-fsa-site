import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRequire } from "node:module";

// Use the existing compiler and Node test runner, without another dependency.
const filename = new URL("../src/lib/event-calendar.ts", import.meta.url);
const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const calendarModule = { exports: {} };
new Function("exports", "require", "module", compiled)(
  calendarModule.exports,
  () => {
    throw new Error("Calendar helpers must remain dependency-free at runtime");
  },
  calendarModule,
);
const {
  monthGrid,
  moveMonth,
  dateInZone,
  zonedTimestamp,
  isPublicEvent,
  eventsOnDate,
  eventsInMonth,
  upcomingEvents,
  formatEventSchedule,
} = calendarModule.exports;
const fixture = (id, overrides = {}) => ({
  id,
  title: `Test fixture ${id}`,
  startDate: "2030-06-12",
  timeZone: "America/Los_Angeles",
  ...overrides,
});

test("leap-year February and non-leap century rules", () => {
  assert.equal(monthGrid("2024-02").lastDate, "2024-02-29");
  assert.equal(monthGrid("2100-02").lastDate, "2100-02-28");
  assert.equal(monthGrid("2000-02").lastDate, "2000-02-29");
});
test("weekday alignment and four, five, six calendar rows", () => {
  assert.equal(monthGrid("2024-02").weeks[0][4], "2024-02-01");
  assert.equal(monthGrid("2021-02").weeks[0][1], "2021-02-01");
  assert.equal(monthGrid("2026-02").weeks.length, 4);
  assert.equal(monthGrid("2024-02").weeks.length, 5);
  assert.equal(monthGrid("2020-08").weeks.length, 6);
  const dates = monthGrid("2020-08").weeks.flat().filter(Boolean);
  assert.equal(dates.length, 31);
  assert.equal(new Set(dates).size, 31);
});
test("month navigation handles year boundaries", () => {
  assert.equal(moveMonth("2026-12", 1), "2027-01");
  assert.equal(moveMonth("2026-01", -1), "2025-12");
});
test("empty calendar remains usable", () => {
  assert.equal(eventsInMonth([], "2030-06").length, 0);
  assert.equal(eventsOnDate([], "2030-06-12").length, 0);
  assert.equal(upcomingEvents([]).length, 0);
  assert.ok(monthGrid("2030-06").weeks.length >= 4);
});
test("multiple events and chronological ordering, including date-only records", () => {
  const records = [
    fixture("late", { startTime: "18:00" }),
    fixture("early", { startTime: "09:00" }),
    fixture("all-day"),
    fixture("next", { startDate: "2030-06-13" }),
  ];
  assert.deepEqual(
    eventsOnDate(records, "2030-06-12").map((x) => x.id),
    ["all-day", "early", "late"],
  );
  assert.deepEqual(
    eventsInMonth(records, "2030-06").map((x) => x.id),
    ["all-day", "early", "late", "next"],
  );
});
test("Washington date boundaries are independent of browser/system timezone", () => {
  assert.equal(dateInZone(Date.parse("2030-06-13T06:59:00Z")), "2030-06-12");
  assert.equal(dateInZone(Date.parse("2030-06-13T07:00:00Z")), "2030-06-13");
  assert.equal(
    zonedTimestamp("2030-06-12", "23:30", "America/Los_Angeles"),
    Date.parse("2030-06-13T06:30:00Z"),
  );
  assert.equal(
    eventsOnDate([fixture("late", { startTime: "23:30" })], "2030-06-12")
      .length,
    1,
  );
  assert.equal(
    eventsOnDate([fixture("late", { startTime: "23:30" })], "2030-06-13")
      .length,
    0,
  );
});
test("other timezone times map to the Washington calendar date", () => {
  const event = fixture("east", {
    startTime: "01:00",
    timeZone: "America/New_York",
  });
  assert.equal(eventsOnDate([event], "2030-06-11").length, 1);
  assert.equal(eventsOnDate([event], "2030-06-12").length, 0);
  assert.match(formatEventSchedule(event), /June 11, 2030/);
});
test("daylight-saving gaps are rejected and repeated hours choose the earlier occurrence", () => {
  assert.ok(
    Number.isNaN(zonedTimestamp("2026-03-08", "02:30", "America/Los_Angeles")),
  );
  assert.equal(
    zonedTimestamp("2026-11-01", "01:30", "America/Los_Angeles"),
    Date.parse("2026-11-01T08:30:00Z"),
  );
  assert.equal(
    isPublicEvent(
      fixture("gap", { startDate: "2026-03-08", startTime: "02:30" }),
    ),
    false,
  );
});
test("multi-day events mark every included date and intersect months", () => {
  const event = fixture("span", {
    startDate: "2030-06-30",
    endDate: "2030-07-02",
  });
  for (const day of ["2030-06-30", "2030-07-01", "2030-07-02"])
    assert.equal(eventsOnDate([event], day).length, 1);
  assert.equal(eventsOnDate([event], "2030-07-03").length, 0);
  assert.equal(eventsInMonth([event], "2030-07").length, 1);
  assert.match(formatEventSchedule(event), /Time to be confirmed/);
});
test("timed overnight events span Washington dates", () => {
  const event = fixture("overnight", {
    startTime: "23:00",
    endDate: "2030-06-13",
    endTime: "01:00",
  });
  assert.equal(eventsOnDate([event], "2030-06-13").length, 1);
  assert.equal(
    upcomingEvents([event], Date.parse("2030-06-13T07:30:00Z")).length,
    1,
  );
  assert.equal(
    upcomingEvents([event], Date.parse("2030-06-13T08:01:00Z")).length,
    0,
  );
});
test("upcoming events retain date-only events through their local end date", () => {
  const event = fixture("all-day");
  assert.equal(
    upcomingEvents([event], Date.parse("2030-06-13T06:59:00Z")).length,
    1,
  );
  assert.equal(
    upcomingEvents([event], Date.parse("2030-06-13T07:00:00Z")).length,
    0,
  );
  assert.equal(
    upcomingEvents(
      [fixture("timed", { startTime: "09:00" })],
      Date.parse("2030-06-12T17:00:00Z"),
    ).length,
    0,
  );
});
test("invalid dates, times, ranges and zones are omitted", () => {
  for (const fields of [
    { startDate: "2030-02-30" },
    { startDate: "2030-2-03" },
    { startDate: "bad" },
    { endDate: "2030-06-11" },
    { endDate: "2030-06-31" },
    { startTime: "25:00" },
    { startTime: "" },
    { endTime: "10:00" },
    { startTime: "12:00", endTime: "11:00" },
    { timeZone: "invalid" },
    { title: "" },
  ])
    assert.equal(
      isPublicEvent(fixture("invalid", fields)),
      false,
      JSON.stringify(fields),
    );
  assert.throws(() => monthGrid("2030-13"), RangeError);
  assert.equal(eventsOnDate([fixture("valid")], "2030-02-30").length, 0);
});
test("draft and cancelled events do not appear in markers or upcoming lists", () => {
  const records = [
    fixture("cancelled", { status: "cancelled" }),
    fixture("draft", { status: "draft" }),
    fixture("public", { status: "confirmed" }),
  ];
  assert.deepEqual(
    eventsOnDate(records, "2030-06-12").map((x) => x.id),
    ["public"],
  );
  assert.deepEqual(
    upcomingEvents(records, Date.parse("2030-06-01T00:00:00Z")).map(
      (x) => x.id,
    ),
    ["public"],
  );
});

const nodeRequire = createRequire(import.meta.url);
const componentCode = ts.transpileModule(
  fs.readFileSync(
    new URL("../src/components/events-calendar.tsx", import.meta.url),
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
const componentModule = { exports: {} };
new Function("exports", "require", "module", componentCode)(
  componentModule.exports,
  (name) => {
    if (name === "@/lib/event-calendar") return calendarModule.exports;
    if (name === "next/link")
      return {
        __esModule: true,
        default: ({ children, ...props }) =>
          React.createElement("a", props, children),
      };
    return nodeRequire(name);
  },
  componentModule,
);
const Calendar = componentModule.exports.default;
const renderCalendar = (records, compact = false) =>
  renderToStaticMarkup(
    React.createElement(Calendar, {
      records,
      compact,
      initialNow: Date.parse("2030-06-01T12:00:00Z"),
    }),
  );

test("empty calendar renders real dates, controls, today and accessible empty state", () => {
  const html = renderCalendar([]);
  assert.match(html, /June 2030/);
  assert.match(html, /Previous month, May 2030/);
  assert.match(html, /Next month, July 2030/);
  assert.match(html, /aria-current="date"/);
  assert.match(html, /No events scheduled this month/);
  assert.equal((html.match(/data-date=/g) || []).length, 30);
  assert.equal((html.match(/tabindex="0"/g) || []).length, 1);
  assert.match(html, /role="status"/);
});
test("adding records automatically renders markers, sorted details and optional fields in both variants", () => {
  const records = [
    fixture("late", {
      startTime: "18:00",
      registrationUrl: "https://example.test/fixture",
    }),
    fixture("early", {
      startTime: "09:00",
      location: "Fixture location",
      description: "Fixture description",
    }),
  ];
  for (const compact of [true, false]) {
    const html = renderCalendar(records, compact);
    assert.match(html, /June 12, 2030, 2 events/);
    assert.ok(
      html.indexOf("Test fixture early") < html.indexOf("Test fixture late"),
    );
    assert.match(html, /Fixture location/);
    assert.match(html, /Fixture description/);
    assert.match(html, /https:\/\/example.test\/fixture/);
    assert.match(html, /PDT/);
  }
});
test("cancelled events and unsafe destinations never render", () => {
  const html = renderCalendar([
    fixture("cancelled", { status: "cancelled" }),
    fixture("unsafe", { registrationUrl: "javascript:alert(1)" }),
  ]);
  assert.doesNotMatch(html, /Test fixture cancelled/);
  assert.doesNotMatch(html, /javascript:/);
});

function interactiveCalendar(records) {
  const state = [];
  let cursor = 0;
  const mockReact = {
    useId: () => "test-calendar",
    useRef: () => ({ current: null }),
    useSyncExternalStore: (_subscribe, _snapshot, serverSnapshot) =>
      serverSnapshot(),
    useState: (initial) => {
      const index = cursor++;
      if (!(index in state)) state[index] = initial;
      return [
        state[index],
        (value) => {
          state[index] =
            typeof value === "function" ? value(state[index]) : value;
        },
      ];
    },
  };
  const interactiveModule = { exports: {} };
  new Function("exports", "require", "module", componentCode)(
    interactiveModule.exports,
    (name) => {
      if (name === "react") return mockReact;
      if (name === "@/lib/event-calendar") return calendarModule.exports;
      if (name === "next/link") return { __esModule: true, default: "a" };
      return nodeRequire(name);
    },
    interactiveModule,
  );
  return () => {
    cursor = 0;
    return interactiveModule.exports.default({
      records,
      compact: true,
      initialNow: Date.parse("2030-06-01T12:00:00Z"),
    });
  };
}
function nodes(tree) {
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  if (!tree || typeof tree !== "object") return [];
  return [tree, ...nodes(tree.props?.children)];
}
test("calendar handlers navigate without reload, select multiple events, and preserve selection across months", () => {
  const render = interactiveCalendar([fixture("one"), fixture("two")]);
  let tree = render();
  nodes(tree)
    .find((node) => node.props?.["data-date"] === "2030-06-12")
    .props.onClick();
  tree = render();
  assert.equal(
    nodes(tree).find((node) => node.props?.["data-date"] === "2030-06-12")
      .props["aria-pressed"],
    true,
  );
  assert.equal(nodes(tree).filter((node) => node.type === "h4").length, 2);
  nodes(tree)
    .find((node) => node.props?.["aria-label"] === "Next month, July 2030")
    .props.onClick();
  tree = render();
  assert.ok(
    nodes(tree).some((node) => node.props?.["data-date"] === "2030-07-01"),
  );
  assert.equal(nodes(tree).filter((node) => node.type === "h4").length, 2);
  nodes(tree)
    .find((node) => node.props?.["aria-label"] === "Previous month, June 2030")
    .props.onClick();
  tree = render();
  assert.equal(
    nodes(tree).find((node) => node.props?.["data-date"] === "2030-06-12")
      .props["aria-pressed"],
    true,
  );
});
