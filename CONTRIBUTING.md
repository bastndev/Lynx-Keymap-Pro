# Contributing to Lynx Keymap Pro

Before contributing, read the [**Architecture Guide**](https://github.com/bastndev/Lynx-Keymap-Pro/blob/main/ARCHITECTURE.md) — it explains how the keymap system, AI integration, and multi-editor support fit together.

---

## Quick Start

1. **[Fork the repository](https://github.com/bastndev/Lynx-Keymap-Pro/fork)** on GitHub
2. Clone your fork and set up:

```bash
git clone https://github.com/YOUR-USERNAME/Lynx-Keymap-Pro.git
cd Lynx-Keymap-Pro
git checkout dev   # always work on dev
code .             # press F5 to test your changes live
```

> Submit all PRs to the `dev` branch. The maintainer handles `dev` → `main` merges.

---

## What You Can Contribute

<details>
<summary><strong>⌨️ New editor support</strong></summary>
<br>

**Currently supported:** VS Code · Cursor · Windsurf · Trae.ai · Kiro · Firebase Studio

**Files to modify:**
- `package.json` — keybinding definitions
- `src/keymaps/ai-keymap-config.js` — AI command configuration
- `src/keymaps/ai-keymap-handler.js` — editor detection & execution

**Process:** research the editor's commands → map to Lynx shortcuts → add AI integration → test fallback system → update docs.

</details>

<details>
<summary><strong>🎹 Keybinding improvements</strong></summary>
<br>

Enhance any shortcut category:
- **Navigation** (`Ctrl+1/2/3`, `Ctrl+Tab`)
- **File Management** (`Alt+C/V`)
- **Git Operations** (`Alt+1/2/3/4`, `Alt+Enter`)
- **AI Integration** (`` Ctrl+` ``, `Shift+Tab`, `Alt+A/S/D`)
- **Development** (`Alt+F`, `Insert`, `Alt+Insert`)
- **Visual Management** (`Ctrl+Alt+PgDn`, `Alt+Z`)

Always include both `key` (Win/Linux) and `mac` mappings, and use `when` conditions to avoid conflicts.

</details>

<details>
<summary><strong>🖥️ Keyboard layout variants</strong></summary>
<br>

Adaptations for different layouts: alternative key combinations, modifier remapping, function key utilization, or macro key integration.

</details>

<details>
<summary><strong>📝 Documentation</strong></summary>
<br>

Target files: `README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, and inline code comments.

</details>

---

## Submitting a PR

Your PR description should include:

- **What** changed and why
- **Editor(s)** tested (aim for at least VS Code + one more)
- **Screenshots or video** if the change is visual or behavioral

---

## Need Help?

- **Bug or idea?** → [Open an issue](https://github.com/bastndev/Lynx-Keymap-Pro/issues/new)
- **Architecture questions?** → [ARCHITECTURE.md](https://github.com/bastndev/Lynx-Keymap-Pro/blob/main/ARCHITECTURE.md)
- **Contact** → bastndev@gohit.xyz

Please follow our [Code of Conduct](https://github.com/bastndev/Lynx-Keymap-Pro/blob/main/CODE_OF_CONDUCT.md).

---

<sub>Maintained by [Gohit X](https://gohit.xyz) · Licensed under MIT</sub>