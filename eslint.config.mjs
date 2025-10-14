import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { deserialize, serialize } from "v8";

if (typeof globalThis.structuredClone !== "function") {
  /**
   * Minimal structuredClone polyfill so ESLint 9 can run on Node 16.
   * Options are ignored because ESLint does not pass any.
   */
  globalThis.structuredClone = (value) => deserialize(serialize(value));
}

if (typeof globalThis.AbortSignal !== "undefined") {
  const proto = globalThis.AbortSignal.prototype;
  if (typeof proto.throwIfAborted !== "function") {
    proto.throwIfAborted = function throwIfAborted() {
      if (!this.aborted) return;
      throw this.reason ?? new Error("This operation was aborted");
    };
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": "allow-with-description",
          "ts-nocheck": "allow-with-description",
          "ts-check": "allow-with-description",
        },
      ],
    },
  },
  {
    files: ["scripts/**/*.{js,ts,mjs,tsx}", "*.mjs", "debug-*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
