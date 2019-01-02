const path = require('path');
const tinify = require('tinify');
const argv = require('optimist').argv;
const windowStateKeeper = require('electron-window-state');
const {app, BrowserWindow, ipcMain, Menu, shell} = require('electron');
const {autoUpdater} = require("electron-updater");

let mainWindow;
let RECENT_PROJECTS = [];
let CURRENT_LOCALE = "";
let LOCALE_STRINGS = {};
let APP_INFO = {};
let CURRENT_PROJECT = "";
let CURRENT_PROJECT_M0DIFIED = false;

function createWindow() {
	let w = 1220;
	let h = 680;

	if(process.platform === "win32") {
		w = 1240;
		h = 720;
	}
	
	let mainWindowState = windowStateKeeper({
        defaultWidth: w,
        defaultHeight: h
    });
    
    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        minWidth: w,
        minHeight: h,
        title: "",
        icon: path.resolve(__dirname, 'www/static/images/icon.png')
    });

    mainWindowState.manage(mainWindow);

    mainWindow.on('page-title-updated', function(e) {
        e.preventDefault();
    });

    if (argv.env === 'development') {
        mainWindow.loadURL('http://localhost:4000/');
    }
    else {
        mainWindow.loadFile('./www/index.html');
    }

    Menu.setApplicationMenu(null);

    mainWindow.on('close', function(e) {
        if(CURRENT_PROJECT_M0DIFIED) {
            sendMessage({actionName: 'quit'});
            e.preventDefault();
        }
    });
    
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
	
	mainWindow.webContents.on('will-navigate', handleRedirect);
	mainWindow.webContents.on('new-window', handleRedirect);

    mainWindow.webContents.on('did-finish-load', function() {
        CURRENT_PROJECT = "";
        CURRENT_PROJECT_M0DIFIED = false;
        updateWindowTitle();
		
		if(argv.env !== 'development' && process.argv.length > 1) {
			sendMessage({actionName: 'project-load', custom: process.argv[1]});
		}

        autoUpdater.checkForUpdatesAndNotify();
    });

    onProjectUpdated();
}

function handleRedirect(e, url) {
	if(url !== mainWindow.getURL()) {
        e.preventDefault();
        shell.openExternal(url);
    }
}

function buildMenu() {
    let template = [];
    
    let recentProjects = [];
    
    if(RECENT_PROJECTS.length) {
        for(let path of RECENT_PROJECTS) {
            let name = path.split("/").pop();
            recentProjects.push({label: name, actionName: 'project-load', click: sendMessage, custom: path});
        }
    }
    else {
        recentProjects.push({label: "...", enabled: false});
    }

    let quitAcc = "CmdOrCtrl+F4";
    if(process.platform === "darwin") quitAcc = "CmdOrCtrl+Q";
    
    template.push({
        label: LOCALE_STRINGS.MENU_FILE,
        submenu: [
            {label: LOCALE_STRINGS.MENU_FILE_PROJECT_NEW, actionName: 'project-new', click: sendMessage, accelerator: 'CmdOrCtrl+N'},
            {label: LOCALE_STRINGS.MENU_FILE_PROJECT_LOAD, actionName: 'project-load', click: sendMessage, accelerator: 'CmdOrCtrl+O'},
            {label: LOCALE_STRINGS.MENU_FILE_PROJECT_LOAD_RECENT, submenu: recentProjects},
            {type: 'separator'},
            {label: LOCALE_STRINGS.MENU_FILE_PROJECT_SAVE, actionName: 'project-save', click: sendMessage, accelerator: 'CmdOrCtrl+S'},
            {label: LOCALE_STRINGS.MENU_FILE_PROJECT_SAVE_AS, actionName: 'project-save-as', click: sendMessage, accelerator: 'CmdOrCtrl+Shift+N'},
            {type: 'separator'},
            {label: LOCALE_STRINGS.MENU_FILE_PREFERENCES_SAVE, actionName: 'preferences-save', click: sendMessage},
            {type: 'separator'},
            {label: LOCALE_STRINGS.MENU_FILE_INSTALL_CLI, click: installCLI},
            {type: 'separator'},
            {label: LOCALE_STRINGS.MENU_FILE_EXIT, actionName: 'quit', click: sendMessage, accelerator: quitAcc}
        ]
    });

    template.push({
        label: LOCALE_STRINGS.MENU_ACTIONS,
        submenu: [
            {label: LOCALE_STRINGS.MENU_ACTIONS_ADD_IMAGES, actionName: 'action-add-images', click: sendMessage, accelerator: 'Shift+A'},
            {label: LOCALE_STRINGS.MENU_ACTIONS_ADD_FOLDER, actionName: 'action-add-folder', click: sendMessage, accelerator: 'Shift+F'},
            {type: 'separator'},
            {label: LOCALE_STRINGS.MENU_ACTIONS_SELECT_ALL, actionName: 'action-select-all', click: sendMessage, accelerator: 'CmdOrCtrl+A'},
            {label: LOCALE_STRINGS.MENU_ACTIONS_DELETE, actionName: 'action-delete', click: sendMessage, accelerator: 'Delete'},
            {label: LOCALE_STRINGS.MENU_ACTIONS_CLEAR, actionName: 'action-clear', click: sendMessage, accelerator: 'CmdOrCtrl+Shift+C'},
            {type: 'separator'},
            {label: LOCALE_STRINGS.MENU_ACTIONS_EXPORT, actionName: 'action-export', click: sendMessage, accelerator: 'CmdOrCtrl+E'}
        ]
    });
    
    let langs = [];
    if(APP_INFO.localizations) {
        for (let lang of APP_INFO.localizations) {
            langs.push({
                label: LOCALE_STRINGS['LANGUAGE_' + lang],
                custom: lang,
                checked: CURRENT_LOCALE === lang,
                type: 'checkbox',
                actionName: 'change-locale',
                click: sendMessage
            });
        }
    }

    template.push({
        label: LOCALE_STRINGS.MENU_LANGUAGE,
        submenu: langs
    });

    template.push({
        label: LOCALE_STRINGS.MENU_HELP,
        submenu: [
            {label: LOCALE_STRINGS.MENU_HELP_ABOUT, actionName: 'show-about', click: sendMessage, accelerator: 'F1'}
        ]
    });
    
    if(argv.env === 'development') {
        template.push({label: 'Dev', submenu: [
            {label: 'Console', click: () => mainWindow.webContents.openDevTools()},
            {label: 'Reload', click: () => mainWindow.webContents.reload()}
        ]});
    }
    
    let menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

function installCLI() {
    shell.openExternal('https://github.com/odrick/free-tex-packer-cli');
}

function quit() {
    CURRENT_PROJECT_M0DIFIED = false;
    app.quit();
}

function sendMessage(e) {
    let payload = null;
    if(e.custom) {
        payload = {data: e.custom};
    }
    
    mainWindow.send(e.actionName, payload);
}

function onProjectUpdated(data=null) {
    CURRENT_PROJECT = data ? data.path : "";
    CURRENT_PROJECT_M0DIFIED = false;
    updateWindowTitle();
}

function onProjectModified(data=null) {
    CURRENT_PROJECT_M0DIFIED = data ? data.val : false;
    updateWindowTitle();
}

function updateWindowTitle() {
    if(!APP_INFO.displayName) {
        mainWindow.setTitle("");
        return;
    }
    
    let name;

    if(!CURRENT_PROJECT) name = "untitled.ftpp";
    else name = CURRENT_PROJECT.split('/').pop();

    mainWindow.setTitle((CURRENT_PROJECT_M0DIFIED ? "* " : "") + name + ' - ' + APP_INFO.displayName);
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

ipcMain.on('tinify', (e, data) => {
    tinify.key = data.key;
    tinify.fromBuffer(Buffer.from(data.imageData, 'base64')).toBuffer((err, res) => {
        if (err) {
            e.sender.send('tinify-complete', {
                success: false,
                uid: data.uid,
                error: err.message
            });
            return;
        }
        
        e.sender.send('tinify-complete', {
            success: true,
            uid: data.uid,
            data: res.toString('base64')
        });
    });
});

ipcMain.on('update-app-info', (e, data) => {
    APP_INFO = data;
    buildMenu();
    updateWindowTitle();
});

ipcMain.on('update-locale', (e, data) => {
    CURRENT_LOCALE = data.currentLocale;
    LOCALE_STRINGS = data.strings;
    buildMenu();
});

ipcMain.on('project-recent-update', (e, data) => {
    RECENT_PROJECTS = data.projects;
    buildMenu();
});

ipcMain.on('project-update', (e, data) => {
    onProjectUpdated(data);
});

ipcMain.on('project-modified', (e, data) => {
    onProjectModified(data);
});

ipcMain.on('quit', (e, data) => {
    quit();
});