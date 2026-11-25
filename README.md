# openapi-zod-lint

Zero-dependency Node.js (`>=18`) CLI and module that catches **OpenAPI 3.0 -> 3.1** migration pitfalls and **LLM Structured Outputs strict-mode** JSON Schema errors before runtime API `400`s.

## What It Catches

- `nullable: true` (OpenAPI 3.0) instead of `type: ["string", "null"]` (OpenAPI 3.1 / JSON Schema 2020-12)
- Missing `additionalProperties: false` on nested objects (rejected by strict LLM Structured Outputs)
- Object properties omitted from `required` (rejected by OpenAI strict JSON Schema mode)
- Potentially unsupported `format` hints

## Quick Start

```bash
node cli.mjs ./my-schema.json
npm test
```

## Interactive Browser Tools (0B Upload)

- **OpenAPI Converter:** https://global-utils.com/en/openapi-converter
- **Prompt / Structured Output Schema Converter:** https://global-utils.com/en/prompt-schema-converter
- **JSON to Zod Converter:** https://global-utils.com/en/json-to-zod
- **JSON to TypeScript Converter:** https://global-utils.com/en/json-to-ts

## License

MIT
