import * as vscode from 'vscode';

let blurStatusBarItem: vscode.StatusBarItem;

function updateActivityBarBlur() {
    const config = vscode.workspace.getConfiguration();
    const blurEnabled = config.get<boolean>('Zene.blurEnabled', true);
    const currentTheme = config.get<string>('workbench.colorTheme');
    
    // Check for both exact match and partial match for better compatibility
    const isZeneTheme = currentTheme && (
        currentTheme === 'Zene Theme' || 
        currentTheme.includes('Zene Theme')
    );
    
    if (blurEnabled && isZeneTheme) {
        // Update theme colors for comfortable blur effect
        const themeConfig = vscode.workspace.getConfiguration('workbench');
        const customizations = themeConfig.get<any>('colorCustomizations', {});
        
        // Use theme colors that match the actual Zene theme palette
        const blurCustomizations = {
            ...customizations,
            "[Zene Theme]": {
                ...(customizations["[Zene Theme]"] || {}),
                "menu.background": "#24273A15",
                "dropdown.background": "#24273A15"
            }
        };
        
        themeConfig.update('colorCustomizations', blurCustomizations, vscode.ConfigurationTarget.Global);
        
        if (blurStatusBarItem) {
            blurStatusBarItem.text = "$(eye) Zene Blur: ON";
            blurStatusBarItem.tooltip = "Zene Theme menu blur effect is enabled";
            blurStatusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
            blurStatusBarItem.show();
        }
    } else {
        // Restore original colors
        const themeConfig = vscode.workspace.getConfiguration('workbench');
        const customizations = themeConfig.get<any>('colorCustomizations', {});
        
        if (customizations["[Zene Theme]"]) {
            const updatedCustomizations = { ...customizations };
            // Only remove menu and dropdown blur, keep other customizations
            if (updatedCustomizations["[Zene Theme]"]) {
                delete updatedCustomizations["[Zene Theme]"]["menu.background"];
                delete updatedCustomizations["[Zene Theme]"]["dropdown.background"];
                
                // Remove the theme object if it's empty
                if (Object.keys(updatedCustomizations["[Zene Theme]"]).length === 0) {
                    delete updatedCustomizations["[Zene Theme]"];
                }
            }
            themeConfig.update('colorCustomizations', updatedCustomizations, vscode.ConfigurationTarget.Global);
        }
        
        if (blurStatusBarItem) {
            blurStatusBarItem.text = "$(eye-closed) Zene Blur: OFF";
            blurStatusBarItem.tooltip = "Zene Theme menu blur effect is disabled";
            blurStatusBarItem.hide();
        }
    }
}

function toggleBlurEffect() {
    const config = vscode.workspace.getConfiguration();
    const currentBlurState = config.get<boolean>('Zene.blurEnabled', true);
    
    // Show notification for better user feedback
    const newState = !currentBlurState;
    
    config.update('Zene.blurEnabled', newState, vscode.ConfigurationTarget.Global)
        .then(() => {
            const message = newState ? 
                'Zene menu blur effect enabled' : 
                'Zene menu blur effect disabled';
            vscode.window.showInformationMessage(message);
        });
    
    updateActivityBarBlur();
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Zene Theme extension is now active!');
    
    // Create status bar item for blur toggle
    blurStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    blurStatusBarItem.command = 'zene.toggleBlur';
    blurStatusBarItem.tooltip = 'Toggle Zene Theme Menu Blur Effect';
    context.subscriptions.push(blurStatusBarItem);
    
    // Register toggle command
    const toggleCommand = vscode.commands.registerCommand('zene.toggleBlur', toggleBlurEffect);
    context.subscriptions.push(toggleCommand);
    
    // Initial update
    updateActivityBarBlur();
    
    // Listen for configuration changes
    const configChangeListener = vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('Zene.blurEnabled') || e.affectsConfiguration('workbench.colorTheme')) {
            updateActivityBarBlur();
        }
    });
    
    context.subscriptions.push(configChangeListener);
}

export function deactivate() {
    console.log('Zene Theme extension has been deactivated');
}
