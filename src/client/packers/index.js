import MaxRectsPacker from "./MaxRectsPacker";
import MaxRectsBin from "./MaxRectsBin";

const list = [
    MaxRectsBin,
    MaxRectsPacker
];

function getPackerByType(type) {
    for(let item of list) {
        if(item.type == type) {
            return item;
        }
    }
    return null;
}

export { getPackerByType };
export default list;