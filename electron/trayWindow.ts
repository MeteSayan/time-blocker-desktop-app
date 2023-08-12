import * as path from "path";

import { BrowserWindow, ipcMain, Tray, screen } from "electron";

let MainTray: Tray | undefined;
let TrayWindow: BrowserWindow | undefined;

const WINDOW_SIZE_DEFAULTS = {
    width: 256,
    height: 256,
    margin: {
        x: 0,
        y: 0,
    },
};

export function InitTray() {
    MainTray = new Tray(path.join(__dirname, "trayIcon.png"));
    createWindow();

    MainTray.on("click", function () {
        ipcMain.emit("tray-window-clicked", { window: TrayWindow, tray: MainTray });
        toggleTrayWindow();
    });

    alignWindow();
    ipcMain.emit("tray-window-ready", { window: TrayWindow, tray: MainTray });
}

function createWindow() {
    TrayWindow = new BrowserWindow({
        width: WINDOW_SIZE_DEFAULTS.width,
        height: WINDOW_SIZE_DEFAULTS.height,
        maxWidth: WINDOW_SIZE_DEFAULTS.width,
        maxHeight: WINDOW_SIZE_DEFAULTS.height,
        show: false, // Window will be show when clicked a tray icon
        frame: false, // Tray Windows are not framed usually
        fullscreenable: false,
        resizable: false,
        useContentSize: false,
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            backgroundThrottling: false,
        },
    });

    // Disabling Window menu
    TrayWindow.setMenu(null);
    TrayWindow.loadURL(`file:///${path.join(__dirname, "index.html")}#/tray`);

    TrayWindow.hide();
    TrayWindow.on("blur", () => {
        if (!TrayWindow) return;
        if (!TrayWindow.webContents.isDevToolsOpened()) {
            TrayWindow.hide();
            ipcMain.emit("tray-window-hidden", { window: TrayWindow, tray: MainTray });
        }
    });
    TrayWindow.on("close", function (event) {
        if (!TrayWindow) return;
        event.preventDefault();
        TrayWindow.hide();
    });
}

function toggleTrayWindow() {
    if (!TrayWindow) return;
    if (TrayWindow.isVisible()) {
        TrayWindow.hide();
    } else {
        TrayWindow.show();
    }

    ipcMain.emit("tray-window-hidden", { window: TrayWindow, tray: MainTray });
}

function alignWindow() {
    if (!TrayWindow) return;

    const position = calculateWindowPosition();
    if (!position) return;

    TrayWindow.setBounds({
        width: WINDOW_SIZE_DEFAULTS.width,
        height: WINDOW_SIZE_DEFAULTS.height,
        x: position.x,
        y: position.y,
    });
}

function calculateWindowPosition() {
    if (!MainTray) return;
    const screenBounds = screen.getPrimaryDisplay().size;
    const trayBounds = MainTray.getBounds();

    //where is the icon on the screen?
    let trayPos = 4; // 1:top-left 2:top-right 3:bottom-left 4.bottom-right
    trayPos = trayBounds.y > screenBounds.height / 2 ? trayPos : trayPos / 2;
    trayPos = trayBounds.x > screenBounds.width / 2 ? trayPos : trayPos - 1;
    let x = 0;
    let y = 0;

    //calculate the new window position
    switch (trayPos) {
        case 1: // for TOP - LEFT
            x = Math.floor(trayBounds.x + WINDOW_SIZE_DEFAULTS.margin.x + trayBounds.width / 2);
            y = Math.floor(trayBounds.y + WINDOW_SIZE_DEFAULTS.margin.y + trayBounds.height / 2);
            break;

        case 2: // for TOP - RIGHT
            x = Math.floor(
                trayBounds.x -
                WINDOW_SIZE_DEFAULTS.width -
                WINDOW_SIZE_DEFAULTS.margin.x +
                trayBounds.width / 2,
            );
            y = Math.floor(trayBounds.y + WINDOW_SIZE_DEFAULTS.margin.y + trayBounds.height / 2);
            break;

        case 3: // for BOTTOM - LEFT
            x = Math.floor(trayBounds.x + WINDOW_SIZE_DEFAULTS.margin.x + trayBounds.width / 2);
            y = Math.floor(
                trayBounds.y -
                WINDOW_SIZE_DEFAULTS.height -
                WINDOW_SIZE_DEFAULTS.margin.y +
                trayBounds.height / 2,
            );
            break;

        case 4: // for BOTTOM - RIGHT
            x = Math.floor(
                trayBounds.x -
                WINDOW_SIZE_DEFAULTS.width -
                WINDOW_SIZE_DEFAULTS.margin.x +
                trayBounds.width / 2,
            );
            y = Math.floor(
                trayBounds.y -
                WINDOW_SIZE_DEFAULTS.height -
                WINDOW_SIZE_DEFAULTS.margin.y +
                trayBounds.height / 2,
            );
            break;
    }

    return { x: x, y: y };
}