const vscode = require('vscode');

function activate(context) {
    // Command for AI commit generation
    let commitDisposable = vscode.commands.registerCommand('lynx-keymap.generateAICommit', async function () {
        const commitCommands = [
            'icube.gitGenerateCommitMessage', //Trae-AI
            'cursor.generateGitCommitMessage', //Cursor-AI
            'github.copilot.git.generateCommitMessage' //Vscode 
        ];

        await executeFirstAvailableCommand(commitCommands, 'No AI commit generators available');
    });

    // Command for AI Popup
    let popupDisposable = vscode.commands.registerCommand('lynx-keymap.executeAIPopup', async function () {
        const popupCommands = [
            'aipopup.action.modal.generate',
            'icube.inlineChat.start',
            'inlineChat.start'
        ];

        await executeFirstAvailableCommand(popupCommands, 'No AI chat providers available');
    });

    // Command to open AI chat
    let chatDisposable = vscode.commands.registerCommand('lynx-keymap.openAIChat', async function () {
        const chatCommands = [
            'workbench.action.chat.icube.open',
            '!aichat.newchataction',
            'workbench.panel.chat'
        ];

        await executeFirstAvailableCommand(chatCommands, 'No AI chat providers available');
    });

    // Command to create a new AI session
    let newSessionDisposable = vscode.commands.registerCommand('lynx-keymap.createNewAISession', async function () {
        const newSessionCommands = [
            'workbench.action.icube.chatSidebarNg.createNewSession',
            'composer.createNew',
            'workbench.action.chat.newEditSession'
        ];

        await executeFirstAvailableCommand(newSessionCommands, 'No AI providers available');
    });

    // Command to show AI history
    let historyDisposable = vscode.commands.registerCommand('lynx-keymap.showAIHistory', async function () {
        const historyCommands = [
            'workbench.action.icube.chatSidebarNg.showHistory',
            'composer.showComposerHistory',
            'workbench.action.chat.history'
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
    for (const cmd of commands) {
        try {
            const allCommands = await vscode.commands.getCommands();
            if (allCommands.includes(cmd)) {
                await vscode.commands.executeCommand(cmd);
                return;
            }
        } catch (error) {
            console.log(`Error executing ${cmd}: ${error.message}`);
        }
    }
    vscode.window.showInformationMessage(errorMessage);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};
