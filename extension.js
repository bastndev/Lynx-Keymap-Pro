const vscode = require('vscode');

function activate(context) {
    console.log('Congratulations, your extension "lynx-keymap" is now active!'); // Mensaje de activación

    // Command for AI commit generation  [ctrl+alt+1]
    let commitDisposable = vscode.commands.registerCommand('lynx-keymap.generateAICommit', async function () {
        const commitCommands = [
            'windsurf.generateCommitMessage',
            'icube.gitGenerateCommitMessage',
            'cursor.generateGitCommitMessage',
            'github.copilot.git.generateCommitMessage'
        ];
        await executeFirstAvailableCommand(commitCommands, 'No AI commit generators available');
    });

    // Command for AI Popup  [ctrl+`]
    let popupDisposable = vscode.commands.registerCommand('lynx-keymap.executeAIPopup', async function () {
        const popupCommands = [
            'windsurf.prioritized.command.open',    // 1: Windsurf    
            'aipopup.action.modal.generate',        // 2: Cursor-AI  
            'icube.inlineChat.start',               // 3: Trae-AI
            'inlineChat.start',                     // 4: Vscode   
            'workbench.action.terminal.chat.start'  // 5: Firebase.Studio
        ];
        await executeFirstAvailableCommand(popupCommands, 'No AI chat providers available');
    });

    // Command to open AI chat  [ctrl+tab]
    let chatDisposable = vscode.commands.registerCommand('lynx-keymap.openAIChat', async function () {
        const chatCommands = [
            'windsurf.prioritized.chat.open',    // 1: Windsurf
            'aichat.newchataction',              // 3: Cursor-AI
            'workbench.action.chat.icube.open',  // 2: Trae-AI
            'workbench.panel.chat',              // 4: Vscode
            'aichat.prompt'                      // 5: Firebase.Studio
        ];
        await executeFirstAvailableCommand(chatCommands, 'No AI chat providers available');
    });

    // Command to create a new AI session  [ctrl+alt+`]
    let newSessionDisposable = vscode.commands.registerCommand('lynx-keymap.createNewAISession', async function () {
        const newSessionCommands = [
            'windsurf.prioritized.chat.openNewConversation',        // 1: Windsurf
            'composer.createNew',                                   // 3: Cursor-AI
            'workbench.action.icube.chatSidebarNg.createNewSession',// 2: Trae-AI
            'workbench.action.chat.newEditSession',                 // 4: Vscode
            // Don;t have a Firebase equivalent for this            // 5: Firebase.Studio
        ];
        await executeFirstAvailableCommand(newSessionCommands, 'No AI providers available to create a new session');
    });

    // Command to show AI history  [ctrl+shift+`]
    let historyDisposable = vscode.commands.registerCommand('lynx-keymap.showAIHistory', async function () {
        const historyCommands = [
            // Windsurf doesn't have a history command          // 1: Windsurf
            'composer.showComposerHistory',                     // 2:Cursor-AI           
            'workbench.action.icube.chatSidebarNg.showHistory', // 3:trae-AI
            'workbench.action.chat.history' ,                   // 4:Vscode
            // Firebase doesn't have a history command          // 5: Firebase.Studio
        ];
        await executeFirstAvailableCommand(historyCommands, 'No AI history available');
    });

    // New command to toggle inline suggestions
    let toggleSuggestDisposable = vscode.commands.registerCommand('lynx-keymap.toggleInlineSuggest', async () => {
        const config = vscode.workspace.getConfiguration();
        const currentValue = config.get('editor.inlineSuggest.enabled', true);
        const newValue = !currentValue;

        try {
            await config.update('editor.inlineSuggest.enabled', newValue, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`Inline Suggestions ${newValue ? 'Enabled' : 'Disabled'}.`);
        } catch (error) {
            console.error("Error updating 'editor.inlineSuggest.enabled':", error);
            vscode.window.showErrorMessage("Failed to toggle Inline Suggestions setting.");
        }
    });

    // Add all disposables to the subscriptions
    context.subscriptions.push(
        commitDisposable,
        popupDisposable,
        chatDisposable,
        newSessionDisposable,
        historyDisposable,
        toggleSuggestDisposable
    );
}

// Helper function to execute the first available command
async function executeFirstAvailableCommand(commands, errorMessage) {
    const allCommands = await vscode.commands.getCommands(true);
    for (const cmd of commands) {
        if (allCommands.includes(cmd)) {
            try {
                await vscode.commands.executeCommand(cmd);
                console.log(`Executed command: ${cmd}`);
                return;
            } catch (error) {
                console.error(`Error executing command ${cmd}:`, error);
            }
        } else {
            console.log(`Command not available: ${cmd}`);
        }
    }
    vscode.window.showWarningMessage(errorMessage);
}


function deactivate() { }

module.exports = {
    activate,
    deactivate
};