import Stats from "./Stats.js"
import {DAMAGE_TYPE, EQUIPMENT_DATA, SKILL_TAG, RUNE_DATA, STAT, TRIGGER} from "./Data.js";

export default class Hero {
    constructor({name, initialStats, growthStats, skinStats, bonusStats = {}, attackSpeedModel, skills = []}, update = true) {
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

        if (update) this.updateStats();
    }

    clone() {
        const clone = new Hero(this, false);
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
        // if (stat === "attackRange") {
        //     return this.baseStats[stat];
        // }
        // return this.baseStats[stat] + this.extraStats[stat];
        return this.totalStats[stat];
    }

    getExtraStat(stat) {
        return this.extraStats[stat];
    }

    // 装备物品
    addEquipment(equipment, update = true) {
        if (typeof equipment === 'string') {
            equipment = EQUIPMENT_DATA.find(item => item.name === equipment);
        }
        if (this.equipments.length < 6) {
            this.equipments.push(equipment);
        }
        if (update) this.updateStats();
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

    addRune(rune, number = 1, update = true) {
        if (typeof rune === 'string') {
            rune = RUNE_DATA.find(item => item.name === rune);
        }
        number = Math.min(number, 10 - this.getRunesCountByColor(rune.color));
        if (number > 0) {
            for (let i = 0; i < number; i++) {
                this.runes.push(rune);
            }
        }
        if (update) this.updateStats();
    }

    removeRune(rune, number = 1) {
        if (typeof rune === 'string') {
            rune = RUNE_DATA.find(item => item.name === rune);
        }
        for (let i = 0; i < this.runes.length && number > 0;) {
            if (this.runes[i] === rune) {
                this.runes.splice(i, 1);
                number--;
            } else {
                i++;
            }
        }
        this.updateStats();
    }

    getRunes() {
        let result = RUNE_DATA.map(rune => ({
            color: rune.color,
            name: rune.name,
            count: 0
        }));
        this.runes.forEach(rune => result.find(r => r.name === rune.name).count++);
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
        this.DPS = {average: 0};
        this.EHP = {average: 0};
        this.damageNAList = {[this.name]: []};
        this.damageCDList = {[this.name]: []};
        this.healList = {[this.name]: []};
        this.shieldList = {[this.name]: []};

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
                let exist = this.passiveList.findIndex(p => p.name === passive.name);
                if (exist === -1) {
                    this.passiveList.push(passive);
                } else if (passive.priority && passive.priority > this.passiveList[exist].priority) {
                    this.passiveList.splice(exist, 1, passive);
                }
            });
        });

        // 计算英雄技能加成
        this.totalStats = this.baseStats.clone().add(this.extraStats);
        this.skills.forEach(skill => {
            if (skill.trigger.includes(TRIGGER.auto)) {
                skill.effect(this, skill.rate);
            }
        });

        // 计算主动加成
        this.totalStats = this.baseStats.clone().add(this.extraStats);
        if (this.active) {
            this.active.effect(this, this.active.rate);
        }

        // 计算属性被动加成
        this.totalStats = this.baseStats.clone().add(this.extraStats);
        this.passiveList.forEach(passive => {
            if (passive.trigger.includes(TRIGGER.auto)) {
                passive.effect(this, passive.rate);
            }
        });

        this.totalStats = this.baseStats.clone().add(this.extraStats);
        this.totalStats.moveSpeed = this.totalStats.moveSpeedBase * (1 + this.totalStats.moveSpeedIncreased);

        this.enemiesDPS.forEach((enemy, i) => {
            this.DPS[i] = this.calculateDPS(enemy);
            this.DPS.average += enemy.bonusStats.rate * this.DPS[i];
        });
        this.enemiesEHP.forEach((enemy, i) => {
            this.EHP[i] = this.calculateEHP(enemy);
            this.EHP.average += enemy.bonusStats.rate * this.EHP[i];
        });
        this.CP = this.DPS.average * this.EHP.average / 5000;
    }

    calculateDPS(enemy) {
        let dps = 0;
        this.damageNAList[enemy.name] = [...this.damageNAList[this.name]];
        this.damageCDList[enemy.name] = [...this.damageCDList[this.name]];

        this.skills.filter(skill => skill.tags.includes(SKILL_TAG.damage)).forEach(skill => skill.effect(this, enemy, skill.rate));
        this.passiveList.filter(passive => passive.trigger.includes(TRIGGER.normal) || passive.trigger.includes(TRIGGER.skill)).forEach(passive => passive.effect(this, enemy, passive.rate));

        this.totalStats.attackTime = this.attackSpeedModel.calculateAttackTime(this.getStat(STAT.attackSpeed) * 100);
        let multiplier = {
            [DAMAGE_TYPE.physical]: this.damageMultiplier(enemy, DAMAGE_TYPE.physical),
            [DAMAGE_TYPE.magic]: this.damageMultiplier(enemy, DAMAGE_TYPE.magic),
        };
        this.damageNAList[enemy.name].forEach(damage => dps += damage.value * damage.rate * multiplier[damage.type] / this.totalStats.attackTime);
        this.damageCDList[enemy.name].forEach(damage => dps += damage.value * damage.rate * multiplier[damage.type] / damage.cooldown);
        dps *= 1 + this.getStat(STAT.damageIncreased);

        return dps;
    }

    calculateEHP(enemy) {
        let ehp = this.getStat("maxHP");
        this.healList[enemy.name] = [...this.healList[this.name]];
        this.shieldList[enemy.name] = [...this.shieldList[this.name]];

        let type = enemy.bonusStats.damageType;
        this.skills.filter(skill => skill.tags.includes(TRIGGER)).forEach(skill => skill.effect(enemy, this, skill.rate));
        this.passiveList.filter(passive => passive.trigger.includes(TRIGGER.defend)).forEach(passive => passive.effect(enemy, this, passive.rate));
        this.healList[enemy.name].forEach(heal => ehp += heal.value * heal.rate * (1 + this.getStat(STAT.healIncreased)));
        this.shieldList[enemy.name].filter(shield => shield.types.includes(type)).forEach(shield => ehp += shield.value * shield.rate);
        ehp /= enemy.damageMultiplier(this, type);
        ehp /= 1 - this.getStat(STAT.damageReduction);
        if (type === DAMAGE_TYPE.physical) ehp /= 1 - this.getStat(STAT.physicalDamageReduction);

        return ehp;
    }

    damageMultiplier(enemy, type) {
        if (type === DAMAGE_TYPE.physical) {
            return 600 / (600 + Math.max(0, enemy.getStat(STAT.physicalDefense) - this.getStat(STAT.physicalPenetration)) * (1 - this.getStat(STAT.physicalPenetrationPercent)));
        } else if (type === DAMAGE_TYPE.magic) {
            return 600 / (600 + Math.max(0, enemy.getStat(STAT.magicDefense) - this.getStat(STAT.magicPenetration)) * (1 - this.getStat(STAT.magicPenetrationPercent)));
        }
        return 1;
    }

    updateDelta(runeData, equipmentData) {
        runeData.forEach(rune => {
            let tempHero = this.clone();
            tempHero.addRune(rune);
            rune.delta = {
                CP: tempHero.CP - this.CP,
                DPS: tempHero.DPS.average - this.DPS.average,
                EHP: tempHero.EHP.average - this.EHP.average,
            };
        });
        equipmentData.forEach(equipment => {
            let tempHero = this.clone();
            tempHero.addEquipment(equipment);
            equipment.delta = {
                CP: tempHero.CP - this.CP,
                DPS: tempHero.DPS.average - this.DPS.average,
                EHP: tempHero.EHP.average - this.EHP.average,
            };
        });
    }

    getSaveData() {
        console.log("====== Save Hero ======");
        return {
            bonusStats: this.bonusStats,
            equipments:this.equipments.map(equipment => equipment.name),
            runes: this.getRunes().filter(rune => rune.count > 0).map(rune => ({
                name: rune.name,
                count: rune.count
            }))
        };
    }

    setSaveData(saveData) {
        console.log("====== Load Hero ======");
        console.log(saveData);

        this.bonusStats = saveData.bonusStats;
        this.equipments = [];
        saveData.equipments.forEach(equipment => this.addEquipment(equipment, false));
        this.runes = [];
        saveData.runes.forEach(rune => this.addRune(rune.name, rune.count, false));
        this.updateStats();
    }

}