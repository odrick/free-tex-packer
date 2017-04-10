import JsonHash from './JsonHash';
import JsonArray from './JsonArray';
import XML from './XML';
import Css from './Css';
import OldCss from './OldCss';
import Pixi from './Pixi';
import PhaserHash from './PhaserHash';
import PhaserArray from './PhaserArray';
import Cocos2d from './Cocos2d';

const list = [
    JsonHash,
    JsonArray,
    XML,
    Css,
    OldCss,
    Pixi,
    PhaserHash,
    PhaserArray,
    Cocos2d
];

function getExporterByType(type) {
    for(let item of list) {
        if(item.type == type) {
            return item;
        }
    }
    return null;
}

export { getExporterByType };
export default list;