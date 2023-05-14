class Buff {
    constructor(id, duration, stage = "middle", stackable = false, stack = 1) {
        this.id = id;
        this.duration = duration;
        this.stage = stage;
        this.stackable = stackable;
        this.stack = stack;
    }
    takeEffect(character) {
        console.log(this.id + " take");
    }
    loseEffect(character) {
        console.log(this.id + " lose");
    }
}