import { app, BrowserWindow } from "electron";
import * as path from "path";
import { InitTray } from "./trayWindow";

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
        width: 800,
    });

    mainWindow.loadFile(path.join(__dirname, "index.html"));

    mainWindow.webContents.openDevTools();

    mainWindow.on("closed", () => {
        mainWindow = null;
    })
}

app.on("ready", () => {
    createWindow();
    InitTray();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
})