export default class Stats {
    constructor(stats = {}) {
        const finalStats = {
            // 基础属性
            maxHP: 0,
            maxMP: 0,
            moveSpeed: 0,

            // 物理相关
            physicalAttack: 0,
            physicalDefense: 0,
            physicalPenetration: 0,
            physicalPenetrationPercent: 0,
            physicalLifesteal: 0,

            // 法术相关
            magicAttack: 0,
            magicDefense: 0,
            magicPenetration: 0,
            magicPenetrationPercent: 0,
            magicLifesteal: 0,

            // 战斗属性
            attackRange: 'melee',  // 默认近战
            criticalRate: 0,
            criticalDamage: 0,
            attackSpeed: 0,

            // 恢复属性
            hpRegen: 0,
            mpRegen: 0,

            // 特殊属性
            cooldownReduction: 0,
            tenacity: 0,
            precision: 0,
            damageIncreased: 0,
            damageReduction: 0,

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
                if (key === 'cooldownReduction') {
                    // 冷却缩减上限为40%
                    this[key] = Math.min(this[key] + otherStats[key], 0.4);
                } else if (key === 'criticalDamage') {
                    // 暴击伤害上限为235%
                    this[key] = Math.min(this[key] + otherStats[key], 2.35);
                } else if (key === 'physicalPenetrationPercent' || key === 'magicPenetrationPercent') {
                    // 穿透百分比上限为100%
                    this[key] = Math.min(this[key] + otherStats[key], 1);
                } else if (key === 'tenacity') {
                    // 韧性上限为100%
                    this[key] = Math.min(this[key] + otherStats[key], 1);
                } else if (key === 'attackRange') {
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