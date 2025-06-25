const vscode = require('vscode');

function activate(context) {
    console.log('Congratulations, your extension "lynx-keymap" is now active!');
    
    // Command for AI commit generation  [alt+1]
    let commitDisposable = vscode.commands.registerCommand('lynx-keymap.generateAICommit', async function () {
        const commitCommands = [
            'windsurf.generateCommitMessage',               // 0: Windsurf
            'github.copilot.git.generateCommitMessage',     // 1: Vscode
            'cursor.generateGitCommitMessage',              // 2: Cursor-AI
            'icube.gitGenerateCommitMessage',               // 3: Trae-AI
            // Don't have a Firebase equivalent for this    // 4: Firebase.Studio
        ];
        await executeFirstAvailableCommand(commitCommands, 'No AI commit generators available');
    });

    // Command for AI Popup  [ctrl+`] and equivalents - managed in package.json
    let popupDisposable = vscode.commands.registerCommand('lynx-keymap.executeAIPopup', async function () {
        const popupCommands = [
            'windsurf.prioritized.command.open',    // 0: Windsurf    
            'inlineChat.start',                     // 1: Vscode   
            'aipopup.action.modal.generate',        // 2: Cursor-AI  
            'icube.inlineChat.start',               // 3: Trae-AI
            'workbench.action.terminal.chat.start'  // 4: Firebase.Studio
        ];
        await executeFirstAvailableCommand(popupCommands, 'No AI chat providers available');
    });

    // Command to open AI chat  [ctrl+tab]
    let chatDisposable = vscode.commands.registerCommand('lynx-keymap.openAIChat', async function () {
        const chatCommands = [
            'windsurf.prioritized.chat.open',    // 0: Windsurf
            'workbench.panel.chat',              // 1: Vscode
            'aichat.newchataction',              // 2: Cursor-AI
            'workbench.action.chat.icube.open',  // 3: Trae-AI
            'aichat.prompt'                      // 4: Firebase.Studio
        ];
        await executeFirstAvailableCommand(chatCommands, 'No AI chat providers available');
    });

    // Command to create a new AI session  [alt+a] and equivalents - managed in package.json
    let newSessionDisposable = vscode.commands.registerCommand('lynx-keymap.createNewAISession', async function () {
        const newSessionCommands = [
            'windsurf.prioritized.chat.openNewConversation',          // 0: Windsurf
            'workbench.action.chat.newEditSession',                   // 1: Vscode
            'composer.createNew',                                     // 2: Cursor-AI
            'workbench.action.icube.aiChatSidebar.createNewSession',  // 3: Trae-AI
            //'workbench.action.chat.newChat'  NF-now                 // 4: Firebase.Studio
        ];
        await executeFirstAvailableCommand(newSessionCommands, 'No AI providers available to create a new session');
    });

    // Command to show AI history  [alt+s] and equivalents - managed in package.json
    let historyDisposable = vscode.commands.registerCommand('lynx-keymap.showAIHistory', async function () {
        const historyCommands = [
            'composer.showComposerHistory',                     // 2: Cursor-AI          
            // ---- ---- ---- ---- --- -- -                     // 0: Windsurf
            'workbench.action.chat.history' ,                   // 1: Vscode
            'workbench.action.icube.aiChatSidebar.showHistory', // 3: Trae-AI
            // Firebase doesn't have a history   NF-now         // 4: Firebase.Studio
        ];
        await executeFirstAvailableCommand(historyCommands, 'No AI history available');
    });

    // Command for AI attach context  [alt+d]
    let attachContextDisposable = vscode.commands.registerCommand('lynx-keymap.attachAIContext', async function () {
        const attachContextCommands = [
            //---- ---- ----- --- -- -                  // 0: Windsurf
            'composer.openAddContextMenu',              // 2: Cursor-AI
            'workbench.action.chat.attachContext',      // 1: Vscode
            //'---- ---- --- --- -- - ',                // 3: Trae-AI
            //'Workbench.action.openWorkspace' NF-now   // 4: Firebase.Studio
        ];
        await executeFirstAvailableCommand(attachContextCommands, 'No AI context attachment available');
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
        attachContextDisposable,
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