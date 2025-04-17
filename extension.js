const vscode = require('vscode');

function activate(context) {
    // Command for AI commit generation [ctrl+alt+1]
    let commitDisposable = vscode.commands.registerCommand('lynx-keymap.generateAICommit', async function () {
        const commitCommands = [
            'windsurf.generateCommitMessage',           // Prioridad 1: Windsurf
            'icube.gitGenerateCommitMessage',           // Prioridad 2: Trae-AI (asumiendo 'icube')
            'cursor.generateGitCommitMessage',          // Prioridad 3: Cursor-AI
            'github.copilot.git.generateCommitMessage'  // Prioridad 4: VS Code (Copilot)
        ];
        await executeFirstAvailableCommand(commitCommands, 'No AI commit generators available');
    });

    // Command for AI Popup [ctrl+`]
    let popupDisposable = vscode.commands.registerCommand('lynx-keymap.executeAIPopup', async function () {
        const popupCommands = [
            'windsurf.prioritized.command.open', // Prioridad 1: Windsurf
            'aipopup.action.modal.generate',     // Prioridad 2: Cursor-AI (asumiendo 'aipopup')
            'icube.inlineChat.start',            // Prioridad 3: Trae-AI (asumiendo 'icube')
            'inlineChat.start'                   // Prioridad 4: VS Code built-in / Otro
        ];
        await executeFirstAvailableCommand(popupCommands, 'No AI chat providers available');
    });

    // Command to open AI chat [ctrl+shift+tab]
    let chatDisposable = vscode.commands.registerCommand('lynx-keymap.openAIChat', async function () {
        const chatCommands = [
            'windsurf.prioritized.chat.open',     // Prioridad 1: Windsurf
            'workbench.action.chat.icube.open', // Prioridad 2: Trae-AI (asumiendo 'icube')
            'aichat.newchataction',             // Prioridad 3: Cursor-AI (asumiendo 'aichat')
            'workbench.panel.chat'              // Prioridad 4: VS Code built-in / Otro
        ];
        await executeFirstAvailableCommand(chatCommands, 'No AI chat providers available');
    });

    // Command to create a new AI session [ctrl+alt+`]
    let newSessionDisposable = vscode.commands.registerCommand('lynx-keymap.createNewAISession', async function () {
        // --- SOLUCIÓN: Añadir y priorizar el comando de nueva sesión de Windsurf ---
        const newSessionCommands = [
            'windsurf.prioritized.chat.openNewConversation', // <--- Prioridad 1: Windsurf
            'workbench.action.icube.chatSidebarNg.createNewSession', // Prioridad 2: Trae-AI (asumiendo 'icube')
            'composer.createNew',                                   // Prioridad 3: Cursor-AI (asumiendo 'composer')
            'workbench.action.chat.newEditSession',                 // Prioridad 4: VS Code built-in / Otro
        ];
        // -------------------------------------------------------------------------
        await executeFirstAvailableCommand(newSessionCommands, 'No AI providers available to create a new session');
    });

    // Command to show AI history [ctrl+shift+`]
    let historyDisposable = vscode.commands.registerCommand('lynx-keymap.showAIHistory', async function () {
        // Puedes añadir y priorizar comandos de Windsurf aquí si existen y son diferentes
        const historyCommands = [
            'workbench.action.icube.chatSidebarNg.showHistory', // Prioridad 1: Trae-AI (asumiendo 'icube')
            'composer.showComposerHistory',                     // Prioridad 2: Cursor-AI (asumiendo 'composer')
            'workbench.action.chat.history'                     // Prioridad 3: VS Code built-in / Otro
            // Considera si Windsurf tiene un comando de historial específico
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
    const allCommands = await vscode.commands.getCommands(true); // true para incluir comandos internos
    for (const cmd of commands) {
        // console.log(`Checking command: ${cmd}`); // Descomenta para depurar si es necesario
        if (allCommands.includes(cmd)) {
            try {
                // console.log(`Executing command: ${cmd}`); // Descomenta para depurar si es necesario
                await vscode.commands.executeCommand(cmd);
                return; // Ejecuta el primero que encuentra y sale
            } catch (error) {
                console.error(`Error executing command ${cmd}:`, error);
                // Considera mostrar un mensaje de error al usuario si la ejecución falla
                // vscode.window.showErrorMessage(`Failed to execute AI command: ${cmd}`);
                // Decide si continuar buscando el siguiente comando o detenerse
                // Por ahora, continuaremos al siguiente en caso de error al ejecutar
            }
        } else {
             // console.log(`Command not available: ${cmd}`); // Descomenta para depurar si es necesario
        }
    }
    // Si ningún comando de la lista estaba disponible o todos fallaron al ejecutarse
    vscode.window.showWarningMessage(errorMessage); // Usar showWarningMessage quizás sea mejor que showInformationMessage
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};