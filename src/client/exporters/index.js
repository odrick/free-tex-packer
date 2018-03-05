import list from './list.json';
import appInfo from '../../../package.json';
import {GET} from '../utils/ajax';
import mustache from 'mustache';

function getExporterByType(type) {
    for(let item of list) {
        if(item.type == type) {
            return item;
        }
    }
    return null;
}

function prepareData(data, options) {

    let opt = Object.assign({}, options);

    opt.imageName = opt.imageName || "texture.png";
    opt.format = opt.format || "RGBA8888";
    opt.scale = opt.scale || 1;

    let ret = [];

    for(let item of data) {

        let name = item.name;

        if(options.trimSpriteNames) {
            name.trim();
        }

        if(options.removeFileExtension) {
            let parts = name.split(".");
            parts.pop();
            name = parts.join(".");
        }

        if(!options.prependFolderName) {
            name = name.split("/").pop();
        }

        let frame = {x: item.frame.x, y: item.frame.y, w: item.frame.w, h: item.frame.h};
        let spriteSourceSize = {x: item.spriteSourceSize.x, y: item.spriteSourceSize.y, w: item.spriteSourceSize.w, h: item.spriteSourceSize.h};
        let sourceSize = {w: item.sourceSize.w, h: item.sourceSize.h};

        ret.push({
            name: name,
            frame: frame,
            spriteSourceSize: spriteSourceSize,
            sourceSize: sourceSize,
            rotated: item.rotated,
            trimmed: item.trimmed
        });

    }

    if(ret.length) ret[ret.length-1].last = true;

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
        
        if(exporter.templateContent) {
            resolve(mustache.render(exporter.templateContent, renderOptions));
            return;
        }
        
        GET("static/exporters/" + exporter.template, null, (template) => {
            exporter.templateContent = template;
            resolve(mustache.render(exporter.templateContent, renderOptions));
        }, reject);
    });
}

export {getExporterByType, startExporter};
export default list;