import Stats from "./Stats.js";
import {EQUIPMENT_DATA} from "./data/EquipmentData.js";
import {RUNE_DATA} from "./data/RuneData.js";
import {DAMAGE_TYPE, STAT, TRIGGER} from "./constants.js";

const PENETRATION_CONFIG = {
    [DAMAGE_TYPE.physical]: { def: STAT.physicalDefense, pen: STAT.physicalPenetration, penPct: STAT.physicalPenetrationPercent },
    [DAMAGE_TYPE.magic]: { def: STAT.magicDefense, pen: STAT.magicPenetration, penPct: STAT.magicPenetrationPercent },
};

export default class Unit {
    constructor({name, initialStats, growthStats, skinStats, bonusStats = {}, battleTime = {}}, update = true) {
        this.name = name;
        this.initialStats = new Stats(initialStats);
        this.growthStats = new Stats(growthStats);
        this.skinStats = new Stats(skinStats);
        this.bonusStats = bonusStats;
        this.battleTime = battleTime;

        this.stage = 5;
        this.level = 15;
        this.equipments = [];
        this.runes = [];

        if (update) this.updateStats();
    }

    clone() {
        const clone = new Unit(this, false);
        clone.stage = this.stage;
        clone.level = this.level;
        clone.equipments = [...this.equipments];
        clone.runes = [...this.runes];
        return clone;
    }

    setStage(stage) {
        this.stage = stage;
    }

    setLevel(level) {
        this.level = Math.min(15, level);
        this.updateStats();
    }

    getStat(stat) {
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
        return Array.from({length: 6}, (_, i) => ({
            key: `装备${i + 1}`,
            name: this.equipments[i]?.name ?? null,
            count: 1,
            price: this.equipments[i]?.price ?? null,
            index: i
        }));
    }

    getRunesCountByColor(color) {
        return this.runes.filter(r => r.color === color).length;
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
        if (typeof rune === 'string') rune = RUNE_DATA.find(item => item.name === rune);
        let removed = 0;
        this.runes = this.runes.filter(r => {
            if (r === rune && removed < number) { removed++; return false; }
            return true;
        });
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
                return moveSpeed;
            } else if (moveSpeed <= 575) {
                return 500 + (moveSpeed - 500) * 0.8;
            } else {
                return 500 + (575 - 500) * 0.8 + (moveSpeed - 575) * 0.5;
            }
        };

        this.totalStats = this.baseStats.clone().add(this.extraStats);
        this.totalStats.moveSpeed = calcMoveSpeed(this.totalStats.moveSpeedBase * (1 + this.totalStats.moveSpeedIncreased));
        this.totalStats.attackTime = this.attackSpeedModel?.calculateAttackTime(this.getStat(STAT.attackSpeed) * 100);
    }

    // 更新属性（基础属性 + 装备 + 符文 + 被动）
    updateStats() {
        this._computeBaseAndEquipment();
        this._applyPassives();
    }

    // 计算基础属性 + 装备 + 符文，收集被动列表
    _computeBaseAndEquipment() {
        this.baseStats = this.initialStats.clone();
        for (let i = 1; i < this.level; i++) {
            this.baseStats.add(this.growthStats);
        }

        this.extraStats = this.skinStats.clone().add(this.bonusStats);
        this.totalPrice = 0;
        this.active = null;
        this.passiveList = [];
        this.damageNAList = {[this.name]: []};
        this.damageCDList = {[this.name]: []};
        this.healList = {[this.name]: []};
        this.shieldList = {[this.name]: []};

        // 计算铭文加成
        this.runes.forEach(rune => {
            this.extraStats.add(rune.stats);
        });

        const stageToEquipmentLimit = [6, 2, 3, 4, 5, 6];
        // 计算装备加成
        this.equipments.slice(0, stageToEquipmentLimit[this.stage]).forEach(equipment => {
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
    }

    // 应用属性被动加成
    _applyPassives() {
        this.passiveList.forEach(passive => {
            if (passive.trigger.includes(TRIGGER.auto)) {
                passive.effect(this, passive.rate);
            }
        });
        this.mergeStats();
    }

    damageMultiplier(target, type) {
        const cfg = PENETRATION_CONFIG[type];
        if (!cfg) return 1;
        const effectiveDef = Math.max(0, target.getStat(cfg.def) - this.getStat(cfg.pen)) * (1 - this.getStat(cfg.penPct));
        return 600 / (600 + effectiveDef);
    }
}
