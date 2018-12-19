let fs = require("fs");

function deleteFile(path) {
    try {fs.unlinkSync(path)}
    catch(e) {}
}

function deleteFolder(path) {
    try {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file) {
                let curPath = path + "/" + file;

                if (fs.lstatSync(curPath).isDirectory()) {
                    deleteFolder(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });

            fs.rmdirSync(path);
        }
    }
    catch(e) {}
}

deleteFile("../../dist/builder-effective-config.yaml");
deleteFile("../../dist/win/FreeTexturePacker.exe.blockmap");
deleteFolder("../../dist/${os}");
deleteFolder("../../dist/win/win-unpacked");