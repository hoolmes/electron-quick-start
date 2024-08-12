// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('node:path')
const express = require('express');
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');

const server = express();
const port = 3332;
// Serve static files from the dist directory
server.use(express.static(path.join(__dirname, 'dist')));

server.use('/api', createProxyMiddleware({
    target: 'http://fenbao.icqgm.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '',
    },
}));

server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const httpServer = http.createServer(server);
httpServer.listen(port, () => {
    console.log(`HTTP server running at http://localhost:${port}`);
});

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    // mainWindow.loadFile('./dist/index.html')
    mainWindow.loadURL(`http://localhost:${port}`);
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
