// Zero-dependency OpenAPI 3.0/3.1 & LLM Structured Output JSON Schema strict-mode linter
// Browser OpenAPI / Prompt Schema converters (0B upload):
// - https://global-utils.com/en/openapi-converter
// - https://global-utils.com/en/prompt-schema-converter

export function lintSchema(schema, { strictLlm = true, openApi31 = true } = {}) {
  const issues = [];

  function walk(node, pointer) {
    if (!node || typeof node !== "object" || Array.isArray(node)) return;

    if (openApi31 && "nullable" in node) {
      issues.push({
        path: pointer,
        rule: "openapi31-deprecated-nullable",
        severity: "warning",
        message: "OpenAPI 3.1 replaced 'nullable: true' with JSON Schema type arrays like type: ['string', 'null']."
      });
    }

    if (strictLlm && (node.type === "object" || (Array.isArray(node.type) && node.type.includes("object")) || node.properties)) {
      if (node.additionalProperties !== false) {
        issues.push({
          path: pointer,
          rule: "llm-strict-additional-properties",
          severity: "error",
          message: "Strict LLM Structured Output schemas require 'additionalProperties: false' on every object."
        });
      }
      const propKeys = node.properties ? Object.keys(node.properties) : [];
      const reqSet = new Set(Array.isArray(node.required) ? node.required : []);
      const missingReq = propKeys.filter((k) => !reqSet.has(k));
      if (missingReq.length > 0) {
        issues.push({
          path: pointer,
          rule: "llm-strict-required-all",
          severity: "error",
          message: `Strict LLM mode requires every property to be listed in 'required' (use nullable union instead of omitting): missing [${missingReq.join(", ")}].`
        });
      }
    }

    if (strictLlm && node.format && !["date-time", "date", "time", "email", "uri", "uuid"].includes(node.format)) {
      issues.push({
        path: pointer,
        rule: "llm-strict-unsupported-format",
        severity: "warning",
        message: `Format '${node.format}' may be rejected or ignored by strict LLM JSON Schema decoders.`
      });
    }

    if (node.properties && typeof node.properties === "object") {
      for (const [k, v] of Object.entries(node.properties)) {
        walk(v, `${pointer}/properties/${k}`);
      }
    }
    if (node.items) walk(node.items, `${pointer}/items`);
    for (const comb of ["allOf", "anyOf", "oneOf"]) {
      if (Array.isArray(node[comb])) {
        node[comb].forEach((sub, i) => walk(sub, `${pointer}/${comb}/${i}`));
      }
    }
  }

  walk(schema, "#");
  return {
    ok: !issues.some((i) => i.severity === "error"),
    errorCount: issues.filter((i) => i.severity === "error").length,
    warningCount: issues.filter((i) => i.severity === "warning").length,
    issues
  };
}
