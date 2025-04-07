import Stats from "./Stats.js"
import Equipment from "./Equipment.js";
import Rune from "./Rune.js";

export default class Hero {
    constructor({name, initialStats, growthStats, skinStats, bonusStats = {}, attackSpeedModel, skills = []}, clone = false) {
        this.name = name;
        this.initialStats = new Stats(initialStats);
        this.growthStats = new Stats(growthStats);
        this.skinStats = new Stats(skinStats);
        this.bonusStats = bonusStats;
        this.attackSpeedModel = attackSpeedModel;
        this.skills = skills;

        this.level = 15;
        this.equipments = [];
        this.runes = [];
        this.enemiesDPS = [];
        this.enemiesEHP = [];

        if (!clone) this.updateStats();
    }

    clone() {
        const clone = new Hero(this, true);
        clone.level = this.level;
        clone.equipments = [...this.equipments];
        clone.runes = [...this.runes];
        clone.enemiesDPS = this.enemiesDPS;
        clone.enemiesEHP = this.enemiesEHP;
        return clone;
    }

    setLevel(level) {
        this.level = Math.max(15, level);
        this.enemiesDPS.forEach(enemy => enemy.setLevel(this.level));
        this.enemiesEHP.forEach(enemy => enemy.setLevel(this.level));
        this.updateStats();
    }

    setEnemy(enemiesDPS, enemiesEHP) {
        this.enemiesDPS = enemiesDPS;
        this.enemiesEHP = enemiesEHP;
        this.updateStats();
    }

    getStat(stat) {
        if (stat === "attackRange") {
            return this.baseStats[stat];
        }
        return this.baseStats[stat] + this.extraStats[stat];
    }

    // 装备物品
    addEquipment(equipment) {
        if (typeof equipment === 'string') {
            equipment = new Equipment(equipment);
        }
        if (this.equipments.length < 6) {
            this.equipments.push(equipment);
            this.updateStats();
        }
    }

    // 卸下装备
    removeEquipment(equipmentIndex) {
        if (equipmentIndex >= 0 && equipmentIndex < this.equipments.length) {
            this.equipments.splice(equipmentIndex, 1);
            this.updateStats();
        }
    }

    getEquipments() {
        return [0, 1, 2, 3, 4, 5].map(i => ({
                key: "装备" + (i + 1),
                name: this.equipments[i] ? this.equipments[i].name : null,
                count: 1,
                price: this.equipments[i] ? this.equipments[i].price : null,
                index: i
            })
        );
    }

    getRunesCountByColor(color) {
        let count = 0;
        this.runes.forEach(rune => {
            if (rune.color === color)
                count++;
        });
        return count;
    }

    addRune(rune, number = 1) {
        if (typeof rune === 'string') {
            rune = new Rune(rune);
        }
        number = Math.min(number, 10 - this.getRunesCountByColor(rune.color));
        if (number > 0) {
            for (let i = 0; i < number; i++) {
                this.runes.push(rune);
            }
            this.updateStats();
        }
    }

    removeRune(rune, number = 1) {
        for (let i = this.runes.length - 1; i >= 0 && number > 0; i--) {
            if (this.runes[i] === rune) {
                this.runes.splice(i, 1);
                number--;
                i--;
            }
        }
        this.updateStats();
    }

    getRunes() {
        let result = [];
        ["red", "blue", "green"].forEach(color => {
            this.runes.forEach(rune => {
                if (rune.color === color) {
                    let r = result.find(r => r.name === rune.name);
                    if (r)
                        r.count++;
                    else
                        result.push({
                            key: "铭文",
                            name: rune.name,
                            count: 1,
                            color: rune.color
                        });
                }
            })
        });
        return result;
    }

    // 更新属性
    updateStats() {
        this.baseStats = this.initialStats.clone();
        for (let i = 1; i < this.level; i++) {
            this.baseStats.add(this.growthStats);
        }

        this.extraStats = this.skinStats.clone().add(this.bonusStats);
        this.totalPrice = 0;
        this.active = null;
        this.passiveList = [];
        // 计算铭文加成
        this.runes.forEach(rune => {
            this.extraStats.add(rune.stats);
        });
        // 计算装备加成
        this.equipments.forEach(equipment => {
            this.extraStats.add(equipment.stats);
            this.totalPrice += equipment.price;
            if (!this.active) this.active = equipment.active;
            equipment.passiveList.forEach(passive => {
                for (let i = this.passiveList - 1; i >= 0; i--) {
                    if (passive.name === this.passiveList[i].name && passive.priority > this.passiveList[i].priority) {
                        this.passiveList.splice(i, 1, passive);
                        return;
                    }
                }
                this.passiveList.push(passive);
            });
        });
        // 计算英雄技能加成
        this.skills.forEach(skill => {
            if (skill.tags.includes("stats")) {
                skill.effect(this, skill.rate);
            }
        });
        // 计算主动加成
        if (this.active) {
            this.active.effect(this, this.active.rate);
        }
        // 计算属性被动加成
        this.passiveList.forEach(passive => {
            if (passive.trigger.includes("stats")) {
                passive.effect(this, passive.rate);
            }
        });

        this.totalStats = this.baseStats.clone().add(this.extraStats);
        this.DPS = [];
        this.EHP = [];
        this.damageNAList = [];
        this.damageCDList = [];
        this.healList = [];
        this.shieldList = [];
        this.enemiesDPS.forEach((enemy, i) => {
            this.DPS[i] = this.calculateDPS(enemy);
        });
        this.enemiesEHP.forEach((enemy, i) => {
            this.EHP[i] = this.calculateEHP(enemy);
        });
    }

    calculateDPS(enemy) {
        let dps = 0;
        this.damageNAList[enemy] = [];
        this.damageCDList[enemy] = [];

        this.skills.forEach(skill => {
            if (skill.tags.includes("attack")) {
                skill.effect(this, enemy, skill.rate);
            }
        });
        this.passiveList.forEach(passive => {
            if (passive.trigger.includes("normal") || passive.trigger.includes("skill")) {
                passive.effect(this, enemy, passive.rate);
            }
        });

        this.totalStats.attackTime = this.attackSpeedModel.calculateAttackTime(this.getStat("attackSpeed"));
        enemy.physicalMultiplier = 600 / (600 + (enemy.getStat("physicalDefense")-this.getStat("physicalPenetration")) * (1 - this.getStat("physicalPenetrationPercent")));
        enemy.magicMultiplier = 600 / (600 + (enemy.getStat("magicDefense")-this.getStat("magicPenetration")) * (1 - this.getStat("magicPenetrationPercent")));
        this.damageNAList[enemy].forEach(damage => {
            dps += damage.value * damage.rate * enemy[damage.type + "Multiplier"] / this.totalStats.attackTime;
        });
        this.damageCDList[enemy].forEach(damage => {
            dps += damage.value * damage.rate * enemy[damage.type + "Multiplier"] / damage.cooldown;
        });

        return dps;
    }

    calculateEHP(enemy) {
        let ehp = 100;
        this.healList[enemy] = [];
        this.shieldList[enemy] = [];

        return ehp;
    }

}

function getEnemy(name) {

}