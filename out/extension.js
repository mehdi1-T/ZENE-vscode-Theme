"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
let blurStatusBarItem;
function updateBlurEffect() {
    const config = vscode.workspace.getConfiguration();
    const blurEnabled = config.get('Zene.sidebarBlurEnabled', false);
    const currentTheme = config.get('workbench.colorTheme');
    // Check for both exact match and partial match for better compatibility
    const isZeneTheme = currentTheme && (currentTheme === 'Zene Theme' ||
        currentTheme.includes('Zene Theme'));
    if (blurEnabled && isZeneTheme) {
        // Apply macOS-style blur effect to sidebar and file explorer
        const themeConfig = vscode.workspace.getConfiguration('workbench');
        const customizations = themeConfig.get('colorCustomizations', {});
        const blurCustomizations = {
            ...customizations,
            "[Zene Theme]": {
                ...(customizations["[Zene Theme]"] || {}),
                // Beautiful macOS-style blur for sidebar (file explorer + extensions)
                "sideBar.background": "#1E2030CC",
                "sideBar.foreground": "#CDD6F4",
                "sideBarTitle.foreground": "#CDD6F4",
                "sideBarSectionHeader.background": "#1E203099",
                "sideBarSectionHeader.foreground": "#CDD6F4",
                "sideBarSectionHeader.border": "#31324433",
                // File explorer blur effects
                "explorer.foreground": "#CDD6F4",
                "explorer.highlightForeground": "#89B4FA",
                "explorer.inactiveSelectionForeground": "#CDD6F4",
                "explorer.activeSelectionForeground": "#1E1E2E",
                "explorer.folderForeground": "#F9E2AF",
                "explorer.folderIconForeground": "#F9E2AF",
                "explorer.fileForeground": "#CDD6F4",
                "explorer.selectedBackground": "#89B4FA33",
                "explorer.activeSelectionBackground": "#89B4FA66",
                "explorer.inactiveSelectionBackground": "#31324433",
                // Extensions view specific blur effects
                "extensionButton.prominentBackground": "#89B4FA33",
                "extensionButton.prominentHoverBackground": "#89B4FA66",
                "extensionButton.background": "#31324433",
                "extensionButton.hoverBackground": "#31324466",
                "extensionBadge.remoteBackground": "#F9E2AF33",
                "extensionBadge.remoteForeground": "#F9E2AF",
                "extensionIcon.verifiedForeground": "#89B4FA",
                "extensionIcon.preReleaseForeground": "#F9E2AF",
                "extensionIcon.sponsorForeground": "#F38BA8",
                // Extension list and details blur
                "list.activeSelectionBackground": "#89B4FA33",
                "list.inactiveSelectionBackground": "#31324433",
                "list.hoverBackground": "#31324422",
                "list.focusBackground": "#89B4FA22",
                "list.activeSelectionForeground": "#CDD6F4",
                "list.inactiveSelectionForeground": "#CDD6F4",
                "list.focusForeground": "#F9E2AF",
                "list.highlightForeground": "#89B4FA",
                // Extension description and ratings
                "descriptionForeground": "#A6ADC8",
                "textLink.foreground": "#89B4FA",
                "textLink.activeForeground": "#74C7EC",
                "textBlockQuote.background": "#31324433",
                "textBlockQuote.border": "#31324466",
                // Search and filters in extensions
                "input.background": "#31324466",
                "input.foreground": "#CDD6F4",
                "input.border": "#31324433",
                "input.placeholderForeground": "#6C7086",
                "inputValidation.errorBackground": "#F38BA833",
                "inputValidation.errorBorder": "#F38BA866",
                "inputValidation.warningBackground": "#F9E2AF33",
                "inputValidation.warningBorder": "#F9E2AF66",
                // Tags and categories
                "badge.background": "#89B4FA33",
                "badge.foreground": "#CDD6F4",
                "progressBar.background": "#89B4FA",
                "widget.shadow": "#00000033",
                // Activity bar blur
                "activityBar.background": "#181825CC",
                "activityBar.foreground": "#CDD6F4",
                "activityBar.inactiveForeground": "#6C708699",
                "activityBarBadge.background": "#89B4FA",
                "activityBarBadge.foreground": "#1E1E2E",
                // Panel blur (terminal, output, etc.)
                "panel.background": "#1E2030CC",
                "panel.border": "#31324466",
                "panelTitle.activeBorder": "#89B4FA",
                "panelTitle.activeForeground": "#CDD6F4",
                "panelTitle.inactiveForeground": "#6C7086",
                // Scrollbar for sidebar
                "scrollbar.shadow": "#00000033",
                "scrollbarSlider.background": "#6C708633",
                "scrollbarSlider.hoverBackground": "#6C708666",
                "scrollbarSlider.activeBackground": "#89B4FA99"
            }
        };
        themeConfig.update('colorCustomizations', blurCustomizations, vscode.ConfigurationTarget.Global);
        if (blurStatusBarItem) {
            blurStatusBarItem.text = "$(eye) Sidebar Blur: ON";
            blurStatusBarItem.tooltip = "Zene Theme macOS-style sidebar blur is enabled";
            blurStatusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
            blurStatusBarItem.show();
        }
    }
    else {
        // Restore original colors
        const themeConfig = vscode.workspace.getConfiguration('workbench');
        const customizations = themeConfig.get('colorCustomizations', {});
        if (customizations["[Zene Theme]"]) {
            const updatedCustomizations = { ...customizations };
            // Remove only sidebar blur-related customizations (file explorer + extensions)
            if (updatedCustomizations["[Zene Theme]"]) {
                const themeColors = updatedCustomizations["[Zene Theme]"];
                delete themeColors["sideBar.background"];
                delete themeColors["sideBar.foreground"];
                delete themeColors["sideBarTitle.foreground"];
                delete themeColors["sideBarSectionHeader.background"];
                delete themeColors["sideBarSectionHeader.foreground"];
                delete themeColors["sideBarSectionHeader.border"];
                // File explorer properties
                delete themeColors["explorer.foreground"];
                delete themeColors["explorer.highlightForeground"];
                delete themeColors["explorer.inactiveSelectionForeground"];
                delete themeColors["explorer.activeSelectionForeground"];
                delete themeColors["explorer.folderForeground"];
                delete themeColors["explorer.folderIconForeground"];
                delete themeColors["explorer.fileForeground"];
                delete themeColors["explorer.selectedBackground"];
                delete themeColors["explorer.activeSelectionBackground"];
                delete themeColors["explorer.inactiveSelectionBackground"];
                // Extensions view properties
                delete themeColors["extensionButton.prominentBackground"];
                delete themeColors["extensionButton.prominentHoverBackground"];
                delete themeColors["extensionButton.background"];
                delete themeColors["extensionButton.hoverBackground"];
                delete themeColors["extensionBadge.remoteBackground"];
                delete themeColors["extensionBadge.remoteForeground"];
                delete themeColors["extensionIcon.verifiedForeground"];
                delete themeColors["extensionIcon.preReleaseForeground"];
                delete themeColors["extensionIcon.sponsorForeground"];
                delete themeColors["list.activeSelectionBackground"];
                delete themeColors["list.inactiveSelectionBackground"];
                delete themeColors["list.hoverBackground"];
                delete themeColors["list.focusBackground"];
                delete themeColors["list.activeSelectionForeground"];
                delete themeColors["list.inactiveSelectionForeground"];
                delete themeColors["list.focusForeground"];
                delete themeColors["list.highlightForeground"];
                delete themeColors["descriptionForeground"];
                delete themeColors["textLink.foreground"];
                delete themeColors["textLink.activeForeground"];
                delete themeColors["textBlockQuote.background"];
                delete themeColors["textBlockQuote.border"];
                delete themeColors["input.background"];
                delete themeColors["input.foreground"];
                delete themeColors["input.border"];
                delete themeColors["input.placeholderForeground"];
                delete themeColors["inputValidation.errorBackground"];
                delete themeColors["inputValidation.errorBorder"];
                delete themeColors["inputValidation.warningBackground"];
                delete themeColors["inputValidation.warningBorder"];
                delete themeColors["badge.background"];
                delete themeColors["badge.foreground"];
                delete themeColors["progressBar.background"];
                delete themeColors["widget.shadow"];
                // Activity bar properties
                delete themeColors["activityBar.background"];
                delete themeColors["activityBar.foreground"];
                delete themeColors["activityBar.inactiveForeground"];
                delete themeColors["activityBarBadge.background"];
                delete themeColors["activityBarBadge.foreground"];
                // Panel properties
                delete themeColors["panel.background"];
                delete themeColors["panel.border"];
                delete themeColors["panelTitle.activeBorder"];
                delete themeColors["panelTitle.activeForeground"];
                delete themeColors["panelTitle.inactiveForeground"];
                // Scrollbar properties
                delete themeColors["scrollbar.shadow"];
                delete themeColors["scrollbarSlider.background"];
                delete themeColors["scrollbarSlider.hoverBackground"];
                delete themeColors["scrollbarSlider.activeBackground"];
                // Remove the theme object if it's empty
                if (Object.keys(updatedCustomizations["[Zene Theme]"]).length === 0) {
                    delete updatedCustomizations["[Zene Theme]"];
                }
            }
            themeConfig.update('colorCustomizations', updatedCustomizations, vscode.ConfigurationTarget.Global);
        }
        if (blurStatusBarItem) {
            blurStatusBarItem.text = "$(eye-closed) Sidebar Blur: OFF";
            blurStatusBarItem.tooltip = "Zene Theme macOS-style sidebar blur is disabled";
            blurStatusBarItem.hide();
        }
    }
}
function toggleBlurEffect() {
    const config = vscode.workspace.getConfiguration();
    const currentBlurState = config.get('Zene.sidebarBlurEnabled', false);
    // Show notification for better user feedback
    const newState = !currentBlurState;
    config.update('Zene.sidebarBlurEnabled', newState, vscode.ConfigurationTarget.Global)
        .then(() => {
        const message = newState ?
            'Zene macOS-style sidebar blur enabled' :
            'Zene macOS-style sidebar blur disabled';
        vscode.window.showInformationMessage(message);
    });
    updateBlurEffect();
}
function activate(context) {
    console.log('Zene Theme extension is now active!');
    // Create status bar item for blur toggle
    blurStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    blurStatusBarItem.command = 'zene.toggleSidebarBlur';
    blurStatusBarItem.tooltip = 'Toggle Zene Theme macOS-Style Sidebar Blur';
    context.subscriptions.push(blurStatusBarItem);
    // Register toggle command
    const toggleCommand = vscode.commands.registerCommand('zene.toggleSidebarBlur', toggleBlurEffect);
    context.subscriptions.push(toggleCommand);
    // Initial update
    updateBlurEffect();
    // Listen for configuration changes
    const configChangeListener = vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('Zene.sidebarBlurEnabled') || e.affectsConfiguration('workbench.colorTheme')) {
            updateBlurEffect();
        }
    });
    context.subscriptions.push(configChangeListener);
}
function deactivate() {
    console.log('Zene Theme extension has been deactivated');
}
//# sourceMappingURL=extension.js.map