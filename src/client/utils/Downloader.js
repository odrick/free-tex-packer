class Downloader {
    
    static run(files) {

        let zip = new JSZip();

        for(let file of files) {
            zip.file(file.name, file.content, {base64: !!file.base64});
        }

        zip.generateAsync({type:"blob"}).then((content) => {
            saveAs(content, "textures.zip");
        });
    }
    
}

export default Downloader;