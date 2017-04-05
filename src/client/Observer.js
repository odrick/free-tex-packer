const EventEmitter = require('eventemitter3');

let Observer = new EventEmitter();

let GLOBAL_EVENT = {
    IMAGES_LIST_CHANGED: "IMAGES_LIST_CHANGED",
    IMAGE_ITEM_SELECTED: "IMAGE_ITEM_SELECTED"
};

export {
    Observer,
    GLOBAL_EVENT
};