class Attribute {
    constructor(id, base = 0, multiply = 100, add = 0) {
        this.id = id;
        this._base = base;
        this._multiply = multiply;
        this._add = add;
        this.max = 0;
        this.observers = [];
        this.update();
    }
    addObserver(observer) {
        this.observers.push(observer);
    }
    removeObserver(observer) {
        this.observers = this.observers.filter(o => o !== observer);
    }
    notifyObserver() {
        this.observers.forEach(o => o(this.value));
    }
    update() {
        this.value = this._base * this._multiply/100 + this._add;
        if (this.max && this.value > this.max) {
            this.value = this.max;
        }
        this.notifyObserver();
    }
    get base() {
        return this._base;
    }
    set base(v) {
        this._base = v;
        this.update();
    }
    get multiply() {
        return this._multiply;
    }
    set multiply(v) {
        this._multiply = v;
        this.update();
    }
    get add() {
        return this._add;
    }
    set add(v) {
        this._add = v;
        this.update();
    }
}