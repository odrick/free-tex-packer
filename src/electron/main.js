const argv = require('optimist').argv;
const {app, BrowserWindow} = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 1280, height: 800, minWidth: 1280, minHeight: 800});
  
  if(argv.env === 'development') {
	  mainWindow.loadURL('http://localhost:4000/');
  }
  else {
	  mainWindow.loadFile(url);
  }
  
  //mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});