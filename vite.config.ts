import { defineConfig } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";

export default defineConfig({
  fmt: {
    experimentalSortImports: {},
    ignorePatterns: ["CHANGELOG.md"],
  },
  lint: {
    plugins: ["typescript", "import"],
    ignorePatterns: ["packages/deno", "packages/signals"],
    categories: {
      correctness: "error",
      suspicious: "error",
    },
    rules: {
      "import/no-unassigned-import": [
        "error",
        { allow: ["**/*.css", "**/*.scss", "@docsearch/css"] },
      ],
      "no-underscore-dangle": "off",
      "no-shadow": "off",
    },
    options: { typeAware: true, typeCheck: true },
  },
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    // Vitest v4 compatibility: keep separate Vite servers for inline projects.
    // Remove when plugins and config hooks can run once for shared projects.
    // https://vitest.dev/guide/migration/#inline-projects-share-the-vite-server-by-default
    sharedViteServer: false,
    projects: [
      {
        // Vitest v4 compatibility: keep this inline project independent of the root config.
        // Remove to inherit root options, including plugins and setup files.
        // https://vitest.dev/guide/migration/#inline-projects-inherit-the-root-config-by-default
        extends: false,
        test: {
          // Vitest v4 compatibility: preserve mock call history.
          // Remove after tests no longer rely on calls from setup or earlier tests.
          // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
          clearMocks: false,
          exclude: ["**/node_modules/**", "**/dist/**", "packages/anywidget/**"],
          name: "unit",
          environment: "node",
          typecheck: {
            enabled: true,
          },
        },
      },
      {
        // Vitest v4 compatibility: keep this inline project independent of the root config.
        // Remove to inherit root options, including plugins and setup files.
        // https://vitest.dev/guide/migration/#inline-projects-inherit-the-root-config-by-default
        extends: false,
        test: {
          // Vitest v4 compatibility: preserve mock call history.
          // Remove after tests no longer rely on calls from setup or earlier tests.
          // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
          clearMocks: false,
          include: ["packages/anywidget/**/*.test.{js,ts}"],
          name: "browser",
          browser: {
            locators: {
              // Vitest v4 compatibility: keep partial, case-insensitive locator matching.
              // Remove after updating locators for full, case-sensitive matches.
              // https://vitest.dev/guide/migration/#locators-are-strict-by-default
              exact: false,
            },
            enabled: true,
            headless: true,
            instances: [{ browser: "chromium", provider: playwright() }],
          },
        },
      },
    ],
  },
});
