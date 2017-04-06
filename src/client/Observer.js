const EventEmitter = require('eventemitter3');

let Observer = new EventEmitter();

let GLOBAL_EVENT = {
    IMAGES_LIST_CHANGED   : "IMAGES_LIST_CHANGED",
    IMAGE_ITEM_SELECTED   : "IMAGE_ITEM_SELECTED",
    PACK_OPTIONS_CHANGED  : "PACK_OPTIONS_CHANGED",
    PACK_EXPORTER_CHANGED : "PACK_EXPORTER_CHANGED",
    PACK_COMPLETE         : "PACK_COMPLETE",
    START_EXPORT          : "START_EXPORT"
};

export {
    Observer,
    GLOBAL_EVENT
};