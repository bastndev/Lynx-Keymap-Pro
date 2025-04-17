const vscode = require('vscode');

function activate(context) {
    // Command for AI commit generation [ctrl+alt+1]
    let commitDisposable = vscode.commands.registerCommand('lynx-keymap.generateAICommit', async function () {
        const commitCommands = [
            'windsurf.generateCommitMessage',               // Priority 1: Windsurf
            'icube.gitGenerateCommitMessage',               // Priority 2: Trae-AI 
            'cursor.generateGitCommitMessage',              // Priority 3: Cursor-AI
            'github.copilot.git.generateCommitMessage'      // Priority 4: VScode 
            // FirebaseStudio DON'T have this option now   // --- --- 5: Firebase Studio
        ];
        await executeFirstAvailableCommand(commitCommands, 'No AI commit generators available');
    });

    // Command for AI Popup [ctrl+`]
    let popupDisposable = vscode.commands.registerCommand('lynx-keymap.executeAIPopup', async function () {
        const popupCommands = [
            'windsurf.prioritized.command.open', // Priority 1: Windsurf
            'aipopup.action.modal.generate',     // Priority 2: Cursor-AI 
            'icube.inlineChat.start',            // Priority 3: Trae-AI 
            'inlineChat.start',                   // Priority 4: VScode 
            'workbench.action.terminal.chat.start' // Priority 5: FireBase Studio

        ];
        await executeFirstAvailableCommand(popupCommands, 'No AI chat providers available');
    });

    // Command to open AI chat [ctrl+tab]
    let chatDisposable = vscode.commands.registerCommand('lynx-keymap.openAIChat', async function () {
        const chatCommands = [
            'windsurf.prioritized.chat.open',     // Priority 1: Windsurf
            'workbench.action.chat.icube.open', // Priority 2: Trae-AI 
            'aichat.newchataction',             // Priority 3: Cursor-AI 
            'workbench.panel.chat',              // Priority 4: VScode 
            'aichat.prompt'                  // Priority 5: Firebase Studio
        ];
        await executeFirstAvailableCommand(chatCommands, 'No AI chat providers available');
    });

    // Command to create a new AI session [ctrl+alt+`]
    let newSessionDisposable = vscode.commands.registerCommand('lynx-keymap.createNewAISession', async function () {
        const newSessionCommands = [
            'windsurf.prioritized.chat.openNewConversation', // <--- Priority 1: Windsurf
            'workbench.action.icube.chatSidebarNg.createNewSession', // Priority 2: Trae-AI 
            'composer.createNew',                                   // Priority 3: Cursor-AI
            'workbench.action.chat.newEditSession',                 // Priority 4: VScode
            // Firebase Studio  DON'T have this  option now              // --- --- 5: Firebase Studio
        ];
        await executeFirstAvailableCommand(newSessionCommands, 'No AI providers available to create a new session');
    });

    // Command to show AI history [ctrl+shift+`]
    let historyDisposable = vscode.commands.registerCommand('lynx-keymap.showAIHistory', async function () {
        const historyCommands = [
            'workbench.action.icube.chatSidebarNg.showHistory', // Priority 1: Trae-AI 
            'composer.showComposerHistory',                     // Priority 2: Cursor-AI 
            'workbench.action.chat.history'                     // Priority 3: VScode
            // Windsurf  DON'T have this option now                  // --- --- - 4: Windsurf
            // Firebase Studio  DON'T have this  option now           // --- ---   5: Firebase Studio
        ];
        await executeFirstAvailableCommand(historyCommands, 'No AI history available');
    });

    context.subscriptions.push(
        commitDisposable,
        popupDisposable,
        chatDisposable,
        newSessionDisposable,
        historyDisposable
    );
}

async function executeFirstAvailableCommand(commands, errorMessage) {
    const allCommands = await vscode.commands.getCommands(true);
    for (const cmd of commands) {
        if (allCommands.includes(cmd)) {
            try {
                await vscode.commands.executeCommand(cmd);
                return;
            } catch (error) {
                console.error(`Error executing command ${cmd}:`, error);
            }
        }
    }
    vscode.window.showWarningMessage(errorMessage);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};