# Lynx Keymap

🚀 **Supercharge Your Workflow** 🚀

Lynx Keymap — created by @bastndev — supercharges your workflow with curated keybindings for VSCode, seamlessly integrating AI tools like Cursor-AI and Trae-AI. ⌨️ Get instant access to essential commands for files, Git, debugging, AI sessions, and more.

## Supported Environments

- **VS Code** - Microsoft Visual Studio Code
- **Cursor AI** - AI-first code editor
- **Windsurf** - AI-powered development environment
- **Trae AI** - AI coding assistant
- **Firebase Studio** - Google's development platform

## Key Features

- **Universal Shortcuts**: Consistent keybindings across multiple development environments
- **AI-Enhanced Workflow**: Dedicated shortcuts for AI-powered development tasks
- **Git Integration**: Streamlined version control commands with AI commit generation
- **Multi-Language Support**: International keyboard layout compatibility
- **Experimental Features**: Cutting-edge shortcuts for the latest AI development tools
- **Developer Optimized**: Carefully curated shortcuts for maximum productivity

Discover more extensions at [bastndev.com/extensions](https://bastndev.com/extensions)

---

## Changelog

Following semantic versioning principles for consistent and predictable releases.

## [2.1.5] - 2025-08-11

### Added
- **New Keymap**: Added shortcut `Alt + ,` (`alt+,`) for sending the right arrow sequence in the terminal (`workbench.action.terminal.sendSequence` with `\u001b[C`).
- **Status Bar Color**: Added new shortcut for setting the status bar color to blue.

### Changed
- **Enhanced Shortcut**: Updated the keymap for sending `PgDn` in the terminal to include `Ctrl` on all platforms (`ctrl+alt+backspace` on Windows/Linux, `cmd+alt+backspace` on macOS).

## [2.1.3] - 2025-08-03

### Changed
- Updated extension showcase table description in `README.md`

## [2.1.0] - 2025-08-02

### Added
- **Personalized Notifications**: Customizable notification settings for keymap actions and AI events
- **New Keyboard Shortcuts**: Enhanced productivity with additional keymaps
  - `Shift + Alt + T` — Select theme (quick theme switching)
  - `Shift + Alt + R` — Reload window (instant environment refresh)
  - `Shift + Alt + E` — Go to line (precise navigation)
  - `Shift + Alt + W` — Expand line selection (enhanced text selection)

### Improved
- **Readme Enhancements**: Updated and reorganized README for better clarity, usability, and onboarding experience
  - Clearer feature descriptions
  - Improved visual structure
  - More accessible setup instructions
- **Community Documentation**: Professional contribution guidelines
  - `CODE_OF_CONDUCT.md` — Community standards and behavior guidelines
  - `CONTRIBUTING.md` — Developer contribution instructions and workflow

## [2.0.8] - 2025-07-24

### Changed
- **Renamed Extension**: Changed name from "Lynx Keymap" to "Lynx Keymap Pro" for enhanced branding and clarity

## [2.0.6] - 2025-07-23

### Added
- **Distinctive Logo Enhancement**: Added a unique element to the logo/icon for better distinction (icon itself unchanged, but now visually differentiated)
- **Professional Changelog**: Complete changelog documentation with comprehensive version history
- **Repository Star Button**: New ⭐️ button linking directly to GitHub repository for easy starring and support
- **Kiro Editor Support**: Full keymap integration with Kiro code editor
- **Enhanced Banner**: Updated main banner to include Kiro logo alongside other supported editors
- **Improved Documentation**: Better organization and visual presentation of features

### Changed
- Updated version numbering to 2.0.x for major feature milestone
- Enhanced visual branding with consistent logo integration
- Improved marketplace presentation and user experience

### Fixed
- Resolved minor documentation inconsistencies and formatting issues
- Better error handling across all supported editors
- Enhanced stability for AI command integrations
- Improved shortcut reliability in Kiro environment

## [2.0.1] - 2025-07-23

### Added
- **Enhanced AI Model Selection**: Improved `Alt + X` shortcut for AI model picker (VS Code only)
- **Advanced Color Theme Switching**: Better bottom color change functionality with `Ctrl + Alt + P`
- **Experimental Features Documentation**: Clearer marking of experimental vs stable features

### Changed
- Updated marketplace badges with improved color scheme
- Enhanced documentation structure for better readability
- Improved experimental features section organization

### Fixed
- Better handling of international keyboard layouts for backquote key
- Resolved conflicts with native VS Code shortcuts
- Enhanced AI command stability across different editors

## [2.0.0] - 2025-07-20

### Added
- **Firebase Studio Integration**: Complete keymap support for Firebase development workflow
- **Enhanced Debugging Controls**: Refined debugging shortcuts for better workflow
  - `Alt + P` - Start debugging
  - `Alt + O` - Restart debugging
  - `Alt + I` - Stop debugging

### Changed
- Improved debugging shortcuts organization and consistency
- Updated installation instructions with clearer platform guidance

### Fixed
- Resolved debugging command conflicts
- Better error handling for AI integrations

## [1.1.3] - 2025-07-18

### Added
- **Experimental AI Features**: New cutting-edge shortcuts for AI development
- `Alt + Z` - Ask, agent, edit functionality (VS Code only)
- `Shift + Esc` - Maximize & minimize AI interface (VS Code only)
- **Multi-Language Keyboard Support**: Extended international layout compatibility

### Changed
- Enhanced AI command documentation with clear VS Code-only indicators
- Improved table formatting for better visual navigation

## [1.1.2] - 2025-07-15

### Added
- **Windsurf Editor Support**: Complete integration with Windsurf AI development environment
- **Enhanced Git Workflow**: Advanced version control shortcuts
  - `Alt + 2` - AI-powered commit message generation
  - `Alt + Enter` - Git commit
  - `Ctrl + Alt + Enter` - Git push

### Fixed
- Improved Git command reliability across different editors
- Better handling of AI-generated commit messages

## [1.1.1] - 2025-07-12

### Added
- **Trae AI Integration**: Full keymap support for Trae AI development environment
- **Advanced File Management**: Enhanced file and folder operations
  - `Alt + C` - New file
  - `Alt + V` - New folder

### Changed
- Streamlined file management shortcuts for better ergonomics
- Updated documentation with emoji indicators for better navigation

## [1.0.0] - 2025-07-11

## Added International Keyboard Support
Lynx Keymap supports backquote key equivalents for international keyboards:

- 🇺🇸 English: `` ` ``
- 🇪🇸 Spanish: `º`, `|`
- 🇫🇷 French: `'`, `²`
- 🇩🇪 German: `'`, `^`, `¨`
- 🇷🇺 Russian: `ё`
- 🇵🇹 Portuguese: `~`, `´`
- 🇮🇹 Italian: `~`, `₤`
- 🇯🇵 Japanese: `半角/全角`
- 🇹🇷 Turkish: `₺`
- 🇬🇧 UK: `¬`
- And many more...

## [0.9.1] - 2025-07-10

### Added
- **Cursor AI Support**: Complete keymap integration for Cursor AI editor
- **AI Chat Interface**: Universal AI interaction shortcuts
  - ` Ctrl + ``  ` - AI chat interface popup/modal
  - `Shift + Tab` - Toggle AI chat (double-click first)
  - `Alt + A` - Create new AI session

### Fixed
- Resolved AI chat interface conflicts between different editors
- Improved AI command consistency across platforms

## [0.8.0] - 2025-07-08

### Added
- **Enhanced Code Formatting**: Comprehensive formatting shortcuts
  - `Alt + F` - Format document
  - `Ctrl + Alt + F` - Format selection
  - `Shift + Alt + F` - Organize imports

### Changed
- Improved code formatting workflow integration
- Better documentation structure and examples

## [0.6.9] - 2025-07-05

### Added
- **Git Integration**: Core version control shortcuts
  - `Alt + 1` - Select all changed files
  - `Alt + 3` - Unstage all changes
  - `Alt + 4` - Git pull
- **Panel Management**: Enhanced workspace control
  - `Alt + Q` - Toggle debug console
  - `Alt + W` - Toggle terminal
  - `Alt + E` - Open GitLens

### Fixed
- Improved panel switching reliability
- Better Git command integration

## [0.6.0] - 2025-07-01

### Added
- **Core Navigation**: Essential workspace shortcuts
  - `Ctrl + 1` - Open explorer
  - `Ctrl + 2` - Open source control
  - `Ctrl + 3` - Open extensions
  - `Ctrl + Tab` - Toggle sidebar

### Changed
- Established core shortcut foundation
- Improved keyboard navigation workflow

## [0.3.0] - 2025-06-25

### Added
- **AI Command Foundation**: Basic AI integration shortcuts
- **Multi-Platform Support**: macOS, Windows, and Linux compatibility
- **International Keyboard Support**: Backquote key equivalents for multiple languages

### Changed
- Enhanced cross-platform compatibility
- Improved international user experience

## [0.1.0] - 2025-06-20

### Added
- **Basic Shortcuts**: Fundamental development shortcuts
- **Editor Integration**: Initial VS Code keymap implementation
- **Documentation**: Basic usage instructions and shortcut tables

## [0.0.1] - 2025-04-26

### Initial Release
- Initial release of Lynx Keymap
- Basic keymap implementation for VS Code
- Core keyboard shortcut infrastructure and settings
- Foundation for multi-editor AI integration