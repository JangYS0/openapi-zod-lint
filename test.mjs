import test from "node:test";
import assert from "node:assert/strict";
import { lintSchema } from "./index.mjs";

test("flags missing additionalProperties:false, omitted required keys, and OpenAPI 3.0 nullable", () => {
  const res = lintSchema({
    type: "object",
    properties: {
      id: { type: "string" },
      note: { type: "string", nullable: true }
    },
    required: ["id"]
  });
  assert.equal(res.ok, false);
  assert.ok(res.issues.some((i) => i.rule === "llm-strict-additional-properties"));
  assert.ok(res.issues.some((i) => i.rule === "llm-strict-required-all"));
  assert.ok(res.issues.some((i) => i.rule === "openapi31-deprecated-nullable"));
});

test("passes strict-mode compliant OpenAPI 3.1 / JSON Schema", () => {
  const res = lintSchema({
    type: "object",
    additionalProperties: false,
    properties: {
      id: { type: "string" },
      note: { type: ["string", "null"] }
    },
    required: ["id", "note"]
  });
  assert.equal(res.ok, true);
  assert.equal(res.errorCount, 0);
  assert.equal(res.warningCount, 0);
});
