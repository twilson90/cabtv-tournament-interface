const path = require('path');
const electron = require('electron');

// electron.app.disableHardwareAcceleration()

var main_window = null;
var control_panel_window = null;

function send_client(data) {
    var webContents = null;
    try { webContents = main_window.webContents; } catch { }
    if (webContents) webContents.send(data);
}

function createWindows() {
    main_window = new electron.BrowserWindow({
        width: 1280,
        height: 720,
        title: 'CaBTV Game Stream',
        // frame: false, fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            devTools: true,
            nativeWindowOpen: true
        }
    });
    main_window.openDevTools();
    // window.setMenu(null);
    main_window.setMenuBarVisibility(false);
    main_window.loadFile('html/index.html');
    main_window.setMenu(
        electron.Menu.buildFromTemplate([
            /* {
                label: 'Menu',
                submenu: [
                    {
                        label:'Show Control Panel',
                        accelerator: 'CommandOrControl+Alt+P',
                        click: ()=>create_control_panel()
                    }
                ]
            }, */
            {
                label: 'View',
                submenu: [
                    {
                        label:'Reload', 
                        accelerator: 'CommandOrControl+R',
                        click: ()=>main_window.reload()
                    },
                    {
                        label:'Toggle Developer Tools',
                        accelerator: 'CommandOrControl+Shift+I',
                        click: ()=>main_window.webContents.toggleDevTools()
                    }
                ],
            }
        ])
    );
    main_window.on('closed', () => {
        electron.app.exit();
    });
    main_window.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
        if (frameName === 'Control Panel') {
            // open window as modal
            event.preventDefault()
            Object.assign(options, {
                nodeIntegration: true,
                enableRemoteModule: true,
                devTools: true,
                nativeWindowOpen: true
            });
            event.newGuest = control_panel_window = new electron.BrowserWindow(options)
            
            // control_panel_window.setMenu(null);
        }
    })
      
}

electron.app.whenReady().then(()=>{
    createWindows();
    electron.app.on('activate', ()=>{
        if (electron.BrowserWindow.getAllWindows().length === 0) createWindows();
    });
    electron.globalShortcut.register('CommandOrControl+Alt+P', () => {
        main_window.webContents.send("toggle_control_panel")
    });
})
electron.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron.app.quit();
    }
});

electron.app.on('will-quit', ()=>{
});