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
    physical: "物理",
    magic: "法术",
    real: "真实"
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
    damage: "伤害",
    physicalPenetration: "物穿",
    magicPenetration: "法穿",
    magicDefense: "法抗",
    reduceMoveSpeed: "减速",
    reduceAttackSpeed: "减速",
    heavyInjury: "重伤",
    heal: "治疗",
    damageIncreased: "增伤",
    damageReduction: "免伤",
    physicalDamageReduction: "物免",
    criticalDamage: "暴伤",
    attackSpeed: "攻速",
    precision: "精准",
    tenacity: "韧性",
    stat: "属性",
    attackRange: "射程",
    moveSpeedBase: "移速",
    moveSpeedIncreased: "移速",
    shield: "护盾",
    maxHP: "生命",
    healIncreased: "增疗",
    physicalDefense: "物抗",
    cooldownReduction: "冷却"
}
const TRIGGER = {
    normalAttack: "普攻",
    skill: "技能",
    defend: "受击",
    auto: "自动"
}
const RUNE_COLOR = {
    red: "红",
    blue: "蓝",
    green: "绿"
}
const STAT = {
    maxHP: "maxHP",
    maxMP: "maxMP",
    moveSpeedBase: "moveSpeedBase",
    moveSpeedIncreased: "moveSpeedIncreased",
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
    physicalDamageReduction: "physicalDamageReduction",
    healIncreased: "healIncreased"
}

const HERO_DATA = [
    {
        name: "阿古朵",
        initialStats: {
            maxHP: 3351,
            maxMP: 600,
            moveSpeedBase: 370,

            physicalAttack: 176,
            physicalDefense: 150,

            magicDefense: 75,

            attackRange: STAT.ATTACK_RANGE.ranged,
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
            },
            cooldownReductionToDPS: 0.5,
            moveSpeedToEHP: 0.5
        },
        battleTime: {
            total: 5,
            normalAttack: 3
        },
        attackSpeedModel: ATTACK_SPEED_MODEL.A,
        skills: [
            {
                name: "普通攻击",
                tags: [SKILL_TAG.damage],
                trigger: [TRIGGER.normalAttack],
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
                trigger: [TRIGGER.auto],
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
                            name: STAT.moveSpeedIncreased,
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
                            tags: [SKILL_TAG.damage],
                            trigger: [TRIGGER.normalAttack],
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
                        release && EFFECT.statAdd(holder, release.name, growByLevel(holder.level, release.valueMin, release.valueMax), rate);
                    }
                },
                rate: 1
            },
            {
                name: "一技能",
                tags: [SKILL_TAG.attackSpeed],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.attackSpeed, 0.5, rate),
                rate: 1
            }
        ],
        exportFileName: function () {
            return [this.name, this.bonusStats.release.value, this.CP.toFixed(0)].join("_")
        }
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
            maxHP: 307,
            physicalDefense: 20.5,
            magicDefense: 8.6
        },
        skinStats: {
            maxHP: 120
        },
        bonusStats: {
            rate: 0.5,
            equipments: ["抵抗之靴", "红莲斗篷", "永夜守护", "反伤韧甲", "霸者重装", "不祥征兆"],
            runes: [["宿命", 10], ["调和", 10], ["虚空", 10]]
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
            rate: 0.5,
            equipments: ["泣血之刃"],
            runes: []
        }
    },
    enemyEHP_1: {
        name: "物理输出",
        bonusStats: {
            damageType: DAMAGE_TYPE.physical,
            rate: 0.6,
            equipments: ["暗影战斧"],
            runes: [["异变", 10], ["鹰眼", 10]]
        }
    },
    enemyEHP_2: {
        name: "法术输出",
        bonusStats: {
            damageType: DAMAGE_TYPE.magic,
            rate: 0.4,
            equipments: ["秘法之靴", "虚无法杖"],
            runes: [["梦魇", 10], ["心眼", 10]]
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
                tags: [SKILL_TAG.physicalPenetration],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.physicalPenetrationPercent, 0.4, rate),
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
                tags: [SKILL_TAG.magicDefense],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.magicDefense, Math.min(300, 0.6 * holder.getStat(STAT.physicalAttack)), rate),
                rate: 1
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
                tags: [SKILL_TAG.reduceMoveSpeed],
                trigger: [TRIGGER.normalAttack, TRIGGER.skill],
                effect: (attacker, defender, rate) => {},
                rate: 0
            },
            {
                name: "冻伤",
                tags: [SKILL_TAG.damage],
                trigger: [TRIGGER.normalAttack, TRIGGER.skill],
                effect: (attacker, defender, rate) => EFFECT.damageCD(
                    attacker,
                    defender,
                    "寒霜侵袭",
                    DAMAGE_TYPE.physical,
                    growByLevel(attacker.level, 135, 270) + 0.45 * attacker.getExtraStat(STAT.physicalAttack),
                    3,
                    rate),
                rate: 1
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
                tags: [SKILL_TAG.heavyInjury],
                trigger: [TRIGGER.normalAttack, TRIGGER.skill],
                effect: (attacker, defender, rate) => {},
                rate: 0,
                priority: 0.35
            },
            {
                name: "回魂",
                tags: [SKILL_TAG.heal],
                trigger: [TRIGGER.defend],
                effect: (attacker, defender, rate) => EFFECT.heal(
                    attacker,
                    defender,
                    "制裁之刃",
                    growByLevel(defender.level, 400, 610),
                    20,
                    rate),
                rate: 0.5,
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
            tags: [SKILL_TAG.damageReduction],
            effect: (holder, rate) => EFFECT.statAdd(holder, STAT.damageReduction, 0.35, rate),
            rate: 0.3,
            cooldown: 90,
        },
        passiveList: [
            {
                name: "残废",
                tags: [SKILL_TAG.reduceMoveSpeed, SKILL_TAG.damageReduction],
                trigger: [TRIGGER.skill],
                effect: (attacker, defender, rate) => {},
                rate: 0,
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
                tags: [SKILL_TAG.damage],
                trigger: [TRIGGER.normalAttack],
                effect: (attacker, defender, rate) => EFFECT.damageNA(
                    attacker,
                    defender,
                    "末世",
                    DAMAGE_TYPE.physical,
                    0.08 * defender.getStat(STAT.maxHP),
                    rate),
                rate: 0.3
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
                tags: [SKILL_TAG.heal],
                trigger: [TRIGGER.defend],
                effect: (attacker, defender, rate) => EFFECT.heal(
                    attacker,
                    defender,
                    "泣血之刃",
                    growByLevel(defender.level, 400, 610),
                    20,
                    rate),
                rate: 0.5,
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
                tags: [SKILL_TAG.criticalDamage],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.criticalDamage, Math.min(0.5, 0.2 + 0.01 * Math.floor(holder.getStat(STAT.criticalRate) / 0.02)), rate),
                rate: 1
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
                tags: [SKILL_TAG.moveSpeedIncreased, SKILL_TAG.damage],
                trigger: [TRIGGER.normalAttack],
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
            moveSpeedIncreased: 0.08
        },
        passiveList: [
            {
                name: "电弧",
                tags: [SKILL_TAG.damage],
                trigger: [TRIGGER.normalAttack],
                effect:(attacker, defender, rate) => EFFECT.damageNA(
                    attacker,
                    defender,
                    "闪电匕首",
                    DAMAGE_TYPE.magic,
                    growByLevel(attacker.level, 40, 82) + growByLevel(attacker.level, 140, 420) / 3,
                    rate
                ),
                rate: 1
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
            moveSpeedIncreased: 0.05
        },
        passiveList: [
            {
                name: "暴风",
                tags: [SKILL_TAG.attackSpeed, SKILL_TAG.moveSpeedIncreased],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => {
                    EFFECT.statAdd(holder, STAT.attackSpeed, 0.2, rate);
                    EFFECT.statAdd(holder, STAT.moveSpeedIncreased, 0.05, rate);
                },
                rate: 1
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
                tags: [SKILL_TAG.physicalPenetration],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.physicalPenetration, growByLevel(holder.level, 90, 180), rate),
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
                tags: [SKILL_TAG.damageIncreased],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.damageIncreased, 0.3, rate),
                rate: 0.4
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
            moveSpeedIncreased: 0.05
        },
        passiveList: [
            {
                name: "精准",
                tags: [SKILL_TAG.precision],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.precision, holder.getStat(STAT.attackRange) === STAT.ATTACK_RANGE.ranged ? 50: 25, rate),
                rate: 1,
                priority: 25
            },
        ],
        active: {
            name: "逐日",
            tags: [SKILL_TAG.attackRange, SKILL_TAG.speedUP],
            effect: (holder, rate) => {},
            rate: 0,
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
                tags: [SKILL_TAG.physicalPenetration],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.physicalPenetrationPercent, holder.getStat(STAT.attackRange) === STAT.ATTACK_RANGE.ranged ? 0.3: 0.15, rate),
                rate: 1,
                priority: 0.15
            },
            {
                name: "破晓",
                tags: [SKILL_TAG.precision],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.precision, holder.getStat(STAT.attackRange) === STAT.ATTACK_RANGE.ranged ? 50: 25, rate),
                rate: 1
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
                tags: [SKILL_TAG.attackSpeed, SKILL_TAG.damageIncreased],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => {
                    EFFECT.statAdd(holder, STAT.attackSpeed, 0.07 * 5, rate);
                    EFFECT.statAdd(holder, STAT.damageIncreased, 0.03 * 5, rate);
                },
                rate: 0.7
            }
        ]
    },
    {
        name: "虚无法杖",
        type: EQUIPMENT_TYPE.magic,
        price: 2110,
        stats: {
            maxHP: 300,
            magicAttack: 240,
            cooldownReduction: 0.05
        },
        passiveList: [
            {
                name: "破灭",
                tags: [SKILL_TAG.magicPenetration],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.magicPenetrationPercent, 0.45, rate),
                rate: 1
            }
        ]
    },
    {
        name: "反伤韧甲",
        type: EQUIPMENT_TYPE.defense,
        price: 2020,
        stats: {
            maxHP: 500,
            physicalAttack: 45,
            physicalDefense: 300
        },
        active: {
            name: "反刺",
            tags: [SKILL_TAG.damage],
            effect: (attack, defender, rate) => {},
            rate: 0,
            cooldown: 60,
        },
        passiveList: [
            {
                name: "韧甲",
                tags: [SKILL_TAG.tenacity],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.tenacity, 0.1, rate),
                rate: 1
            }
        ]
    },
    {
        name: "血魔之怒",
        type: EQUIPMENT_TYPE.defense,
        price: 2100,
        stats: {
            maxHP: 800,
            physicalAttack: 40
        },
        active: {
            name: "血怒",
            tags: [SKILL_TAG.shield],
            effect: (holder, rate) => EFFECT.shield(
                holder,
                holder,
                "血魔之怒",
                [DAMAGE_TYPE.physical, DAMAGE_TYPE.magic],
                holder.getStat(STAT.maxHP) * 0.4,
                60,
                rate
            ),
            rate: 0.3,
            cooldown: 60,
        },
        passiveList: [
            {
                name: "狂怒",
                tags: [SKILL_TAG.damage],
                trigger: [TRIGGER.normalAttack],
                effect: (attacker, defender, rate) => EFFECT.damageNA(
                    attacker,
                    defender,
                    "血魔之怒",
                    DAMAGE_TYPE.physical,
                    attacker.getStat(STAT.maxHP) * 0.02,
                    rate
                ),
                rate: 1
            }
        ]
    },
    {
        name: "冰霜冲击",
        type: EQUIPMENT_TYPE.defense,
        price: 2030,
        stats: {
            maxHP: 1000,
            physicalDefense: 240
        },
        active: {
            name: "冲击",
            tags: [SKILL_TAG.shield],
            effect: (holder, rate) => {},
            rate: 0,
            cooldown: 60,
        },
        passiveList: [
            {
                name: "冰甲",
                tags: [SKILL_TAG.shield],
                trigger: [TRIGGER.defend],
                effect: (attacker, defender, rate) => EFFECT.shield(
                    attacker,
                    defender,
                    "冰霜冲击",
                    [DAMAGE_TYPE.physical, DAMAGE_TYPE.magic],
                    defender.getStat(STAT.maxHP) * 0.12,
                    15,
                    rate
                ),
                rate: 0.5
            }
        ]
    },
    {
        name: "红莲斗篷",
        type: EQUIPMENT_TYPE.defense,
        price: 2010,
        stats: {
            maxHP: 1000,
            physicalDefense: 240
        },
        passiveList: [
            {
                name: "业炎",
                tags: [SKILL_TAG.damage],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.damageCD(
                    holder,
                    holder,
                    "红莲斗篷",
                    DAMAGE_TYPE.magic,
                    holder.getStat(STAT.maxHP) * 0.015,
                    1,
                    rate
                ),
                rate: 0.8
            },
            {
                name: "重伤",
                tags: [SKILL_TAG.heavyInjury],
                trigger: [TRIGGER.auto],
                effect: (attacker, defender, rate) => {},
                rate: 0
            }
        ]
    },
    {
        name: "霸者重装",
        type: EQUIPMENT_TYPE.defense,
        price: 2510,
        stats: {
            maxHP: 1500,
            physicalDefense: 180,
            magicDefense: 90
        },
        passiveList: [
            {
                name: "天命",
                tags: [SKILL_TAG.maxHP],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.maxHP, holder.getStat(STAT.maxHP) * 0.04, rate),
                rate: 1
            },
            {
                name: "复苏",
                tags: [SKILL_TAG.heal],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.healByTime(holder, holder, "霸者重装", holder.getStat(STAT.maxHP) * 0.005, rate),
                rate: 1
            }
        ]
    },
    {
        name: "不祥征兆",
        type: EQUIPMENT_TYPE.defense,
        price: 2050,
        stats: {
            maxHP: 1200,
            physicalDefense: 270
        },
        passiveList: [
            {
                name: "寒铁",
                tags: [SKILL_TAG.reduceMoveSpeed, SKILL_TAG.reduceAttackSpeed],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => {},
                rate: 0
            }
        ]
    },
    {
        name: "不死鸟之",
        type: EQUIPMENT_TYPE.defense,
        price: 2000,
        stats: {
            maxHP: 1200,
            physicalDefense: 100,
            magicDefense: 200
        },
        passiveList: [
            {
                name: "血统",
                tags: [SKILL_TAG.healIncreased],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.healIncreased, 0.5, rate),
                rate: 0.4
            }
        ]
    },
    {
        name: "魔女斗篷",
        type: EQUIPMENT_TYPE.defense,
        price: 2030,
        stats: {
            maxHP: 1000,
            magicDefense: 240,
            hpRegen: 100
        },
        passiveList: [
            {
                name: "迷雾",
                tags: [SKILL_TAG.shield],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.shield(
                    holder,
                    holder,
                    "魔女斗篷",
                    [DAMAGE_TYPE.magic],
                    growByLevel(holder.level, 400, 800) + holder.getExtraStat(STAT.maxHP) * 0.07,
                    15,
                    1
                ),
                rate: 1
            },
            {
                name: "魔女",
                tags: [SKILL_TAG.physicalDefense],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.physicalDefense, holder.getExtraStat(STAT.magicDefense) * 0.15, rate),
                rate: 1
            }
        ]
    },
    {
        name: "极寒风暴",
        type: EQUIPMENT_TYPE.defense,
        price: 2100,
        stats: {
            cooldownReduction: 0.2,
            maxMP: 500,
            physicalDefense: 360
        },
        passiveList: [
            {
                name: "冰心",
                tags: [SKILL_TAG.reduceAttackSpeed, SKILL_TAG.reduceMoveSpeed],
                trigger: [TRIGGER.defend],
                effect: (attacker, defender, rate) => {},
                rate: 0
            }
        ]
    },
    {
        name: "暴烈之甲",
        type: EQUIPMENT_TYPE.defense,
        price: 2100,
        stats: {
            maxHP: 900,
            physicalAttack: 30,
            physicalDefense: 210,
            moveSpeedIncreased: 0.05
        },
        passiveList: [
            {
                name: "无畏",
                tags: [SKILL_TAG.damageIncreased, SKILL_TAG.moveSpeedIncreased],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => {
                    EFFECT.statAdd(holder, STAT.damageIncreased, 0.02 * 5, rate);
                    EFFECT.statAdd(holder, STAT.moveSpeedIncreased, 0.01 * 5, rate);
                },
                rate: 0.6
            }
        ]
    },
    {
        name: "永夜守护",
        type: EQUIPMENT_TYPE.defense,
        price: 2110,
        stats: {
            maxHP: 1000,
            magicDefense: 360
        },
        passiveList: [
            {
                name: "守护",
                tags: [SKILL_TAG.heal],
                trigger: [TRIGGER.defend],
                effect: (attacker, defender, rate) => EFFECT.heal(
                    attacker,
                    defender,
                    "永夜守护",
                    320 + defender.getStat(STAT.maxHP) * 0.08,
                    7,
                    rate
                ),
                rate: 0.5
            }
        ]
    },
    {
        name: "怒龙剑盾",
        type: EQUIPMENT_TYPE.defense,
        price: 2040,
        stats: {
            maxHP: 1200,
            physicalDefense: 200,
            magicDefense: 100
        },
        passiveList: [
            {
                name: "重创",
                tags: [SKILL_TAG.damage],
                trigger: [TRIGGER.normalAttack],
                effect: (attacker, defender, rate) => {},
                rate: 0
            },
            {
                name: "神力",
                tags: [SKILL_TAG.damage],
                trigger: [TRIGGER.normalAttack],
                effect: (attacker, defender, rate) => EFFECT.damageCD(
                    attacker,
                    defender,
                    "怒龙剑盾",
                    DAMAGE_TYPE.physical,
                    attacker.getStat(STAT.maxHP) * 0.03 * attacker.getStat(STAT.attackRange) === STAT.ATTACK_RANGE.ranged? 0.5: 1,
                    2.5,
                    rate
                ),
                rate: 1
            }
        ]
    },
    {
        name: "冰痕之握",
        type: EQUIPMENT_TYPE.defense,
        price: 2100,
        stats: {
            maxHP: 500,
            physicalAttack: 40,
            cooldownReduction: 0.1,
            maxMP: 400,
            physicalDefense: 240
        },
        passiveList: [
            {
                name: "强击",
                tags: [SKILL_TAG.damage, SKILL_TAG.reduceMoveSpeed],
                trigger: [TRIGGER.normalAttack],
                effect: (attacker, defender, rate) => EFFECT.damageCD(
                    attacker,
                    defender,
                    "冰痕之握",
                    DAMAGE_TYPE.physical,
                    growByLevel(attacker.level, 210, 420),
                    1.2,
                    rate
                ),
                rate: 0.4,
                priority: 0
            }
        ]
    },
    {
        name: "影忍之足",
        type: EQUIPMENT_TYPE.move,
        price: 700,
        stats: {
            physicalDefense: 100,
            magicDefense: 50
        },
        passiveList: [
            {
                name: "神速",
                tags: [SKILL_TAG.moveSpeedBase],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.moveSpeedBase, 50, rate),
                rate: 1,
                priority: 50
            },
            {
                name: "无畏",
                tags: [SKILL_TAG.physicalDamageReduction],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.physicalDamageReduction, growByLevel(holder.level, 0.06, 0.12), rate),
                rate: 1
            }
        ]
    },
    {
        name: "抵抗之靴",
        type: EQUIPMENT_TYPE.move,
        price: 700,
        stats: {
            physicalDefense: 50,
            magicDefense: 100
        },
        passiveList: [
            {
                name: "神速",
                tags: [SKILL_TAG.moveSpeedBase],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.moveSpeedBase, 50, rate),
                rate: 1,
                priority: 50
            },
            {
                name: "坚韧",
                tags: [SKILL_TAG.tenacity],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.tenacity, 0.25, rate),
                rate: 1
            }
        ]
    },
    {
        name: "冷静之靴",
        type: EQUIPMENT_TYPE.move,
        price: 700,
        stats: {
            cooldownReduction: 0.15
        },
        passiveList: [
            {
                name: "神速",
                tags: [SKILL_TAG.moveSpeedBase],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.moveSpeedBase, 50, rate),
                rate: 1,
                priority: 50
            },
            {
                name: "静谧",
                tags: [SKILL_TAG.cooldownReduction],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => {},
                rate: 0
            }
        ]
    },
    {
        name: "秘法之靴",
        type: EQUIPMENT_TYPE.move,
        price: 700,
        stats: {
            maxMP: 150,
            //mpRegenIncreased: 0.15
        },
        passiveList: [
            {
                name: "神速",
                tags: [SKILL_TAG.moveSpeedBase],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.moveSpeedBase, 50, rate),
                rate: 1,
                priority: 50
            },
            {
                name: "法术精通",
                tags: [SKILL_TAG.magicPenetration],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.magicPenetration, growByLevel(holder.level, 60, 120), rate),
                rate: 1
            }
        ]
    },
    {
        name: "急速战靴",
        type: EQUIPMENT_TYPE.move,
        price: 700,
        stats: {
            attackSpeed: 0.2
        },
        passiveList: [
            {
                name: "神速",
                tags: [SKILL_TAG.moveSpeedBase],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.moveSpeedBase, 50, rate),
                rate: 1,
                priority: 50
            },
            {
                name: "急速战靴",
                tags: [SKILL_TAG.heal],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.healByNormalAttack(
                    holder,
                    holder,
                    "急速战靴",
                    1 / holder.totalStats.attackTime * holder.getStat(STAT.attackRange) === STAT.ATTACK_RANGE.melee?
                        growByLevel(holder.level, 20, 40):
                        growByLevel(holder.level, 30, 60),
                    rate
                ),
                rate: 1
            }
        ]
    },
    {
        name: "疾步之靴",
        type: EQUIPMENT_TYPE.move,
        price: 700,
        stats: {
            maxHP: 300
        },
        passiveList: [
            {
                name: "神速",
                tags: [SKILL_TAG.moveSpeedBase],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.moveSpeedBase, 70, rate),
                rate: 1,
                priority: 70
            },
            {
                name: "神行",
                tags: [SKILL_TAG.moveSpeedBase],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.moveSpeedBase, growByLevel(holder.level, 35, 70), rate),
                rate: 1
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
        name: "梦魇",
        color: RUNE_COLOR.red,
        stats: {
            magicAttack: 4.2,
            magicPenetration: 2.4
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
            moveSpeedIncreased: 0.01
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
            moveSpeedIncreased: 0.004
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
    {
        name: "心眼",
        color: RUNE_COLOR.green,
        stats: {
            attackSpeed: 0.006,
            magicPenetration: 6.4
        },
        level: 5
    },
];

const EFFECT = {
    statAdd: (holder, name, value, rate) => {
        holder.extraStats[name] += value * rate;
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
    healByTime: (attacker, defender, source, value, rate) => {
        defender.healList[attacker.name].push({
            source: source,
            value: value * defender.battleTime.total,
            cooldown: defender.battleTime.total,
            rate: rate
        });
    },
    healByNormalAttack: (attacker, defender, source, value, rate) => {
        attacker.healList[defender.name].push({
            source: source,
            value: value * attacker.battleTime.normalAttack,
            cooldown: attacker.battleTime.normalAttack,
            rate: rate
        });
    },
    shield: (attacker, defender, source, types, value, cooldown, rate) => {
        defender.shieldList[attacker.name].push({
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

export {DAMAGE_TYPE, STAT, HERO_DATA, ENEMY_DATA, EQUIPMENT_DATA, RUNE_DATA, EQUIPMENT_TYPE, SKILL_TAG, TRIGGER, RUNE_COLOR}