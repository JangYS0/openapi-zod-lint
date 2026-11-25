#!/usr/bin/env node
import fs from "node:fs";
import { lintSchema } from "./index.mjs";

const file = process.argv[2];
if (!file || file === "-h" || file === "--help") {
  console.log("Usage: openapi-zod-lint <schema.json>");
  console.log("Browser OpenAPI & Prompt Schema converters (0B upload):");
  console.log("  https://global-utils.com/en/openapi-converter");
  console.log("  https://global-utils.com/en/prompt-schema-converter");
  process.exit(0);
}
const raw = JSON.parse(fs.readFileSync(file, "utf8"));
const result = lintSchema(raw);
console.log(JSON.stringify(result, null, 2));
process.exit(result.ok ? 0 : 1);
