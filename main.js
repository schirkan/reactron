const { app, BrowserWindow } = require('electron');
const express = require('express');
const isDev = process.env.NODE_ENV !== 'production';
const port = isDev ? 5000 : 3000;
const server = express();

server.use('/modules', express.static(__dirname + '/modules'));
server.use('/node_modules', express.static(__dirname + '/node_modules'));
server.use('/', express.static(__dirname + '/build'));
server.listen(port, () => {
    console.log('NODE_ENV = ' + process.env.NODE_ENV);
    console.log('Server listening on Port ' + port);
});

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.setFullScreen(true);
    mainWindow.loadURL(`http://localhost:3000`);
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on('closed', function() {
        mainWindow = null;
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});