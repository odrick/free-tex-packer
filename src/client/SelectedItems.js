import EventEmitter from 'eventemitter3';

class SelectedItemsPool extends EventEmitter {
    constructor() {
        super();

        this.pool = [];
    }

    exists(item) {
        return this.pool.indexOf(item) >= 0;
    }

    add(item) {
        if(this.exists(item)) return;
        this.pool.push(item);
        this.emitChanges();
    }

    remove(item) {
        let ix = this.pool.indexOf(item);
        if(ix >= 0) {
            this.pool.splice(ix, 1);
            this.emitChanges();
        }
    }

    clear() {
        this.pool = [];
        this.emitChanges();
    }

    clearAndAdd(item) {
        this.pool = [item];
        this.emitChanges();
    }

    emitChanges() {
        this.emit("changed", this.pool);
    }
}

const SelectedItems = new SelectedItemsPool();

export default SelectedItems;