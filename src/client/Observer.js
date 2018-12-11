import EventEmitter from 'eventemitter3';

let Observer = new EventEmitter();

let GLOBAL_EVENT = {
    IMAGES_LIST_CHANGED          : "IMAGES_LIST_CHANGED",
    IMAGES_LIST_SELECTED_CHANGED : "IMAGES_LIST_SELECTED_CHANGED",
    IMAGE_ITEM_SELECTED          : "IMAGE_ITEM_SELECTED",
    IMAGE_CLEAR_SELECTION        : "IMAGE_CLEAR_SELECTION",
    PACK_OPTIONS_CHANGED         : "PACK_OPTIONS_CHANGED",
    PACK_EXPORTER_CHANGED        : "PACK_EXPORTER_CHANGED",
    PACK_COMPLETE                : "PACK_COMPLETE",
    START_EXPORT                 : "START_EXPORT",
    SHOW_MESSAGE                 : "SHOW_MESSAGE",
    SHOW_SHADER                  : "SHOW_SHADER",
    HIDE_SHADER                  : "HIDE_SHADER",
    SHOW_ABOUT                   : "SHOW_ABOUT",
    HIDE_ABOUT                   : "HIDE_ABOUT",
    CHANGE_LANG                  : "CHANGE_LANG",
    SHOW_EDIT_CUSTOM_EXPORTER    : "SHOW_EDIT_CUSTOM_EXPORTER",
    HIDE_EDIT_CUSTOM_EXPORTER    : "HIDE_EDIT_CUSTOM_EXPORTER"
};

export {
    Observer,
    GLOBAL_EVENT
};