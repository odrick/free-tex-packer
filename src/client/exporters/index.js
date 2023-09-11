import list from './list.json';
import appInfo from '../../../package.json';
import {GET} from '../utils/ajax';
import mustache from 'mustache';
import wax from '@jvitela/mustache-wax';

wax(mustache);

mustache.Formatters = {
    add: (v1, v2) => {
        return v1 + v2;
    },
    subtract: (v1, v2) => {
        return v1 - v2;
    },
    multiply: (v1, v2) => {
        return v1 * v2;
    },
    divide: (v1, v2) => {
        return v1 / v2;
    },
    offsetLeft: (start, size1, size2) => {
        let x1 = start + size1 / 2;
        let x2 = size2 / 2;
        return x1 - x2;
    },
    offsetRight: (start, size1, size2) => {
        let x1 = start + size1 / 2;
        let x2 = size2 / 2;
        return x2 - x1;
    },
    mirror: (start, size1, size2) => {
        return size2 - start - size1;
    },
    escapeName: (name) => {
        return name.replace(/%/g, "%25")
            .replace(/#/g, "%23")
            .replace(/:/g, "%3A")
            .replace(/;/g, "%3B")
            .replace(/\\/g, "-")
            .replace(/\//g, "-");
    }
};

function getExporterByType(type) {
    for(let item of list) {
        if(item.type === type) {
            return item;
        }
    }
    return null;
}

function prepareData(data, options) {

    let opt = Object.assign({}, options);

    opt.imageName = opt.imageName || "texture";
    opt.imageFile = opt.imageFile || (opt.imageName + "." + options.textureFormat);
    opt.format = opt.format || "RGBA8888";
    opt.scale = opt.scale || 1;
    opt.base64Prefix = options.textureFormat === "png" ? "data:image/png;base64," : "data:image/jpeg;base64,";

    let ret = [];

    for(let item of data) {

        let name = item.originalFile || item.file;

        if(options.trimSpriteNames) {
            name.trim();
        }

        if(options.removeFileExtension) {
            let parts = name.split(".");
            if(parts.length > 1) parts.pop();
            name = parts.join(".");
        }

        if(!options.prependFolderName) {
            name = name.split("/").pop();
        }

        let frame = {x: item.frame.x, y: item.frame.y, w: item.frame.w, h: item.frame.h, hw: item.frame.w/2, hh: item.frame.h/2};
        let spriteSourceSize = {x: item.spriteSourceSize.x, y: item.spriteSourceSize.y, w: item.spriteSourceSize.w, h: item.spriteSourceSize.h};
        let sourceSize = {w: item.sourceSize.w, h: item.sourceSize.h};

        //Used when importing to Godot Atlas to retain the original sprite size
        let margin = {x: (sourceSize.w - spriteSourceSize.w)/2, y: (sourceSize.h - spriteSourceSize.h)/2, h: sourceSize.h - spriteSourceSize.h, w: sourceSize.w - spriteSourceSize.w}
        
        let trimmed = item.trimmed;
        
        if(item.trimmed && options.trimMode === 'crop') {
            trimmed = false;
            spriteSourceSize.x = 0;
            spriteSourceSize.y = 0;
            sourceSize.w = spriteSourceSize.w;
            sourceSize.h = spriteSourceSize.h;
        }
        
        if(opt.scale !== 1) {
            frame.x *= opt.scale;
            frame.y *= opt.scale;
            frame.w *= opt.scale;
            frame.h *= opt.scale;
            frame.hw *= opt.scale;
            frame.hh *= opt.scale;
            margin.x *= opt.scale;
            margin.y *= opt.scale;
            margin.w *= opt.scale;
            margin.h *= opt.scale;

            spriteSourceSize.x *= opt.scale;
            spriteSourceSize.y *= opt.scale;
            spriteSourceSize.w *= opt.scale;
            spriteSourceSize.h *= opt.scale;

            sourceSize.w *= opt.scale;
            sourceSize.h *= opt.scale;
        }

        ret.push({
            name: name,
            frame: frame,
            spriteSourceSize: spriteSourceSize,
            sourceSize: sourceSize,
            margin: margin,
            rotated: item.rotated,
            trimmed: trimmed
        });

    }

    if(ret.length) {
        ret[0].first = true;
        ret[ret.length-1].last = true;
    }

    return {rects: ret, config: opt};
}

function startExporter(exporter, data, options) {
    return new Promise((resolve, reject) => {
        let {rects, config} = prepareData(data, options);
        let renderOptions = {
            rects: rects,
            config: config,
            appInfo: appInfo
        };
        
        if(exporter.content) {
            finishExporter(exporter, renderOptions, resolve, reject);
            return;
        }
        
        GET("static/exporters/" + exporter.template, null, (template) => {
            exporter.content = template;
            finishExporter(exporter, renderOptions, resolve, reject);
        }, () => reject(exporter.template + " not found"));
    });
}

function finishExporter(exporter, renderOptions, resolve, reject) {
    try {
        let ret = mustache.render(exporter.content, renderOptions);
        resolve(ret);
    }
    catch(e) {
        reject(e.message);
    }
}

export {getExporterByType, startExporter};
export default list;