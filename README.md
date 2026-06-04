# Alohomora

A small, browser-based password generator. Pick which character group(s) to include, set a length, and copy a cryptographically random password in one click.

👉 **[Live demo](https://okidokitokiloki.github.io/alohomora/)**

## How it works

Passwords are built from the enabled character groups. Each character is chosen with [`crypto.getRandomValues()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues), so generation stays unpredictable.

## Features

- **Ambiguous characters removed** — Confusing pairs like `I` / `l` and `0` / `O` are excluded from the pool.
- **Colour-coded output** — Each character group uses its own colour for easier distinction with the option to solarise which further adjusts certain colour contrast levels.
- **Sensible defaults** — Minimum length is 16 characters; the default is 25.
- **Copy to clipboard** — Click the password or use the dedicated copy button.
- **Live updates** — The password regenerates as options or length are changed.
- **Validation** — At least one character group must stay selected.
- **Appearance** — Light / dark theme with solarise toggle for each.

## Tech stack

- [Vite](https://vitejs.dev/)
- TypeScript
- HTML & CSS
