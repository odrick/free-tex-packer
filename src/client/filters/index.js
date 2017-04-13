import Filter from './Filter';
import Mask from './Mask';
import Grayscale from './Grayscale';

const list = [
    Filter,
    Mask,
    Grayscale
];

function getFilterByType(type) {
    for(let item of list) {
        if(item.type == type) {
            return item;
        }
    }
    return null;
}

export { getFilterByType };
export default list;