# Playwright Test Framework

This repository contains a Playwright-based test framework for UI and API tests.
The project includes a small helper `ApiClient`, test suites under `tests/`, and utility/config files.

## Repository layout

- `tests/` — Playwright test files (UI and API). Example: `tests/api`.
- `helpers/` — helper utilities (e.g. `apiClient.js`).
- `data/` — test data (e.g. `loginData.json`).
- `env/` — environment-specific configuration files (e.g. `dev.json`, `stage.json`).
- `auth.json` — (optional) exported browser storage containing tokens/localStorage used by tests.
- `playwright.config.js` — Playwright config.
- `package.json` — project dependencies and scripts.

## Goals

- Keep secrets and environment-specific files out of Git (see `.gitignore`).
- Reuse an exported `auth.json` token for API tests when available to avoid repeated logins.
- Provide simple commands to run tests locally on Windows/PowerShell.

## Prerequisites

- Node.js (v16+ recommended)
- npm (or yarn)
- npx (comes with npm)
- Playwright browsers (installed automatically by Playwright install scripts)

## Install

From the repository root:

```powershell
npm install
```

If Playwright browsers are not installed automatically, run:

```powershell
npx playwright install
```

## Environment & configuration

- Environment files live in `env/` (e.g. `env/dev.json`, `env/stage.json`).
- Basic test data may be in `data/loginData.json`.
- Sensitive files and environment configs are already listed in `.gitignore` (`/env/`, `loginData.json`, etc.).

The codebase contains logic that will try to read `auth.json` from the repository root and extract a token from `origins[0].localStorage` if present — this is useful for API tests that need a pre-generated token.

If you need to export the browser storage to `auth.json`, use Playwright's `storageState` or the browser devtools export. Place the file at repository root as `auth.json`.

## Running tests (PowerShell)

Run all tests:

```powershell
npx playwright test
```

Run tests in the `tests/api` folder:

```powershell
npx playwright test tests/api
```

Set the environment (example: `stage`) when running tests (PowerShell):

```powershell
# $env:ENV = "stage"; npx playwright test tests/api
$env:ENV = "stage"; npx playwright test
```

Run a single spec file:

```powershell
npx playwright test tests/api/api.spec.js
```

Open Playwright HTML report after a test run (the framework writes reports to `playwright-report/`):

```powershell
# After running tests, open report in your browser
Start-Process .\playwright-report\index.html
```

## Notes about `auth.json` and token reuse

- `auth.json` is optional. If present, some API tests will use the token saved under `origins[0].localStorage` → `token`.
- If `auth.json` is missing, tests will continue but may perform login flows (or fail if login is removed). Adjust tests as needed.

Security note: Do not commit secrets to Git. This repository's `.gitignore` already includes `/env/` and `loginData.json`. If any sensitive files were accidentally committed, remove them from the index and commit the removal (see next section).

## How to stop tracking files already committed

If files like `env/` or `data/loginData.json` were previously committed, add them to `.gitignore` (already present here) and then untrack them:

```powershell
# from repo root (PowerShell)
# Untrack a single file
git rm --cached data/loginData.json
# Or untrack a folder
git rm --cached -r env
# Commit the change
git commit -m "chore: stop tracking env/ and loginData.json"
# Push if needed
git push
```

This removes the file(s) from the Git index but preserves them in your working directory.

## Troubleshooting

- If tests fail due to missing token: ensure `auth.json` is present or the environment variables used for login are set (e.g. `USER_EMAIL`, `USER_PASSWORD`, `BASE_URL_API`).
- To debug a failing test, run it with Playwright's headed mode and verbose logging:

```powershell
npx playwright test -g "test name or regex" --headed --debug
```

## Contributing

- Add tests under `tests/`.
- Add helpers under `helpers/`.
- Keep secrets out of the repo; add any local-only files to `.gitignore`.

## Example: Quick checklist

1. npm install
2. (optional) npx playwright install
3. Provide `auth.json` at repo root if you want token reuse
4. $env:ENV = "stage"; npx playwright test

---

If you'd like, I can also:

- Add a `README` section describing `ApiClient` usage and the data shapes it expects.
- Create a short CONTRIBUTING.md with branch/PR guidelines.
- Add a short script in `package.json` to untrack sensitive files automatically.

Let me know which of those you'd prefer next.
