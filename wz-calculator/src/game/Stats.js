import {STAT} from "./Data.js";

export default class Stats {
    constructor(stats = {}) {
        const finalStats = {
            ...Object.fromEntries(
                Object.values(STAT).filter(stat => typeof stat === 'string').map(stat => [stat, 0])
            ),
            ...stats,
        }
        finalStats[STAT.attackRange] = STAT.ATTACK_RANGE.melee;

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