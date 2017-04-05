const EventEmitter = require('eventemitter3');

let Observer = new EventEmitter();

let GLOBAL_EVENT = {
    IMAGES_LIST_CHANGED: "IMAGES_LIST_CHANGED",
    IMAGE_ITEM_SELECTED: "IMAGE_ITEM_SELECTED",
    PACK_PROPS_CHANGED: "PACK_PROPS_CHANGED"
};

export {
    Observer,
    GLOBAL_EVENT
};