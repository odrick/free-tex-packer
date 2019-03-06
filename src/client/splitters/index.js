import Grid from './Grid';
import JsonHash from './JsonHash';
import JsonArray from './JsonArray';
import UIKit from './UIKit';

const list = [
    Grid,
    JsonHash,
    JsonArray,
    UIKit
];

function getSplitterByType(type) {
    for(let item of list) {
        if(item.type === type) {
            return item;
        }
    }
    return null;
}

function getSplitterByData(data) {
    for(let item of list) {
        if(item.type !== Grid.type && item.check(data)) {
            return item;
        }
    }
    
    return getDefaultSplitter();
}

function getDefaultSplitter() {
    return Grid;
}

export { getSplitterByType, getSplitterByData, getDefaultSplitter };
export default list;