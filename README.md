# interview-code-js

A collection of small JavaScript/TypeScript exercises and utilities. The repository is organized by year/month folders and contains self-contained examples (many with simple console-based tests) used for interview preparation and practice. A minimal TypeScript entry point is provided.

## Stack detection
- Language: TypeScript (primary) and JavaScript (examples)
- Runtime: Node.js
- Package manager: npm (package-lock.json present)
- Build tool: TypeScript compiler (tsc)
- Frameworks: none (plain Node + TS/JS)

## Entry points
- Library/app main (per package.json): `dist/index.js` built from `src/index.ts`.
  - Current `src/index.ts` logs a greeting. Build first, then run with Node.
- Many standalone example files live under `src/com/interview/code/js/...`.
  - JavaScript examples (`.js`) can be run directly with Node from the repo root, e.g.:
    - `node src/com/interview/code/js/2025/july/test2/test3.js`
  - TypeScript examples (`.ts`) require compilation to JS or a TS runner (see notes below).

## Requirements
- Node.js and npm installed
  - TODO: Document the exact Node.js version used/developed against (e.g., LTS 18/20)

## Setup
1. Install dependencies
   - `npm install`
2. Build TypeScript → JavaScript
   - `npm run build`

## How to run
- Run the compiled main entry after building:
  - `node dist/index.js`
- Run a specific JavaScript example directly (no build needed):
  - `node src/com/interview/code/js/2025/july/test2/test3.js`
- Run a TypeScript example file (options):
  - Option A: Compile whole project then execute the compiled file from `dist` (paths mirror `src`).
    - `npm run build`
    - `node dist/com/interview/code/js/2025/july/test3/test1.js`
  - Option B: Use ts-node (not currently in devDependencies) to execute TS directly.
    - `npx ts-node src/com/interview/code/js/2025/july/test3/test1.ts`
    - TODO: Add `ts-node` and a script to package.json for convenience.

## npm scripts
- `build`: Compiles TypeScript using `tsc` to `dist/`.

## Environment variables
- None required for current examples.
- TODO: If any future modules require configuration, document env vars here.

## Tests
- No formal test framework is configured yet.
- Several files contain inline console-based test runners (e.g., `runTests()` in `src/com/interview/code/js/2025/july/test2/test3.js`). Run them with Node as shown above.
- TODO:
  - Pick a test framework (e.g., Jest, Vitest, or Mocha) and add it to devDependencies.
  - Add npm scripts like `test`, `test:watch`, and minimal sample tests.

## Project structure (abridged)
- `src/`
  - `index.ts` — main TypeScript entry
  - `com/interview/code/js/` — collections of exercises/examples organized by year/month
    - `2025/july/test2/test3.js` — example with simple data structures and an inline test runner
    - `2025/july/test3/test1.ts` — TypeScript example
    - ... many more (`feb`, `march`, `june`, `july`, etc.)
- `dist/` — build output (created by `npm run build`)
- `tsconfig.json` — TypeScript compiler configuration (outDir: `dist`, module: `commonjs`)
- `package.json` — package metadata and scripts

## Development notes
- The TypeScript compiler is configured with:
  - `strict: true`
  - `module: commonjs`
  - `target: es2016`
  - `outDir: dist`
  - `include: ["src"]`
- JavaScript files under `src/` are not emitted by `tsc` unless `allowJs` is enabled (not currently set). They can still be run directly with Node from `src`.
- TODO: Consider adding `allowJs: true` if you want `.js` files also copied/emitted to `dist` during builds.

## License
- No license file currently found.
- TODO: Add a LICENSE file and specify the license in `package.json`.
