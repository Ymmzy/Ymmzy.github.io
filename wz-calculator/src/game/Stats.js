import {STAT} from "./Data.js";

export default class Stats {
    constructor(stats = {}) {
        const finalStats = {
            // 基础属性
            [STAT.maxHP]: 0,
            [STAT.maxMP]: 0,
            [STAT.moveSpeed]: 0,

            // 物理相关
            [STAT.physicalAttack]: 0,
            [STAT.physicalDefense]: 0,
            [STAT.physicalPenetration]: 0,
            [STAT.physicalPenetrationPercent]: 0,
            [STAT.physicalLifesteal]: 0,

            // 法术相关
            [STAT.magicAttack]: 0,
            [STAT.magicDefense]: 0,
            [STAT.magicPenetration]: 0,
            [STAT.magicPenetrationPercent]: 0,
            [STAT.magicLifesteal]: 0,

            // 战斗属性
            [STAT.attackRange]: '近程',
            [STAT.criticalRate]: 0,
            [STAT.criticalDamage]: 0,
            [STAT.attackSpeed]: 0,

            // 恢复属性
            [STAT.hpRegen]: 0,
            [STAT.mpRegen]: 0,

            // 特殊属性
            [STAT.cooldownReduction]: 0,
            [STAT.tenacity]: 0,
            [STAT.precision]: 0,
            [STAT.damageIncreased]: 0,
            [STAT.damageReduction]: 0,

            // 用传入的 stats 覆盖默认值
            ...stats,
        }

        Object.assign(this, finalStats);
    }

    // 克隆当前状态
    clone() {
        return new Stats(this);
    }

    // 添加另一个 Stats 对象的值
    add(otherStats) {
        Object.keys(this).forEach(key => {
            if (key in otherStats) {
                if (key === STAT.cooldownReduction) {
                    // 冷却缩减上限为40%
                    this[key] = Math.min(this[key] + otherStats[key], 0.4);
                } else if (key === STAT.attackSpeed) {
                    // 暴击伤害上限为235%
                    this[key] = Math.min(this[key] + otherStats[key], 2);
                } else if (key === STAT.criticalDamage) {
                    // 暴击伤害上限为235%
                    this[key] = Math.min(this[key] + otherStats[key], 2.35);
                } else if (key === STAT.physicalPenetrationPercent || key === STAT.magicPenetrationPercent) {
                    // 穿透百分比上限为100%
                    this[key] = Math.min(this[key] + otherStats[key], 1);
                } else if (key === STAT.tenacity) {
                    // 韧性上限为100%
                    this[key] = Math.min(this[key] + otherStats[key], 1);
                } else if (key === STAT.attackRange) {
                    // 攻击范围保持不变，取第一个非空值
                    if (!this[key]) {
                        this[key] = otherStats[key];
                    }
                } else {
                    this[key] += otherStats[key];
                }
            }
        });
        return this;
    }
}