import Stats from "./Stats.js"
import {DAMAGE_TYPE, EQUIPMENT_DATA, SKILL_TAG, RUNE_DATA, STAT, TRIGGER, HERO_DATA} from "./Data.js";

export default class Hero {
    constructor({name, initialStats, growthStats, skinStats, bonusStats = {}, battleTime = {}, attackSpeedModel, skills = [], exportFileName = null}, update = true) {
        this.name = name;
        this.initialStats = new Stats(initialStats);
        this.growthStats = new Stats(growthStats);
        this.skinStats = new Stats(skinStats);
        this.bonusStats = bonusStats;
        this.battleTime = battleTime;
        this.attackSpeedModel = attackSpeedModel;
        this.skills = skills;
        this.exportFileName = exportFileName;

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
        this.level = Math.min(15, level);
        [...this.enemiesDPS, ...this.enemiesEHP].forEach(enemy => enemy.setLevel(this.level));
        this.updateStats();
    }

    setEnemy(enemiesDPS, enemiesEHP) {
        [...enemiesDPS,...enemiesEHP].forEach(enemy => {
            enemy.bonusStats.equipments.forEach(equipment => enemy.addEquipment(equipment, false));
            enemy.bonusStats.runes.forEach(rune => enemy.addRune(rune[0], rune[1], false));
            enemy.updateStats();
        });
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

    mergeStats() {
        const calcMoveSpeed = (moveSpeed) => {
            if (moveSpeed <= 500) {
                // 500及以下的部分不缩放
                return  moveSpeed;
            } else if (moveSpeed <= 575) {
                // 500-575之间的部分缩放0.8
                return  500 + (moveSpeed - 500) * 0.8;
            } else {
                // 500-575部分缩放0.8，575以上部分缩放0.5
                return  500 + (575 - 500) * 0.8 + (moveSpeed - 575) * 0.5;
            }
        }

        this.totalStats = this.baseStats.clone().add(this.extraStats);
        this.totalStats.moveSpeed = calcMoveSpeed(this.totalStats.moveSpeedBase * (1 + this.totalStats.moveSpeedIncreased));
        this.totalStats.attackTime = this.attackSpeedModel?.calculateAttackTime(this.getStat(STAT.attackSpeed) * 100);
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
        this.mergeStats();

        // 计算英雄技能加成
        this.skills.forEach(skill => {
            if (skill.trigger.includes(TRIGGER.auto)) {
                skill.effect(this, skill.rate);
            }
        });
        this.mergeStats();

        // 计算主动加成
        if (this.active) {
            this.active.effect(this, this.active.rate);
        }
        this.mergeStats();

        // 计算属性被动加成
        this.passiveList.forEach(passive => {
            if (passive.trigger.includes(TRIGGER.auto)) {
                passive.effect(this, passive.rate);
            }
        });
        this.mergeStats();

        // 计算输出
        this.enemiesDPS.forEach((enemy, i) => {
            this.DPS[i] = this.calculateDPS(enemy);
            this.DPS.average += enemy.bonusStats.rate * this.DPS[i];
        });

        // 计算普攻吸血
        this.healList[this.name].push({
            source: "普攻吸血",
            value: this.totalStats.lifestealByNormalAttack * this.battleTime.normalAttack,
            cooldown: this.battleTime.normalAttack,
            rate: 1
        });

        // 计算等效血量
        this.enemiesEHP.forEach((enemy, i) => {
            this.EHP[i] = this.calculateEHP(enemy);
            this.EHP.average += enemy.bonusStats.rate * this.EHP[i];
        });

        //计算综合战斗力
        this.CP = this.DPS.average * this.EHP.average / 5000;
    }

    calculateDPS(enemy) {
        let dps = 0;
        this.damageNAList[enemy.name] = [...this.damageNAList[this.name]];
        this.damageCDList[enemy.name] = [...this.damageCDList[this.name]];

        this.skills.filter(skill => skill.tags.includes(SKILL_TAG.damage)).forEach(skill => skill.effect(this, enemy, skill.rate));
        this.passiveList.filter(passive => passive.trigger.includes(TRIGGER.normalAttack) || passive.trigger.includes(TRIGGER.skill)).forEach(passive => passive.effect(this, enemy, passive.rate));

        let multiplier = {
            [DAMAGE_TYPE.physical]: this.damageMultiplier(enemy, DAMAGE_TYPE.physical),
            [DAMAGE_TYPE.magic]: this.damageMultiplier(enemy, DAMAGE_TYPE.magic),
        };
        this.damageNAList[enemy.name].forEach(damage => {
            let damagePerSecond = damage.value * damage.rate * multiplier[damage.type] / this.totalStats.attackTime;
            dps += damagePerSecond;
            if (damage.source === "普通攻击") {
                this.totalStats.lifestealByNormalAttack ??= 0;
                this.totalStats.lifestealByNormalAttack += damagePerSecond * (
                    damage.type === DAMAGE_TYPE.physical
                        ? this.getStat(STAT.physicalLifesteal)
                        : this.getStat(STAT.magicLifesteal)
                ) * enemy.bonusStats.rate;
            }
        });
        this.damageCDList[enemy.name].forEach(damage => dps += damage.value * damage.rate * multiplier[damage.type] / damage.cooldown);
        dps *= 1 + this.getStat(STAT.damageIncreased);
        dps *= 1 + this.getStat(STAT.cooldownReduction) * this.bonusStats.cooldownReductionToDPS;

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
        ehp *= 1 + (this.totalStats.moveSpeed - 450) / 450 * this.bonusStats.moveSpeedToEHP;

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
            level: this.level,
            bonusStats: this.bonusStats,
            equipments:this.equipments.map(equipment => equipment.name),
            runes: this.getRunes().filter(rune => rune.count > 0).map(rune => ({
                name: rune.name,
                count: rune.count
            })),
            enemyRate: {
                dps: Object.fromEntries(this.enemiesDPS.map(enemy => [enemy.name, enemy.bonusStats.rate])),
                ehp: Object.fromEntries(this.enemiesEHP.map(enemy => [enemy.name, enemy.bonusStats.rate])),
            },
            battleTime: this.battleTime
        };
    }

    setSaveData(saveData) {
        console.log("====== Load Hero ======");
        console.log(saveData);

        this.setLevel(saveData.level || 15);
        this.bonusStats = {...HERO_DATA.find(heroData => heroData.name === this.name).bonusStats, ...saveData.bonusStats};
        this.equipments = [];
        saveData.equipments.forEach(equipment => this.addEquipment(equipment, false));
        this.runes = [];
        saveData.runes.forEach(rune => this.addRune(rune.name, rune.count, false));
        Object.keys(saveData.enemyRate.dps).map(name => this.enemiesDPS.find(enemy => enemy.name === name).bonusStats.rate = saveData.enemyRate.dps[name]);
        Object.keys(saveData.enemyRate.ehp).map(name => this.enemiesEHP.find(enemy => enemy.name === name).bonusStats.rate = saveData.enemyRate.ehp[name]);
        this.battleTime = saveData.battleTime;
        this.updateStats();
    }

}