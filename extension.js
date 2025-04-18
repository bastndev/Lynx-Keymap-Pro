const vscode = require('vscode');

function activate(context) {
    console.log('Congratulations, your extension "lynx-keymap" is now active!'); // Mensaje de activación

    // Command for AI commit generation    [ctrl+alt+1]
    let commitDisposable = vscode.commands.registerCommand('lynx-keymap.generateAICommit', async function () {
        const commitCommands = [
            'windsurf.generateCommitMessage',
            'icube.gitGenerateCommitMessage',
            'cursor.generateGitCommitMessage',
            'github.copilot.git.generateCommitMessage'
        ];
        await executeFirstAvailableCommand(commitCommands, 'No AI commit generators available');
    });

    // Command for AI Popup                 [ctrl+`]
    let popupDisposable = vscode.commands.registerCommand('lynx-keymap.executeAIPopup', async function () {
        const popupCommands = [
            'windsurf.prioritized.command.open',
            'aipopup.action.modal.generate',
            'icube.inlineChat.start',
            'inlineChat.start',
            'workbench.action.terminal.chat.start'
        ];
        await executeFirstAvailableCommand(popupCommands, 'No AI chat providers available');
    });

    // Command to open AI chat              [ctrl+tab]
    let chatDisposable = vscode.commands.registerCommand('lynx-keymap.openAIChat', async function () {
        const chatCommands = [
            'windsurf.prioritized.chat.open',
            'workbench.action.chat.icube.open',
            'aichat.newchataction',
            'workbench.panel.chat',
            'aichat.prompt'
        ];
        await executeFirstAvailableCommand(chatCommands, 'No AI chat providers available');
    });

    // Command to create a new AI session [ctrl+alt+`]
    let newSessionDisposable = vscode.commands.registerCommand('lynx-keymap.createNewAISession', async function () {
        const newSessionCommands = [
            'windsurf.prioritized.chat.openNewConversation',
            'workbench.action.icube.chatSidebarNg.createNewSession',
            'composer.createNew',
            'workbench.action.chat.newEditSession',
        ];
        await executeFirstAvailableCommand(newSessionCommands, 'No AI providers available to create a new session');
    });

    // Command to show AI history           [ctrl+shift+`]
    let historyDisposable = vscode.commands.registerCommand('lynx-keymap.showAIHistory', async function () {
        const historyCommands = [
            'workbench.action.icube.chatSidebarNg.showHistory',
            'composer.showComposerHistory',
            'workbench.action.chat.history'
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