# Contributing to Lynx Keymap Pro

## Welcome! 🌟

Thank you for your interest in contributing to **Lynx Keymap Pro**! We're excited to have you join our community of developers who are passionate about creating efficient, standardized keyboard shortcuts across all code editors.

Whether you want to add support for new editors, adapt shortcuts for different Pro keyboard variants, improve existing keybindings, or enhance documentation, your contributions are valuable and welcome.

## Understanding the Project 🏗️

Before diving into contributions, we recommend reading our [**Architecture Documentation**](https://github.com/bastndev/Lynx-Keymap-Pro/blob/main/ARCHITECTURE.md) to understand:
- How the keymap system works across multiple editors
- The AI integration and fallback system
- File organization and keymap structure
- Multi-editor support architecture
- Pro keyboard optimization principles

This will help you make more effective contributions and understand where your changes fit in the bigger picture.

## Getting Started 🚀

### Prerequisites

- **VS Code** (primary development environment)
- **Git** for version control
- **Pro keyboard** recommended for testing (but any keyboard works)
- **Multiple editors** for testing cross-editor compatibility

### Setting Up Your Development Environment

1. **Fork the repository**: Click the "Fork" button on the [Lynx Keymap Pro repository](https://github.com/bastndev/Lynx-Keymap-Pro)

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Lynx-Keymap-Pro.git
   cd Lynx-Keymap-Pro
   ```

3. **Switch to the dev branch**:
   ```bash
   git checkout dev
   ```

4. **Open in VS Code**:
   ```bash
   code .
   ```

## Development Workflow 🛠️

### Testing Your Changes

- **Press `F5`** to launch a new VS Code window with your keymap loaded
- **Alternative**: If you have the extension installed, test shortcuts directly
- **Test across editors**: Verify shortcuts work in VS Code, Cursor, Windsurf, etc.
- **Test keyboard variants**: Ensure compatibility with different Pro layouts

### Making Changes

1. **Create your changes** in the `dev` branch
2. **Test thoroughly** across multiple editors and keyboard layouts
3. **Commit your changes** with descriptive messages
4. **Push to your fork**:
   ```bash
   git push origin dev
   ```

## Types of Contributions 📝

### 1. Adding Support for New Editors

**Currently supported**: VS Code • Cursor • Windsurf • Trae.ai • Kiro • Firebase Studio

**To add a new editor**:

**Files to modify**:
- `package.json` - Add new keybindings for the editor
- `src/keymaps/ai-keymap-config.js` - Configure AI commands
- `src/keymaps/ai-keymap-handler.js` - Handle editor detection and execution

**Example process**:
1. Research the new editor's command structure
2. Map Lynx shortcuts to editor-specific commands
3. Add AI integration if the editor supports it
4. Test priority-based fallback system
5. Update documentation

### 2. Adapting for Different Pro Keyboard Variants

**Common variations**:
- Different function key layouts
- Extra macro keys
- Alternative modifier key positions
- Regional layout differences

**Adaptation areas**:
- Key combination alternatives
- Modifier key mappings
- Function key utilization
- Macro key integration

### 3. Improving Existing Keybindings

You can enhance any of our current shortcut categories:
- **Navigation** (`Ctrl+1/2/3`, `Ctrl+Tab`)
- **File Management** (`Alt+C/V`)
- **Git Operations** (`Alt+1/2/3/4`, `Alt+Enter`)
- **AI Integration** (`Ctrl+\``, `Shift+Tab`, `Alt+A/S/D`)
- **Development** (`Alt+F`, `Alt+P`, `Alt+O`)
- **Visual Management** (`Ctrl+Alt+,`, `Alt+Z`)

### 4. Enhancing AI Integration

**AI command improvements**:
- Better editor detection
- Enhanced fallback mechanisms
- New AI workflow shortcuts
- Cross-editor compatibility
- Smart context awareness

### 5. Documentation Improvements

We welcome improvements to:
- **README.md** - Main project documentation
- **CONTRIBUTING.md** - This guide
- **ARCHITECTURE.md** - Technical architecture documentation
- **CHANGELOG.md** - Version history
- Code comments and inline documentation

## Project Structure Deep Dive 📁

```
lynx-keymap-pro/
├── src/
│   ├── extension.js              # Main entry point
│   ├── editor-ui/                # UI components
│   │   ├── status-bar.js         # Status bar color management
│   │   └── icons/
│   │       ├── icon-painter.js   # Icon color system
│   │       └── macros.js         # Macro automation
│   └── keymaps/                  # 🎯 MAIN CONTRIBUTION AREA
│       ├── ai-keymap-config.js   # AI command configuration
│       └── ai-keymap-handler.js  # AI execution logic
├── assets/                       # Resources and icons
├── package.json                  # 🎯 KEYMAP DEFINITIONS
└── README.md                     # Documentation
```

### Key Files for Contributors

**`package.json`** - Main keybinding definitions:
- Add new keyboard shortcuts
- Configure editor-specific commands
- Define when conditions for shortcuts

**`src/keymaps/ai-keymap-config.js`** - AI integration:
- Editor detection logic
- Command priority system
- Fallback mechanisms

**`src/keymaps/ai-keymap-handler.js`** - Execution handling:
- Cross-editor compatibility
- Error handling
- Smart command routing

## Submitting Your Contribution 🎯

### Pull Request Requirements

When creating your PR, please include:

1. **Clear description** of what you've added/changed
2. **Editor support information** (if adding new editor support):
   - Editor name and version
   - Specific commands implemented
   - AI integration level
   - Testing results

3. **Keyboard compatibility** (if adapting for keyboard variants):
   - Keyboard model/layout tested
   - Alternative key combinations
   - Compatibility notes

4. **Screenshots/Videos** (highly recommended):
   - Show shortcuts in action across different editors
   - Demonstrate Pro keyboard optimization
   - Include workflow examples

### Testing Checklist

Before submitting, please test with:

**Editors:**
- ✅ **VS Code** - Primary platform
- ✅ **Cursor** - AI-focused editor  
- ✅ **Windsurf** - Advanced AI capabilities
- ✅ **Trae.ai** - Alternative AI provider
- ✅ **Kiro** - Emerging platform
- ✅ **Firebase Studio** - Basic support

**Functionality:**
- ✅ **Navigation shortcuts** (Ctrl+1/2/3, Ctrl+Tab)
- ✅ **Git operations** (Alt+1/2/3/4, Alt+Enter)
- ✅ **AI integration** (Ctrl+`, Shift+Tab, Alt+A/S/D)
- ✅ **Development tools** (Alt+F, Alt+P, debugging)
- ✅ **Visual management** (color toggles, macros)

**Keyboard layouts:**
- ✅ **Standard Pro** layout
- ✅ **Your specific variant** (if different)
- ✅ **Function key accessibility**
- ✅ **Modifier key combinations**

## Important Notes ⚠️

### What You CAN Modify

**Package.json modifications**:
- ✅ Add new keybindings for new editors
- ✅ Add support for new keyboard variants
- ✅ Extend existing shortcut categories
- ✅ Add new AI integration commands

**Guidelines**:
- Follow existing keybinding structure
- Include both Windows/Linux (`key`) and macOS (`mac`) mappings
- Use appropriate `when` conditions for context-sensitive shortcuts
- Test for conflicts with existing shortcuts

### Code Formatting

The project maintains specific formatting for configuration files. Your changes should respect the existing structure and spacing patterns shown in the current files.

### Branch Strategy

- **Work in**: `dev` branch only
- **Submit PRs to**: `dev` branch
- The maintainer will merge `dev` → `main` for releases

## Naming Conventions 📝

**No strict patterns required**, but for consistency:

**New keymap files**: Descriptive names like:
- `[editor-name]-keymap-config.js`
- `[feature]-shortcuts.js`
- `[keyboard-variant]-mappings.js`

**Commands in package.json**: Follow existing pattern:
- `lynx-keymap.[functionName]`
- Example: `lynx-keymap.generateAICommit`

## Multi-Editor Integration Guide 🌐

When adding support for a new editor:

### 1. Research Phase
- Study the editor's command palette
- Identify AI integration capabilities  
- Map equivalent functions to existing Lynx shortcuts

### 2. Implementation Phase
- Add keybindings to `package.json`
- Update `ai-keymap-config.js` for editor detection
- Modify `ai-keymap-handler.js` for command execution
- Set appropriate priority in fallback system

### 3. Testing Phase
- Verify all shortcut categories work
- Test AI integration functionality
- Confirm Pro keyboard optimization
- Check cross-editor consistency

## Getting Help 🆘

- **Bugs or issues?** Create an [Issue](https://github.com/bastndev/Lynx-Keymap-Pro/issues)
- **Architecture questions?** Check the [Architecture documentation](https://github.com/bastndev/Lynx-Keymap-Pro/blob/main/ARCHITECTURE.md)
- **Need inspiration?** Study existing keybindings in `package.json`

## Code of Conduct 📋

Please read and follow our [Code of Conduct](https://github.com/bastndev/Lynx-Keymap-Pro/blob/main/CODE_OF_CONDUCT.md) to ensure a welcoming environment for everyone.

---

**Thank you for contributing to Lynx Keymap Pro!** Your work helps developers worldwide have a consistent, efficient coding experience across all editors and keyboard layouts. 🚀