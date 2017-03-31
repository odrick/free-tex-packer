import appInfo from '../../../package.json';

class Exporter {

    constructor() {
        this.appInfo = appInfo;
    }

    run(data) {

    }

    static get fileExt() {
        return "txt";
    }
}

export default Exporter;