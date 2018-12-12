const tinify = require('tinify');
const argv = require('optimist').argv;
const {app, BrowserWindow, ipcMain} = require('electron');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 1280, height: 800, minWidth: 1280, minHeight: 800});

    if (argv.env === 'development') {
        mainWindow.loadURL('http://localhost:4000/');
    }
    else {
        mainWindow.loadFile(url);
    }

    //mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('tinify', (e, arg) => {
    tinify.key = arg.key;
    tinify.fromBuffer(Buffer.from(arg.imageData, 'base64')).toBuffer((err, res) => {
        if (err) {
            e.sender.send('tinify-complete', {
                success: false,
                uid: arg.uid,
                error: err.message
            });
            return;
        }
        
        e.sender.send('tinify-complete', {
            success: true,
            uid: arg.uid,
            data: res.toString('base64')
        });
    });
});