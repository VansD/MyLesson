import { BrowserWindow, Menu, MenuItem, dialog } from 'electron';
import fs from "fs";

function clickUploadMenu(menuItem: MenuItem, browserWindow: BrowserWindow) {
    dialog.showOpenDialog({ properties: ['openFile'], filters: [
        { name: "Lessons", extensions: ['json'] },
      ] }).then(({ filePaths }) => {
        fs.readFile(filePaths[0], "utf8", (err, data) => {
            if (!err) {
              browserWindow.webContents.send('open-file', JSON.parse(data))
            }
        })
      }).catch(err => {
        console.log(err)
      });
}

function clickResetMenu(menuItem: MenuItem, browserWindow: BrowserWindow) {
  browserWindow.webContents.send('reset-file', [])
}

const template: Electron.MenuItemConstructorOptions[] = [
    {
        label: 'Файл',
        submenu: [
            { click: clickUploadMenu, label: "Загрузить файл..." },
            { click: clickResetMenu, label: "Сбросить файл" },
        ]
    }
];

export const createMenu = () => {
    let menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}