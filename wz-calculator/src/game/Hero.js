import Unit from "./Unit.js";
import {DAMAGE_TYPE, SKILL_TAG, STAT, TRIGGER} from "./constants.js";
import {HERO_DATA} from "./data/HeroData.js";
import {CONFIG} from "../config.js";

export default class Hero extends Unit {
    constructor(data, update = true) {
        super(data, false);

        this.attackSpeedModel = data.attackSpeedModel;
        this.skills = data.skills || [];
        this.exportFileName = data.exportFileName || null;

        this.enemiesDPS = [];
        this.enemiesEHP = [];

        if (update) this.updateStats();
    }

    clone() {
        const clone = new Hero(this, false);
        clone.stage = this.stage;
        clone.level = this.level;
        clone.equipments = [...this.equipments];
        clone.runes = [...this.runes];
        clone.enemiesDPS = this.enemiesDPS;
        clone.enemiesEHP = this.enemiesEHP;
        return clone;
    }

    setStage(stage) {
        this.stage = stage;
        [...this.enemiesDPS, ...this.enemiesEHP].forEach(enemy => enemy.setStage(stage));

        if (stage > 0) {
            const stageToLevel = [0, 6, 9, 12, 15, 15];
            this.setLevel(stageToLevel[stage]);
        }
    }

    setLevel(level) {
        this.level = Math.min(15, level);
        [...this.enemiesDPS, ...this.enemiesEHP].forEach(enemy => enemy.setLevel(this.level));
        this.updateStats();
    }

    setEnemy(enemiesDPS, enemiesEHP) {
        [...enemiesDPS, ...enemiesEHP].forEach(enemy => {
            enemy.bonusStats.equipments.forEach(equipment => enemy.addEquipment(equipment, false));
            enemy.bonusStats.runes.forEach(rune => enemy.addRune(rune[0], rune[1], false));
            enemy.updateStats();
        });
        this.enemiesDPS = enemiesDPS;
        this.enemiesEHP = enemiesEHP;
        this.updateStats();
    }

    // 重写 updateStats：基础 → 英雄技能 → 主动 → 被动 → 战斗计算
    updateStats() {
        // 1. 基础属性 + 装备 + 符文
        this._computeBaseAndEquipment();

        this.DPS = {average: 0};
        this.EHP = {average: 0};

        // 2. 计算英雄技能加成
        this.skills.forEach(skill => {
            if (skill.trigger.includes(TRIGGER.auto)) {
                skill.effect(this, skill.rate);
            }
        });
        this.mergeStats();

        // 3. 计算主动加成
        if (this.active) {
            this.active.effect(this, this.active.rate);
        }
        this.mergeStats();

        // 4. 计算属性被动加成
        this._applyPassives();

        // 5. 计算输出
        this.enemiesDPS.forEach((enemy, i) => {
            this.DPS[i] = this.calculateDPS(enemy);
            this.DPS.average += enemy.bonusStats.rate / this.DPS[i];
        });
        this.DPS.average = 1 / this.DPS.average;

        // 计算普攻吸血
        this.healList[this.name].push({
            source: "普攻吸血",
            value: this.totalStats.lifestealByNormalAttack * this.battleTime.normalAttack,
            cooldown: this.battleTime.normalAttack,
            rate: 1
        });

        // 6. 计算等效血量
        this.enemiesEHP.forEach((enemy, i) => {
            this.EHP[i] = this.calculateEHP(enemy);
            this.EHP.average += enemy.bonusStats.rate / this.EHP[i];
        });
        this.EHP.average = 1 / this.EHP.average;

        // 7. 计算综合战斗力
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

    updateDelta(runeData, equipmentData) {
        const computeDelta = (item, applyFn) => {
            const temp = this.clone();
            applyFn(temp, item);
            item.delta = {
                CP: temp.CP - this.CP,
                DPS: temp.DPS.average - this.DPS.average,
                EHP: temp.EHP.average - this.EHP.average,
            };
        };
        runeData.forEach(rune => computeDelta(rune, (h, r) => h.addRune(r)));
        equipmentData.forEach(eq => computeDelta(eq, (h, e) => h.addEquipment(e)));
    }

    getSaveData() {
        if (CONFIG.debug.logSaveLoad) console.log("====== Save Hero ======");
        return {
            stage: this.stage,
            level: this.level,
            bonusStats: this.bonusStats,
            equipments: this.equipments.map(equipment => equipment.name),
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
        if (CONFIG.debug.logSaveLoad) {
            console.log("====== Load Hero ======");
            console.log(saveData);
        }

        this.setLevel(saveData.level || 15);
        this.bonusStats = {...HERO_DATA.find(heroData => heroData.name === this.name).bonusStats, ...saveData.bonusStats};
        this.equipments = [];
        saveData.equipments.forEach(equipment => this.addEquipment(equipment, false));
        this.runes = [];
        saveData.runes.forEach(rune => this.addRune(rune.name, rune.count, false));
        Object.keys(saveData.enemyRate.dps).map(name => this.enemiesDPS.find(enemy => enemy.name === name).bonusStats.rate = saveData.enemyRate.dps[name]);
        Object.keys(saveData.enemyRate.ehp).map(name => this.enemiesEHP.find(enemy => enemy.name === name).bonusStats.rate = saveData.enemyRate.ehp[name]);
        this.battleTime = saveData.battleTime;
        this.setStage(saveData.stage || 5);

        this.updateStats();
    }
}
