"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = require("vscode");
const THEME_MIGRATION_MAP = {
    'Monochromator Dark+': 'Monochromator Dark',
    'Monochromator Dark+ Amber': 'Monochromator Dark Amber',
    'Monochromator Dark+ Amethyst': 'Monochromator Dark Amethyst',
    'Monochromator Dark+ Aquamarine': 'Monochromator Dark Aquamarine',
    'Monochromator Dark+ Emerald': 'Monochromator Dark Emerald',
    'Monochromator Dark+ Plain': 'Monochromator Dark Plain',
    'Monochromator Dark+ Ruby': 'Monochromator Dark Ruby',
    'Monochromator Dark+ Sulfur': 'Monochromator Dark Sulfur'
};
let blurStatusBarItem;
function updateActivityBarBlur() {
    const config = vscode.workspace.getConfiguration();
    const blurEnabled = config.get('comfort.blurEnabled', true);
    const currentTheme = config.get('workbench.colorTheme');
    if (blurEnabled && currentTheme && currentTheme.includes('Comfort')) {
        // Update theme colors for comfortable blur effect
        const themeConfig = vscode.workspace.getConfiguration('workbench');
        const customizations = themeConfig.get('colorCustomizations', {});
        const blurCustomizations = {
            ...customizations,
            "[Comfort Code]": {
                ...(customizations["[Comfort Code]"] || {}),
                "activityBar.background": "#2c313c80",
                "sideBar.background": "#2c313c80",
                "titleBar.activeBackground": "#2c313c80",
                "titleBar.inactiveBackground": "#2c313c80",
                "tab.activeBackground": "#2c313c80",
                "panel.background": "#2c313c80",
                "statusBar.background": "#2c313c80",
                "editorWidget.background": "#2c313c80",
                "editorSuggestWidget.background": "#2c313c80",
                "editorHoverWidget.background": "#2c313c80",
                "notifications.background": "#2c313c80",
                "menu.background": "#2c313c80",
                "dropdown.background": "#2c313c80"
            }
        };
        themeConfig.update('colorCustomizations', blurCustomizations, vscode.ConfigurationTarget.Global);
        if (blurStatusBarItem) {
            blurStatusBarItem.text = "$(eye) Comfort Blur: ON";
            blurStatusBarItem.tooltip = "Comfortable blur effect is enabled";
            blurStatusBarItem.show();
        }
    }
    else {
        // Restore original colors
        const themeConfig = vscode.workspace.getConfiguration('workbench');
        const customizations = themeConfig.get('colorCustomizations', {});
        if (customizations["[Comfort Code]"]) {
            const updatedCustomizations = { ...customizations };
            delete updatedCustomizations["[Comfort Code]"];
            themeConfig.update('colorCustomizations', updatedCustomizations, vscode.ConfigurationTarget.Global);
        }
        if (blurStatusBarItem) {
            blurStatusBarItem.text = "$(eye-closed) Comfort Blur: OFF";
            blurStatusBarItem.tooltip = "Comfortable blur effect is disabled";
            blurStatusBarItem.hide();
        }
    }
}
function toggleBlurEffect() {
    const config = vscode.workspace.getConfiguration();
    const currentBlurState = config.get('comfort.blurEnabled', true);
    config.update('comfort.blurEnabled', !currentBlurState, vscode.ConfigurationTarget.Global);
    updateActivityBarBlur();
}
function migrateTheme() {
    const config = vscode.workspace.getConfiguration();
    let migrated = false;
    // Migrate workbench.colorTheme
    const currentTheme = config.get('workbench.colorTheme');
    if (currentTheme && THEME_MIGRATION_MAP[currentTheme]) {
        const newTheme = THEME_MIGRATION_MAP[currentTheme];
        config.update('workbench.colorTheme', newTheme, vscode.ConfigurationTarget.Global);
        migrated = true;
    }
    // Migrate workbench.preferredDarkColorTheme
    const preferredDark = config.get('workbench.preferredDarkColorTheme');
    if (preferredDark && THEME_MIGRATION_MAP[preferredDark]) {
        const newTheme = THEME_MIGRATION_MAP[preferredDark];
        config.update('workbench.preferredDarkColorTheme', newTheme, vscode.ConfigurationTarget.Global);
        migrated = true;
    }
    if (migrated) {
        vscode.window.showInformationMessage('Monochromator: Dark+ theme migrated to Dark');
    }
}
function activate(context) {
    migrateTheme();
    // Create status bar item for blur toggle
    blurStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    blurStatusBarItem.command = 'comfort.toggleBlur';
    context.subscriptions.push(blurStatusBarItem);
    // Register toggle command
    const toggleCommand = vscode.commands.registerCommand('comfort.toggleBlur', toggleBlurEffect);
    context.subscriptions.push(toggleCommand);
    // Initial update
    updateActivityBarBlur();
    // Listen for configuration changes
    const configChangeListener = vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('comfort.blurEnabled') || e.affectsConfiguration('workbench.colorTheme')) {
            updateActivityBarBlur();
        }
    });
    context.subscriptions.push(configChangeListener);
}
//# sourceMappingURL=extension.js.map