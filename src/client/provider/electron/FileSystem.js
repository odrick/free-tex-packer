const {dialog} = require('electron').remote;

class FileSystem {
    static openFiles() {
        let res = dialog.showOpenDialog({properties: ['openFile', 'multiSelections']});
        console.log(res);
    }
}

export default FileSystem;