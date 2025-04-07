const ATTACK_SPEED_MODEL = {
    A: {
        calculateAttackTime: function (attackSpeed) {
            return 0.066 * calculatePolynomial(4, [
                8.21793E-09,
                -4.60542E-06,
                1.05739E-03,
                -1.43292E-01,
                1.71208E+01
            ], attackSpeed);
        }
    },
    C: {
        calculateAttackTime: function (attackSpeed) {
            return 0.066 * calculatePolynomial(4, [
                8.21793E-09,
                -4.60542E-06,
                1.05739E-03,
                -1.43292E-01,
                1.61208E+01
            ], attackSpeed);
        }
    }
}

const DAMAGE_TYPE = {
    physical: "physical",
    magic: "magic"
}
const EQUIPMENT_TYPE = {
    "physical": "攻击",
    "magic": "法术",
    "defense": "防御",
    "move": "移动",
    "jungle": "打野",
    "support": "辅助"
}
const SKILL_TAG = {
    attack: "attack",
    stat: "stat",
    defend: "defend"
}
const PASSIVE_TAG = {
    damage: "伤害",
    physicalPenetration: "物穿",
    magicPenetration: "法穿",
    magicDefense: "法抗",
    slow: "减速",
    heavyInjury: "重伤",
    heal: "治疗",
    damageIncreased: "增伤",
    damageReduction: "免伤",
    criticalDamage: "暴伤",
    speedUp: "加速",
    attackSpeed: "攻速",
    precision: "精准"
}
const ACTIVE_TAG = {
    damageReduction: "免伤",
    speedUP: "加速",
    attackRange: "射程"
}
const TRIGGER = {
    normal: "normal",
    skill: "skill",
    defend: "defend",
    stat: "stat"
}
const RUNE_COLOR = {
    red: "红",
    blue: "蓝",
    green: "绿"
}
const STAT = {
    maxHP: "maxHP",
    maxMP: "maxMP",
    moveSpeed: "moveSpeed",
    physicalAttack: "physicalAttack",
    physicalDefense: "physicalDefense",
    physicalPenetration: "physicalPenetration",
    physicalPenetrationPercent: "physicalPenetrationPercent",
    physicalLifesteal: "physicalLifesteal",
    magicAttack: "magicAttack",
    magicDefense: "magicDefense",
    magicPenetration: "magicPenetration",
    magicPenetrationPercent: "magicPenetrationPercent",
    magicLifesteal: "magicLifesteal",
    attackRange: "attackRange",
    ATTACK_RANGE: {
        melee: "近程",
        ranged: "远程"
    },
    criticalRate: "criticalRate",
    criticalDamage: "criticalDamage",
    attackSpeed: "attackSpeed",
    hpRegen: "hpRegen",
    mpRegen: "mpRegen",
    cooldownReduction: "cooldownReduction",
    tenacity: "tenacity",
    precision: "precision",
    damageIncreased: "damageIncreased",
    damageReduction: "damageReduction",
}
const HERO_DATA = [
    {
        name: "阿古朵",
        initialStats: {
            maxHP: 3351,
            maxMP: 600,
            moveSpeed: 370,

            physicalAttack: 176,
            physicalDefense: 150,

            magicDefense: 75,

            attackRange: '远程',
            criticalDamage: 1.85,
            attackSpeed: 0.1,

            hpRegen: 50 / 5,
            mpRegen: 15 / 5
        },
        growthStats: {
            maxHP: 202.9,
            maxMP: 600 / 14,

            physicalAttack: 13.1,
            physicalDefense: 13.9,

            magicDefense: 8,

            attackSpeed: 0.02,

            hpRegen: 45 / 14,
            mpRegen: 15 / 14
        },
        skinStats: {
            physicalAttack: 10
        },
        bonusStats: {
            release: {
                key: "放生",
                value: "山猕"
            }
        },
        attackSpeedModel: ATTACK_SPEED_MODEL.A,
        skills: [
            {
                name: "普通攻击",
                tags: [SKILL_TAG.attack],
                effect: (attacker, defender, rate) => EFFECT.damageNA(
                    attacker,
                    defender,
                    "普通攻击",
                    DAMAGE_TYPE.physical,
                    (attacker.getStat(STAT.physicalAttack) + attacker.getStat(STAT.precision)) * (1 + Math.min(1, attacker.getStat(STAT.criticalRate)) * (attacker.getStat(STAT.criticalDamage) - 1)),
                    rate
                ),
                rate: 1
            },
            {
                name: "放生",
                tags: [SKILL_TAG.stat],
                effect: function (holder, rate) {
                    const releaseList = {
                        "赤甲": {
                            name: STAT.criticalRate,
                            valueMin: 0.1,
                            valueMax: 0.2
                        },
                        "蜥蜴": {
                            name: STAT.magicDefense,
                            valueMin: 140,
                            valueMax: 280
                        },
                        "猎豹": {
                            name: STAT.moveSpeed,
                            valueMin: 25,
                            valueMax: 50
                        },
                        "山猕": {
                            name: STAT.physicalDefense,
                            valueMin: 140,
                            valueMax: 280
                        },
                        "山豪": {
                            name: STAT.maxHP,
                            valueMin: 400,
                            valueMax: 800
                        },
                        "烈雉": {
                            name: STAT.attackSpeed,
                            valueMin: 0.15,
                            valueMax: 0.3
                        },
                        "猩红石像": {
                            name: STAT.physicalAttack,
                            valueMin: 35,
                            valueMax: 70
                        },
                        "蔚蓝石像": {
                            valueMin: 40,
                            valueMax: 80
                        }
                    };
                    if (holder.bonusStats.release.value === "蔚蓝石像") {
                        holder.passiveList.push({
                            name: "放生: 蔚蓝石像",
                            tags: [PASSIVE_TAG.damage],
                            trigger: [TRIGGER.normal],
                            effect: (attacker, defender, rate) => EFFECT.damageNA(
                                attacker,
                                defender,
                                "放生: 蔚蓝石像",
                                DAMAGE_TYPE.magic,
                                growByLevel(attacker.level, releaseList["蔚蓝石像"].valueMin, releaseList["蔚蓝石像"].valueMax),
                                rate)
                        });
                    }
                    else {
                        let release = releaseList[holder.bonusStats.release.value];
                        EFFECT.statAdd(holder, release.name, growByLevel(holder.level, release.valueMin, release.valueMax));
                    }
                },
                rate: 1
            }
        ]
    }
];
const ENEMY_DATA = {
    enemyDPS_1: {
        name: "坦克木桩",
        initialStats: {
            maxHP: 3570,
            physicalDefense: 150,
            magicDefense: 75
        },
        growthStats: {
            maxHP: 291.2,
            physicalDefense: 20.5,
            magicDefense: 8.6
        },
        skinStats: {
            maxHP: 120
        },
        bonusStats: {
            rate: 0.5
        }
    },
    enemyDPS_2: {
        name: "脆皮木桩",
        initialStats: {
            maxHP: 3207,
            physicalDefense: 150,
            magicDefense: 75
        },
        growthStats: {
            maxHP: 186.7,
            physicalDefense: 13.5,
            magicDefense: 7.4
        },
        bonusStats: {
            rate: 0.5
        }
    },
    enemyEHP_1: {
        name: "物理输出",
        bonusStats: {
            damageType: DAMAGE_TYPE.physical,
            rate: 0.6
        }
    },
    enemyEHP_2: {
        name: "法术输出",
        bonusStats: {
            damageType: DAMAGE_TYPE.magic,
            rate: 0.4
        }
    }
}
const EQUIPMENT_DATA = [
    {
        name: "碎星锤",
        type: EQUIPMENT_TYPE.physical,
        price: 2080,
        stats: {
            physicalAttack: 80,
            cooldownReduction: 0.1
        },
        passiveList: [
            {
                name: "破甲",
                tags: [PASSIVE_TAG.physicalPenetration],
                trigger: [TRIGGER.stat],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.physicalPenetrationPercent, 0.4),
                rate: 1,
                priority: 0.4
            }
        ]
    },
    {
        name: "破魔刀",
        type: EQUIPMENT_TYPE.physical,
        price: 2060,
        stats: {
            maxHP: 500,
            physicalAttack: 90,
            magicDefense: 100
        },
        passiveList: [
            {
                name: "破魔",
                tags: [PASSIVE_TAG.magicDefense],
                trigger: [TRIGGER.stat],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.magicDefense, 0.6 * holder.getStat(STAT.physicalAttack)),
                rate: 1,
                priority: 0.6
            }
        ]
    },
    {
        name: "寒霜侵袭",
        type: EQUIPMENT_TYPE.physical,
        price: 2060,
        stats: {
            maxHP: 750,
            physicalAttack: 70,
            attackSpeed: 0.3
        },
        passiveList: [
            {
                name: "寒霜",
                tags: [PASSIVE_TAG.slow],
                trigger: [TRIGGER.normal, TRIGGER.skill],
                effect: (attacker, defender, rate) => {},
                rate: 1,
                priority: 0.1
            },
            {
                name: "冻伤",
                tags: [PASSIVE_TAG.damage],
                trigger: [TRIGGER.normal, TRIGGER.skill],
                effect: (attacker, defender, rate) => EFFECT.damageCD(
                    attacker,
                    defender,
                    "寒霜侵袭",
                    DAMAGE_TYPE.physical,
                    growByLevel(attacker.level, 135, 270) + 0.45 * attacker.extraStats[STAT.physicalAttack],
                    3,
                    rate),
                rate: 1,
                cooldown: 3,
                priority: 0.45
            },
        ]
    },
    {
        name: "制裁之刃",
        type: EQUIPMENT_TYPE.physical,
        price: 1860,
        stats: {
            physicalAttack: 100,
            attackSpeed: 0.15,
            physicalLifesteal: 0.15
        },
        passiveList: [
            {
                name: "重伤",
                tags: [PASSIVE_TAG.heavyInjury],
                trigger: [TRIGGER.normal, TRIGGER.skill],
                effect: function (attacker, defender, rate) {
                },
                rate: 1,
                priority: 0.35
            },
            {
                name: "回魂",
                tags: [PASSIVE_TAG.heal],
                trigger: [TRIGGER.defend],
                effect: (attacker, defender, rate) => EFFECT.heal(
                    attacker,
                    defender,
                    "制裁之刃",
                    growByLevel(defender.level, 400, 610),
                    20,
                    rate),
                rate: 0.5,
                cooldown: 20,
                priority: 610
            },
        ]
    },
    {
        name: "纯净苍穹",
        type: EQUIPMENT_TYPE.physical,
        price: 2120,
        stats: {
            maxHP: 500,
            physicalAttack: 100,
            cooldownReduction: 0.1
        },
        active: {
            name: "驱散",
            tags: [ACTIVE_TAG.damageReduction],
            effect: (holder, rate) => EFFECT.statAdd(holder, STAT.damageReduction, 0.35 * rate),
            rate: 0.2,
            cooldown: 90,
        },
        passiveList: [
            {
                name: "残废",
                tags: [PASSIVE_TAG.slow, PASSIVE_TAG.damageReduction],
                trigger: [TRIGGER.skill],
                effect: (attacker, defender, rate) => {},
                rate: 1,
                priority: 0.3
            },
        ]
    },
    {
        name: "末世",
        type: EQUIPMENT_TYPE.physical,
        price: 2160,
        stats: {
            physicalAttack: 60,
            attackSpeed: 0.3,
            physicalLifesteal: 0.1
        },
        passiveList: [
            {
                name: "破败",
                tags: [PASSIVE_TAG.damage],
                trigger: [TRIGGER.normal],
                effect: (attacker, defender, rate) => EFFECT.damageNA(
                    attacker,
                    defender,
                    "末世",
                    DAMAGE_TYPE.physical,
                    0.08 * defender.getStat(STAT.maxHP),
                    rate),
                rate: 0.3,
                priority: 0.08
            },
        ]
    },
    {
        name: "泣血之刃",
        type: EQUIPMENT_TYPE.physical,
        price: 1800,
        stats: {
            maxHP: 500,
            physicalAttack: 100,
            physicalLifesteal: 0.25
        },
        passiveList: [
            {
                name: "回魂",
                tags: [PASSIVE_TAG.heal],
                trigger: [TRIGGER.defend],
                effect: (attacker, defender, rate) => EFFECT.heal(
                    attacker,
                    defender,
                    "泣血之刃",
                    growByLevel(defender.level, 400, 610),
                    20,
                    rate),
                rate: 0.5,
                cooldown: 20,
                priority: 610
            },
        ]
    },
    {
        name: "无尽战刃",
        type: EQUIPMENT_TYPE.physical,
        price: 2110,
        stats: {
            physicalAttack: 120,
            criticalRate: 0.2
        },
        passiveList: [
            {
                name: "无尽",
                tags: [PASSIVE_TAG.criticalDamage],
                trigger: [TRIGGER.stat],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.criticalDamage, Math.min(0.5, 0.2 + 0.01 * Math.floor(holder.getStat(STAT.criticalRate) / 0.02))),
                rate: 1,
                priority: 0.5
            },
        ]
    },
    {
        name: "宗师之力",
        type: EQUIPMENT_TYPE.physical,
        price: 2100,
        stats: {
            maxHP: 600,
            physicalAttack: 80,
            criticalRate: 0.2,
            maxMP: 400
        },
        passiveList: [
            {
                name: "强击",
                tags: [PASSIVE_TAG.speedUp, PASSIVE_TAG.damage],
                trigger: [TRIGGER.normal],
                effect: (attacker, defender, rate) => EFFECT.damageCD(
                    attacker,
                    defender,
                    "宗师之力",
                    DAMAGE_TYPE.physical,
                    0.8 * attacker.getStat(STAT.physicalAttack),
                    3,
                    rate
                ),
                rate: 0.6,
                cooldown: 3,
                priority: 0.8
            },
        ]
    },
    {
        name: "闪电匕首",
        type: EQUIPMENT_TYPE.physical,
        price: 1840,
        stats: {
            attackSpeed: 0.35,
            moveSpeed: 0.08
        },
        passiveList: [
            {
                name: "电弧",
                tags: [PASSIVE_TAG.damage],
                trigger: [TRIGGER.normal],
                effect:(attacker, defender, rate) => EFFECT.damageNA(
                    attacker,
                    defender,
                    "闪电匕首",
                    DAMAGE_TYPE.magic,
                    growByLevel(attacker.level, 40, 82) + growByLevel(attacker.level, 140, 420) / 3,
                    rate
                ),
                rate: 1,
                priority: 420
            },
        ]
    },
    {
        name: "影刃",
        type: EQUIPMENT_TYPE.physical,
        price: 1950,
        stats: {
            physicalAttack: 40,
            attackSpeed: 0.35,
            criticalRate: 0.25,
            moveSpeed: 0.05
        },
        passiveList: [
            {
                name: "暴风",
                tags: [PASSIVE_TAG.attackSpeed, PASSIVE_TAG.speedUp],
                trigger: [TRIGGER.stat],
                effect: (holder, rate) => {
                    EFFECT.statAdd(holder, STAT.attackSpeed, 0.2 * rate);
                    EFFECT.statAdd(holder, STAT.moveSpeed, 0.05 * rate);
                },
                rate: 1,
                priority: 0.2
            },
        ]
    },
    {
        name: "暗影战斧",
        type: EQUIPMENT_TYPE.physical,
        price: 2090,
        stats: {
            maxHP: 500,
            physicalAttack: 80,
            cooldownReduction: 0.1
        },
        passiveList: [
            {
                name: "切割",
                tags: [PASSIVE_TAG.physicalPenetration],
                trigger: [TRIGGER.stat],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.physicalPenetration, growByLevel(holder.level, 90, 180)),
                rate: 1,
                priority: 180
            },
        ]
    },
    {
        name: "强者破军",
        type: EQUIPMENT_TYPE.physical,
        price: 2540,
        stats: {
            physicalAttack: 150,
            cooldownReduction: 0.05
        },
        passiveList: [
            {
                name: "破军",
                tags: [PASSIVE_TAG.damageIncreased],
                trigger: [TRIGGER.stat],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.damageIncreased, 0.3 * rate),
                rate: 0.4,
                priority: 0.3
            },
        ]
    },
    {
        name: "逐日之弓",
        type: EQUIPMENT_TYPE.physical,
        price: 2050,
        stats: {
            physicalAttack: 50,
            attackSpeed: 0.25,
            criticalRate: 0.1,
            moveSpeed: 0.05
        },
        passiveList: [
            {
                name: "精准",
                tags: [PASSIVE_TAG.precision],
                trigger: [TRIGGER.stat],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.precision, holder.getStat(STAT.attackRange) === STAT.ATTACK_RANGE.ranged ? 50: 25),
                rate: 1,
                priority: 25
            },
        ],
        active: {
            name: "逐日",
            tags: [ACTIVE_TAG.attackRange, ACTIVE_TAG.speedUP],
            effect: (holder, rate) => {},
            rate: 1,
            cooldown: 60,
        }
    },
    {
        name: "仁者破晓",
        type: EQUIPMENT_TYPE.physical,
        price: 2570,
        stats: {
            physicalAttack: 90,
            attackSpeed: 0.3,
            criticalRate: 0.1
        },
        passiveList: [
            {
                name: "破甲",
                tags: [PASSIVE_TAG.physicalPenetration],
                trigger: [TRIGGER.stat],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.physicalPenetrationPercent, holder.getStat(STAT.attackRange) === STAT.ATTACK_RANGE.ranged ? 0.3: 0.15),
                rate: 1,
                priority: 0.15
            },
            {
                name: "破晓",
                tags: [PASSIVE_TAG.precision],
                trigger: [TRIGGER.stat],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.precision, holder.getStat(STAT.attackRange) === STAT.ATTACK_RANGE.ranged ? 50: 25),
                rate: 1,
                priority: 25
            },
        ]
    },
    {
        name: "逐风",
        type: EQUIPMENT_TYPE.physical,
        price: 2090,
        stats: {
            maxHP: 700,
            physicalAttack: 65,
            attackSpeed: 0.25
        },
        passiveList: [
            {
                name: "逐风",
                tags: [PASSIVE_TAG.attackSpeed, PASSIVE_TAG.damageIncreased],
                trigger: [TRIGGER.stat],
                effect: (holder, rate) => {
                    EFFECT.statAdd(holder, STAT.attackSpeed, 0.07 * 5 * rate);
                    EFFECT.statAdd(holder, STAT.damageIncreased, 0.03 * 5 * rate);
                },
                rate: 0.7,
                priority: 0.07
            }
        ]
    },


];
const RUNE_DATA = [
    {
        name: "传承",
        color: RUNE_COLOR.red,
        stats: {
            physicalAttack: 3.2
        },
        level: 5
    },
    {
        name: "无双",
        color: RUNE_COLOR.red,
        stats: {
            criticalRate: 0.007,
            criticalDamage: 0.036
        },
        level: 5
    },
    {
        name: "纷争",
        color: RUNE_COLOR.red,
        stats: {
            physicalAttack: 2.5,
            physicalLifesteal: 0.005
        },
        level: 5
    },
    {
        name: "红月",
        color: RUNE_COLOR.red,
        stats: {
            attackSpeed: 0.016,
            criticalRate: 0.005
        },
        level: 5
    },
    {
        name: "异变",
        color: RUNE_COLOR.red,
        stats: {
            physicalAttack: 2,
            physicalPenetration: 3.6
        },
        level: 5
    },
    {
        name: "宿命",
        color: RUNE_COLOR.red,
        stats: {
            attackSpeed: 0.01,
            maxHP: 33.7,
            physicalDefense: 2.3
        },
        level: 5
    },
    {
        name: "祸源",
        color: RUNE_COLOR.red,
        stats: {
            criticalRate: 0.016
        },
        level: 5
    },
    {
        name: "长生",
        color: RUNE_COLOR.blue,
        stats: {
            maxHP: 75
        },
        level: 5
    },
    {
        name: "狩猎",
        color: RUNE_COLOR.blue,
        stats: {
            attackSpeed: 0.01,
            moveSpeed: 0.01
        },
        level: 5
    },
    {
        name: "夺萃",
        color: RUNE_COLOR.blue,
        stats: {
            physicalLifesteal: 0.016
        },
        level: 5
    },
    {
        name: "兽痕",
        color: RUNE_COLOR.blue,
        stats: {
            maxHP: 60,
            criticalRate: 0.005
        },
        level: 5
    },
    {
        name: "繁荣",
        color: RUNE_COLOR.blue,
        stats: {
            physicalLifesteal: 0.01,
            magicDefense: 4.1
        },
        level: 5
    },
    {
        name: "调和",
        color: RUNE_COLOR.blue,
        stats: {
            maxHP: 45,
            hpRegen: 5.2 / 5,
            moveSpeed: 0.004
        },
        level: 5
    },
    {
        name: "鹰眼",
        color: RUNE_COLOR.green,
        stats: {
            physicalAttack: 0.9,
            physicalPenetration: 6.4
        },
        level: 5
    },
    {
        name: "怜悯",
        color: RUNE_COLOR.green,
        stats: {
            cooldownReduction: 0.01
        },
        level: 5
    },
    {
        name: "霸者",
        color: RUNE_COLOR.green,
        stats: {
            physicalDefense: 9
        },
        level: 5
    },
    {
        name: "均衡",
        color: RUNE_COLOR.green,
        stats: {
            physicalDefense: 5,
            magicDefense: 5
        },
        level: 5
    },
    {
        name: "虚空",
        color: RUNE_COLOR.green,
        stats: {
            maxHP: 37.5,
            cooldownReduction: 0.006
        },
        level: 5
    },
    {
        name: "灵山",
        color: RUNE_COLOR.green,
        stats: {
            magicDefense: 9
        },
        level: 5
    },
    {
        name: "回声",
        color: RUNE_COLOR.green,
        stats: {
            physicalDefense: 2.7,
            magicDefense: 2.7,
            cooldownReduction: 0.006
        },
        level: 5
    },
];

const EFFECT = {
    statAdd: (holder, name, value) => {
        holder.extraStats[name] += value;
    } ,
    damageNA: (attacker, defender, source, type, value, rate) => {
        attacker.damageNAList[defender.name].push({
            source: source,
            type: type,
            value: value,
            rate: rate
        });
    },
    damageCD: (attacker, defender, source, type, value, cooldown, rate) => {
        attacker.damageCDList[defender.name].push({
            source: source,
            type: type,
            value: value,
            cooldown: cooldown,
            rate: rate
        });
    },
    heal: (attacker, defender, source, value, cooldown, rate) => {
        defender.healList[attacker.name].push({
            source: source,
            value: value,
            cooldown: cooldown,
            rate: rate
        });
    },
    shield: (attacker, defender, source, types, value, cooldown, rate) => {
        defender.healList[attacker.name].push({
            source: source,
            types: types,
            value: value,
            cooldown: cooldown,
            rate: rate
        });
    }
}

/**
 * 计算多项式的值（系数按降幂排序）
 * @param {number} maxDegree 多项式的最高次数
 * @param {number[]} coefficients 多项式系数数组，从高次到低次排列
 * @param {number} x 变量的值
 * @returns {number} 多项式在x处的计算结果
 */
function calculatePolynomial(maxDegree, coefficients, x) {
    // 验证输入
    if (maxDegree < 0) {
        throw new Error("最高次数必须为非负整数");
    }
    if (coefficients.length !== maxDegree + 1) {
        throw new Error("系数数组长度应与最高次数+1相等");
    }

    let result = 0;

    // 使用霍纳法则(Horner's method)，系数按降幂排序
    for (let i = 0; i <= maxDegree; i++) {
        result = result * x + coefficients[i];
    }

    return result;
}

/**
 * 等级成长数值计算
 * 1级取值min，15级取值max
 */
function growByLevel(level, min, max) {
    return min + (max - min) * (level - 1) / 14;
}

export {DAMAGE_TYPE, SKILL_TAG, STAT, HERO_DATA, ENEMY_DATA, EQUIPMENT_DATA, RUNE_DATA, EQUIPMENT_TYPE, ACTIVE_TAG, PASSIVE_TAG, TRIGGER, RUNE_COLOR}