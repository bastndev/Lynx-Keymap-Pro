const vscode = require('vscode');

exports.BACKTICK_EQUIVALENTS = [
    '`',
    'º',
    "'",
    '²',
    '^',
    'ё',
    '~',
    '半角/全角',
];

exports.registerMultiKeyboardCommand = function(
    context,
    commandId, 
    handler, 
    baseKey, 
    modifiers
) {
    const disposable = vscode.commands.registerCommand(commandId, handler);
    context.subscriptions.push(disposable);
};

exports.generateKeybindingsForPackageJson = function(
    commandId,
    baseKey,
    modifiers
) {
    if (baseKey !== '`') return [];
    
    return exports.BACKTICK_EQUIVALENTS.map(key => ({
        key: `${modifiers.windows}${key}`,
        mac: `${modifiers.mac}${key}`,
        command: commandId
    }));
};
