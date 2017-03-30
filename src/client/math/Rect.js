class Rect {
    constructor(x=0, y=0, width=0, height=0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    clone() {
        return new Rect(this.x, this.y, this.width, this.height);
    }

    hitTest(other) {
        return Rect.hitTest(this, other);
    }

    static hitTest(a, b) {
        return a.x >= b.x && a.y >= b.y && a.x+a.width <= b.x+b.width && a.y+a.height <= b.y+b.height;
    }
}

//Rect.isContainedIn 