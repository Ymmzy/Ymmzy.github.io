class Character {
    constructor(id) {
        this.id = id;
        this.color = "#000000";
        this.print = true;
        this.attributes = {
            speed: new Attribute("speed", 1),
            energy: new Attribute("energy")
        };
        this.action = {
            value: 0,
            goal: 10000,
            request: 10000
        };
        this.skills = {
            A: new Skill(this, "A"),
            E: new Skill(this, "E"),
            Q: new Skill(this, "Q"),
        };
        this.buffs = [];
        this.btns = null;
        //observers
        this.attributes.speed.addObserver((value) => {
            let oldGoal = this.action.goal;
            this.action.goal = 10000 / value;
            this.action.value *= this.action.goal / oldGoal;
            this.action.request *= this.action.goal / oldGoal;
        });
        this.attributes.energy.addObserver((value) => {
            if (this.btns && this.btns['Q']) {
                if (value >= this.skills.Q.energyRequest) {
                    this.btns['Q'].disabled = false;
                }
                else this.btns['Q'].disabled = true;
            }
        });
        this.observers = {
            begin: [],
            end: []
        };
    }
    pass(action) {
        this.action.value += action;
        this.action.request -= action;
        return this;
    }
    useEnergy(energyRequest) {
        if (energyRequest <= 0) return true;
        if (this.attributes.energy.value < energyRequest) {
            console.warn("Energy is not enough: " + this.show());
            return false;
        }
        this.attributes.energy.base = 0;
        this.attributes.energy.add = 0;
        return true;
    }
    A(...args) {
        if (characters.point < 5) characters.point++;
        this.disableButtons();
        this.handleBuffs("middle");
        if (status) status.innerHTML = '<div class="show_skill"><b style="color:' + this.color + '">' + this.showSkill('A') + '</b></div>' + status.innerHTML;
        this.skills.A.cast(...args);
        return this;
    }
    E(...args) {
        characters.point--;
        this.disableButtons();
        this.handleBuffs("middle");
        if (status) status.innerHTML = '<div class="show_skill"><b style="color:' + this.color + '">' + this.showSkill('E') + '</b></div>' + status.innerHTML;
        this.skills.E.cast(...args);
        return this;
    }
    Q(...args) {
        if (status) status.innerHTML = '<div class="show_skill"><b style="color:' + this.color + '">' + this.showSkill('Q') + '</b></div>' + status.innerHTML;
        this.skills.Q.cast(...args);
        return this;
    }
    addObserver(stage, observer) {
        this.observers[stage].push(observer);
    }
    removeObserver(stage, observer) {
        this.observers[stage] = this.observers.filter(o => o !== observer);
    }
    notifyObserver(stage) {
        this.observers[stage].forEach(o => o(this));
    }
    turnBegin(characters) {
        this.notifyObserver("begin");
        this.handleBuffs("begin");
        this.enableButtons(characters.point);
        return this;
    }
    turnEnd(characters) {
        this.notifyObserver("end");
        this.handleBuffs("end");
        this.disableButtons();
        this.action.value = 0;
        this.action.request = this.action.goal;
        return this;
    }
    addBuff(buff) {
        let oldBuff = this.buffs.find(oldBuff => oldBuff.id == buff.id);
        if (oldBuff) {
            oldBuff.loseEffect(this);
            if (oldBuff.stackable) oldBuff.stack += buff.stack;
            oldBuff.stage = buff.stage;
            oldBuff.duration = Math.max(oldBuff.duration, buff.duration);
            oldBuff.takeEffect(this);
        } 
        else {
            this.buffs.push(buff);
            buff.takeEffect(this);
        }
        return this;
    }
    handleBuffs(stage) {
        if (stage == "middle") {
            this.buffs.filter(buff => buff.stage == stage).forEach(buff => buff.stage = "end");
        }
        else {
            for (let i = this.buffs.length - 1; i >= 0; i--) {
                if (!this.buffs[i].current && this.buffs[i].stage == stage) {
                    this.buffs[i].duration--;
                }
                if (!this.buffs[i].duration) {
                    this.buffs[i].loseEffect(this);
                    this.buffs.splice(i, 1);
                }
            }
        }
        return this;
    }
    show() {
        let str = "[" + this.id + "]";
        str += " speed=" + this.attributes.speed.value;
        str += " action=" + this.action.value.toFixed(0) + "/" + this.action.goal.toFixed(0);
        str += " energy=" + this.attributes.energy.value.toFixed(0);
        return str;
    }
    showSkill(type) {
        let str = "[" + this.id + "] " + type;
        if (this.buffs.length) {
            str += " ";
            this.buffs.forEach((buff) => {
                str += "(" + buff.id + "," + buff.duration + ")"
            });
        }
        return str;
    }
    addButtons(element) {
        let tr = document.createElement("tr");
        this.btns = {};
        for (let type in this.skills)  {
            let btn = document.createElement("button");
            btn.type = "button";
            btn.id = "btn_" + this.id + "_" + type;
            btn.disabled = true;
            btn.innerHTML = this.id + "_" + type;
            btn.addEventListener("click", () => {
                this[type]();
            });
            this.btns[type] = btn;
            let td = document.createElement("td");
            td.appendChild(btn);
            tr.appendChild(td);
        };
        element.appendChild(tr);
        return this;
    }
    enableButtons(point = 1) {
        if (this.btns) {
            this.btns['A'].disabled = false;
            if (point) this.btns['E'].disabled = false;
        }
        return this;
    }
    disableButtons() {
        if (this.btns) {
            this.btns['A'].disabled = true;
            this.btns['E'].disabled = true;
        }
        return this;
    }
}
const _Character = new Character();

const ShenJun = () => {
    let c = new Character("ShenJun");
    c.attributes.speed.base = 60;
    c.attributes.attackTimes = new Attribute("attackTimes", 3);
    c.attributes.attackTimes.max = 10;
    c.attributes.attackTimes.addObserver((value) => {
        c.attributes.speed.add = 10 * (value - 3);
    });
    c.skills.A.effect = () => {
        c.attributes.attackTimes.add = 0;
        characters.point--;
    };
    c.turnBegin = (characters) => {
        _Character.turnBegin.call(c, characters);
        c.A();
        return c;
    };
    c.show = () => {
        return _Character.show.call(c) + " attackTimes=" + c.attributes.attackTimes.value;
    };
    c.showSkill = (type) => {
        return _Character.showSkill.call(c, type) +  " attackTimes=" + c.attributes.attackTimes.value;
    };
    return c;
};
const JingYuan = () => {
    let c = new Character("JingYuan");
    c.attributes.speed.base = 99;
    c.attributes.energy.add = 65;
    c.skills.Q.energyRequest = 130;
    c.skills.E.effect = () => {
        c.ShenJun.attributes.attackTimes.add += 2;
    };
    c.skills.Q.effect = () => {
        c.ShenJun.attributes.attackTimes.add += 3;
    };
    return c;
};
const TingYun = () => {
    let c = new Character("TingYun");
    c.attributes.speed.base = 112;
    c.attributes.energy.add = 65;
    c.skills.Q.energyRequest = 130;
    c.skills.E.effect = (target = c.defaultTarget) => {
        let buff_2 = new Buff("TY_E_2", 1);
        buff_2.takeEffect = (character) => { character.attributes.speed.multiply += 20; };
        buff_2.loseEffect = (character) => { character.attributes.speed.multiply -= 20; };
        c.addBuff(buff_2);
        target.addBuff(new Buff("TY_E_1", 3));
    };
    c.skills.Q.effect = (target = c.defaultTarget) => {
        target.attributes.energy.add += 50;
        target.addBuff(new Buff("TY_Q", 2));
    };
    return c;
};