const tinify = require('tinify');
const argv = require('optimist').argv;
const windowStateKeeper = require('electron-window-state');
const {app, BrowserWindow, ipcMain, Menu} = require('electron');

const APP_NAME = 'Free texture packer';

let mainWindow;
let RECENT_PROJECTS = [];
let CURRENT_LOCALE = "";
let LOCALE_STRINGS = {};
let APP_INFO = {};

function createWindow() {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1280,
        defaultHeight: 800
    });
    
    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        minWidth: 1280,
        minHeight: 800,
        title: APP_NAME,
        icon: './resources/icons/main.png'
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

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

function quit() {
    app.quit();
}

function buildMenu() {
    let template = [];
    
    let recentProjects = [];
    
    if(RECENT_PROJECTS.length) {
        for(let path of RECENT_PROJECTS) {
            let name = path.split("/").pop();
            recentProjects.push({label: name, click: openRecentProject, custom: path});
        }
    }
    else {
        recentProjects.push({label: "...", enabled: false});
    }
    
    template.push({
        label: LOCALE_STRINGS.MENU_FILE,
        submenu: [
            {label: LOCALE_STRINGS.MENU_FILE_PROJECT_NEW, click: newProject},
            {label: LOCALE_STRINGS.MENU_FILE_PROJECT_LOAD, click: loadProject},
            {label: LOCALE_STRINGS.MENU_FILE_PROJECT_LOAD_RECENT, id: "recentProjects", submenu: recentProjects},
            {type: 'separator'},
            {label: LOCALE_STRINGS.MENU_FILE_PROJECT_SAVE, click: saveProject},
            {label: LOCALE_STRINGS.MENU_FILE_PROJECT_SAVE_AS, click: saveProjectAs},
            {type: 'separator'},
            {label: LOCALE_STRINGS.MENU_FILE_PREFERENCES_SAVE, click: savePreferences},
            {type: 'separator'},
            {label: LOCALE_STRINGS.MENU_FILE_EXIT, click: quit}
        ]
    });
    
    let langs = [];
    if(APP_INFO.localizations) {
        for (let lang of APP_INFO.localizations) {
            langs.push({
                label: LOCALE_STRINGS['LANGUAGE_' + lang],
                click: changeLang,
                custom: lang,
                checked: CURRENT_LOCALE === lang,
                type: 'checkbox'
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
            {label: LOCALE_STRINGS.MENU_HELP_ABOUT, click: showAbout}
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

function newProject() {
    mainWindow.send('project-new');
}

function loadProject() {
    mainWindow.send('project-load');
}

function saveProject() {
    mainWindow.send('project-save');
}

function saveProjectAs() {
    
}

function openRecentProject(e) {
    mainWindow.send('project-load', {path: e.custom});
}

function savePreferences() {
    mainWindow.send('preferences-save');
}

function changeLang(e) {
    mainWindow.send('change-locale', {locale: e.custom});
}

function showAbout() {
    mainWindow.send('show-about');
}

function onProjectLoaded(data) {
    let name = data.path.split('/').pop();
    mainWindow.setTitle(name + ' - ' + APP_NAME);
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

ipcMain.on('update-locale', (e, data) => {
    console.log(data);
    
    APP_INFO = data.appInfo;
    CURRENT_LOCALE = data.currentLocale;
    LOCALE_STRINGS = data.strings;
    buildMenu();
});

ipcMain.on('project-loaded', (e, data) => {
    onProjectLoaded(data);
});

ipcMain.on('project-recent-update', (e, data) => {
    RECENT_PROJECTS = data.projects;
    buildMenu();
});