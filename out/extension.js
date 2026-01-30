"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
let fontStatusBarItem;
function updateFontSettings() {
    const config = vscode.workspace.getConfiguration();
    const fontEnabled = config.get('Zene.fontEnabled', true);
    const currentTheme = config.get('workbench.colorTheme');
    // Check for both exact match and partial match for better compatibility
    const isZeneTheme = currentTheme && (currentTheme === 'Zene Theme' ||
        currentTheme.includes('Zene Theme'));
    if (fontEnabled && isZeneTheme) {
        // Update font settings for optimal Zene Theme experience
        const fontConfig = vscode.workspace.getConfiguration('editor');
        const currentFontFamily = fontConfig.get('fontFamily', '');
        const currentFontSize = fontConfig.get('fontSize', 14);
        const currentLineHeight = fontConfig.get('lineHeight', 1.6);
        // Apply Zene Theme recommended font settings
        const zeneFontSettings = {
            "editor.fontFamily": "JetBrains Mono, Consolas, 'Courier New', monospace",
            "editor.fontSize": 14,
            "editor.lineHeight": 1.6,
            "editor.fontWeight": "400",
            "editor.letterSpacing": 0.5,
            "editor.fontLigatures": true
        };
        // Update settings
        Object.entries(zeneFontSettings).forEach(([key, value]) => {
            fontConfig.update(key, value, vscode.ConfigurationTarget.Global);
        });
        if (fontStatusBarItem) {
            fontStatusBarItem.text = "$(text-size) Zene Font: ON";
            fontStatusBarItem.tooltip = "Zene Theme font settings are enabled";
            fontStatusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
            fontStatusBarItem.show();
        }
    }
    else {
        if (fontStatusBarItem) {
            fontStatusBarItem.text = "$(text-size) Zene Font: OFF";
            fontStatusBarItem.tooltip = "Zene Theme font settings are disabled";
            fontStatusBarItem.hide();
        }
    }
}
function toggleFontEffect() {
    const config = vscode.workspace.getConfiguration();
    const currentFontState = config.get('Zene.fontEnabled', true);
    // Show notification for better user feedback
    const newState = !currentFontState;
    config.update('Zene.fontEnabled', newState, vscode.ConfigurationTarget.Global)
        .then(() => {
        const message = newState ?
            'Zene font settings enabled' :
            'Zene font settings disabled';
        vscode.window.showInformationMessage(message);
    });
    updateFontSettings();
}
function activate(context) {
    console.log('Zene Theme extension is now active!');
    // Create status bar item for font toggle
    fontStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    fontStatusBarItem.command = 'zene.toggleFont';
    fontStatusBarItem.tooltip = 'Toggle Zene Theme Font Settings';
    context.subscriptions.push(fontStatusBarItem);
    // Register toggle command
    const toggleCommand = vscode.commands.registerCommand('zene.toggleFont', toggleFontEffect);
    context.subscriptions.push(toggleCommand);
    // Initial update
    updateFontSettings();
    // Listen for configuration changes
    const configChangeListener = vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('Zene.fontEnabled') || e.affectsConfiguration('workbench.colorTheme')) {
            updateFontSettings();
        }
    });
    context.subscriptions.push(configChangeListener);
}
function deactivate() {
    console.log('Zene Theme extension has been deactivated');
}
//# sourceMappingURL=extension.js.map