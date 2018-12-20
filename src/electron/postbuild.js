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

deleteFolder("../../dist/${os}");
deleteFile("../../dist/builder-effective-config.yaml");

deleteFile("../../dist/win/FreeTexturePacker.exe.blockmap");
deleteFile("../../dist/win/latest.yml");
deleteFolder("../../dist/win/win-unpacked");
deleteFolder("../../dist/win/win-ia32-unpacked");

deleteFile("../../dist/linux/latest-linux.yml");
deleteFile("../../dist/linux/latest-linux-ia32.yml");
deleteFolder("../../dist/linux/linux-unpacked");
deleteFolder("../../dist/linux/linux-ia32-unpacked");