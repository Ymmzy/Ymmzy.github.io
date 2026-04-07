import {DAMAGE_TYPE, EQUIPMENT_TYPE, SKILL_TAG, STAT, TRIGGER} from "../constants.js";
import {growByLevel} from "../utils.js";
import {EFFECT} from "../Effect.js";

export const EQUIPMENT_DATA = [
    {
        name: "占位",
        type: EQUIPMENT_TYPE.magic,
        price: 1,
        stats: {
        },
        passiveList: []
    },
    {
        name: "碎星锤",
        type: EQUIPMENT_TYPE.physical,
        price: 2080,
        stats: {
            maxHP: 700,
            physicalAttack: 90,
            moveSpeedIncreased: 0.075
        },
        passiveList: [
            {
                name: "破甲",
                tags: [SKILL_TAG.physicalPenetration],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.physicalPenetrationPercent, 0.3, rate),
                rate: 1,
                priority: 0.3
            }
        ]
    },
    {
        name: "破魔刀",
        type: EQUIPMENT_TYPE.physical,
        price: 2060,
        stats: {
            maxHP: 600,
            physicalAttack: 90,
            magicDefense: 150
        },
        passiveList: [
            {
                name: "破魔",
                tags: [SKILL_TAG.magicDefense],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.magicDefense, Math.min(250, 0.5 * holder.getStat(STAT.physicalAttack)), rate),
                rate: 1
            }
        ]
    },
    {
        name: "寒霜袭侵",
        type: EQUIPMENT_TYPE.physical,
        price: 2040,
        stats: {
            maxHP: 750,
            physicalAttack: 70,
            attackSpeed: 0.25
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
                    "寒霜袭侵",
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
        price: 2080,
        stats: {
            physicalAttack: 100,
            attackSpeed: 0.2,
            physicalLifesteal: 0.2
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
                    growByLevel(defender.level, 375, 750),
                    20,
                    rate),
                rate: 0.5,
                priority: 750
            },
        ]
    },
    {
        name: "纯净苍穹",
        type: EQUIPMENT_TYPE.physical,
        price: 2140,
        stats: {
            physicalAttack: 80,
            cooldownReduction: 0.1,
            physicalDefense: 150
        },
        active: {
            name: "驱散",
            tags: [SKILL_TAG.damageReduction],
            effect: (holder, rate) => EFFECT.statAdd(holder, STAT.damageReduction, 0.3, rate),
            rate: 0.3,
            cooldown: 75,
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
        price: 2100,
        stats: {
            maxHP: 500,
            physicalAttack: 40,
            attackSpeed: 0.2,
            physicalLifesteal: 0.2
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
                    growByLevel(attacker.level, 80, 160) + 0.07 * defender.getExtraStat(STAT.maxHP),
                    rate),
                rate: 1
            },
        ]
    },
    {
        name: "泣血之刃",
        type: EQUIPMENT_TYPE.physical,
        price: 2020,
        stats: {
            maxHP: 500,
            physicalAttack: 80,
            physicalLifesteal: 0.25
        },
        passiveList: [
            {
                name: "养战",
                tags: [SKILL_TAG.heal],
                trigger: [TRIGGER.defend],
                effect: (attacker, defender, rate) => {},
                rate: 1,
                priority: 0.25
            },
            {
                name: "充溢",
                tags: [SKILL_TAG.maxHP],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => {
                    EFFECT.statAdd(holder, STAT.maxHP, growByLevel(holder.level, 400, 800), rate);
                },
                rate: 1,
                priority: 0.5
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
            physicalAttack: 55,
            attackSpeed: 0.15,
            criticalRate: 0.2
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
        price: 2040,
        stats: {
            physicalAttack: 40,
            attackSpeed: 0.35,
            moveSpeedIncreased: 0.075
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
                    growByLevel(attacker.level, 40, 80) + growByLevel(attacker.level, 160, 400) / 3,
                    rate
                ),
                rate: 1
            },
        ]
    },
    {
        name: "影刃",
        type: EQUIPMENT_TYPE.physical,
        price: 2040,
        stats: {
            physicalAttack: 45,
            attackSpeed: 0.35,
            criticalRate: 0.2,
            moveSpeedIncreased: 0.075
        },
        passiveList: [
            {
                name: "暴风",
                tags: [SKILL_TAG.attackSpeed, SKILL_TAG.moveSpeedIncreased],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => {
                    EFFECT.statAdd(holder, STAT.attackSpeed, 0.2, rate);
                    EFFECT.statAdd(holder, STAT.moveSpeedIncreased, 0.1, rate);
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
        price: 2100,
        stats: {
            physicalAttack: 40,
            attackSpeed: 0.2,
            criticalRate: 0.15,
            moveSpeedIncreased: 0.075
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
            tags: [SKILL_TAG.attackRange, SKILL_TAG.moveSpeedIncreased],
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
            physicalAttack: 75,
            attackSpeed: 0.3,
            criticalRate: 0.15
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
        price: 2080,
        stats: {
            maxHP: 600,
            physicalAttack: 50,
            attackSpeed: 0.3
        },
        passiveList: [
            {
                name: "逐风",
                tags: [SKILL_TAG.attackSpeed, SKILL_TAG.damageIncreased],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => {
                    EFFECT.statAdd(holder, STAT.attackSpeed, 0.02 * 5, rate);
                    EFFECT.statAdd(holder, STAT.moveSpeedIncreased, 0.02 * 5, rate);
                    EFFECT.statAdd(holder, STAT.damageIncreased, 0.02 * 5, rate);
                },
                rate: 0.7
            }
        ]
    },
    {
        name: "名刀·司命",
        type: EQUIPMENT_TYPE.physical,
        price: 2060,
        stats: {
            maxHP: 500,
            physicalAttack: 75,
            attackSpeed: 0.15
        },
        passiveList: [
            {
                name: "暗幕",
                tags: [SKILL_TAG.stat],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => {
                    EFFECT.statAdd(holder, STAT.maxHP, 0.15 * 500, rate);
                    EFFECT.statAdd(holder, STAT.physicalAttack, 0.15 * 75, rate);
                    EFFECT.statAdd(holder, STAT.attackSpeed, 0.15 * 0.15, rate);
                },
                rate: 0.6
            }
        ]
    },
    {
        name: "幽影袖箭",
        type: EQUIPMENT_TYPE.physical,
        price: 2040,
        stats: {
            attackSpeed: 0.2,
            criticalRate: 0.2,
            maxHP: 650,
            moveSpeedIncreased: 0.075
        },
        passiveList: [],
        active: {
            name: "无踪",
            tags: [SKILL_TAG.heal],
            effect: (holder, rate) => EFFECT.heal(
                holder,
                holder,
                "幽影袖箭",
                5 * (growByLevel(holder.level, 110, 220) + holder.getStat(STAT.maxHP) * 0.06),
                75,
                rate
            ),
            rate: 0.5,
            cooldown: 75,
        }
    },
    {
        name: "虚无法杖",
        type: EQUIPMENT_TYPE.magic,
        price: 2040,
        stats: {
            maxHP: 500,
            magicAttack: 210,
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
        name: "反伤刺甲",
        type: EQUIPMENT_TYPE.defense,
        price: 2020,
        stats: {
            maxHP: 700,
            physicalAttack: 45,
            physicalDefense: 300
        },
        active: {
            name: "反刺",
            tags: [SKILL_TAG.damage],
            effect: (attack, defender, rate) => {},
            rate: 0,
            cooldown: 75,
        },
        passiveList: []
    },
    {
        name: "血魔之怒",
        type: EQUIPMENT_TYPE.defense,
        price: 2180,
        stats: {
            maxHP: 900,
            physicalAttack: 75
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
                75,
                rate
            ),
            rate: 0.3,
            cooldown: 75,
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
                    attacker.getStat(STAT.maxHP) * 0.015,
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
            maxHP: 900,
            cooldownReduction: 0.07,
            physicalDefense: 150
        },
        active: {
            name: "冲击",
            tags: [SKILL_TAG.shield],
            effect: (holder, rate) => {},
            rate: 0,
            cooldown: 75,
        },
        passiveList: [
            {
                name: "冰甲",
                tags: [SKILL_TAG.tenacity, SKILL_TAG.shield],
                trigger: [TRIGGER.defend],
                effect: (attacker, defender, rate) => {
                    EFFECT.statAdd(defender, STAT.tenacity, 0.1, 1);
                    EFFECT.shield(
                        attacker,
                        defender,
                        "冰霜冲击",
                        [DAMAGE_TYPE.physical, DAMAGE_TYPE.magic],
                        defender.getStat(STAT.maxHP) * 0.1,
                        15,
                        rate
                    );
                },
                rate: 0.5
            }
        ]
    },
    {
        name: "红莲斗篷",
        type: EQUIPMENT_TYPE.defense,
        price: 2040,
        stats: {
            maxHP: 1350,
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
        price: 2450,
        stats: {
            maxHP: 1800,
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
        price: 2020,
        stats: {
            maxHP: 1200,
            physicalDefense: 300
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
        price: 2020,
        stats: {
            maxHP: 1350,
            physicalDefense: 90,
            magicDefense: 180
        },
        passiveList: [
            {
                name: "血统",
                tags: [SKILL_TAG.healIncreased],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.healIncreased, 0.5, rate),
                rate: 0.5
            }
        ]
    },
    {
        name: "魔女斗篷",
        type: EQUIPMENT_TYPE.defense,
        price: 2020,
        stats: {
            maxHP: 1100,
            magicDefense: 300
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
        price: 2040,
        stats: {
            maxHP: 600,
            cooldownReduction: 0.2,
            physicalDefense: 240
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
        name: "贤者的庇",
        type: EQUIPMENT_TYPE.defense,
        price: 2280,
        stats: {
            maxHP: 900,
            cooldownReduction: 0.05,
            physicalDefense: 150,
            magicDefense: 150
        },
        passiveList: [
            {
                name: "复生",
                tags: [SKILL_TAG.revive],
                trigger: [TRIGGER.auto],
                effect: (attacker, defender, rate) => {},
                rate: 0
            }
        ]
    },
    {
        name: "暴烈之甲",
        type: EQUIPMENT_TYPE.defense,
        price: 2050,
        stats: {
            maxHP: 900,
            physicalAttack: 35,
            physicalDefense: 210
        },
        passiveList: [
            {
                name: "无畏",
                tags: [SKILL_TAG.damageIncreased, SKILL_TAG.moveSpeedIncreased],
                trigger: [TRIGGER.auto],
                effect: (holder, rate) => {
                    EFFECT.statAdd(holder, STAT.damageIncreased, 0.01 * 10, rate);
                    EFFECT.statAdd(holder, STAT.moveSpeedIncreased, 0.01 * 10, rate);
                },
                rate: 0.6
            }
        ]
    },
    {
        name: "永夜守护",
        type: EQUIPMENT_TYPE.defense,
        price: 2020,
        stats: {
            maxHP: 900,
            physicalDefense: 90,   
            magicDefense: 180,
            moveSpeedIncreased: 0.075
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
                    defender.getStat(STAT.maxHP) * 0.1,
                    7,
                    rate
                ),
                rate: 0.6
            }
        ]
    },
    {
        name: "怒龙剑盾",
        type: EQUIPMENT_TYPE.defense,
        price: 2040,
        stats: {
            maxHP: 1100,
            physicalDefense: 150,
            magicDefense: 150
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
                    attacker.getStat(STAT.maxHP) * 0.035 * (attacker.getStat(STAT.attackRange) === STAT.ATTACK_RANGE.ranged? 0.5: 1),
                    2,
                    rate
                ),
                rate: 1
            }
        ]
    },
    {
        name: "冰痕之握",
        type: EQUIPMENT_TYPE.defense,
        price: 2060,
        stats: {
            physicalAttack: 55,
            cooldownReduction: 0.1,
            physicalDefense: 300
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
                    growByLevel(attacker.level, 140, 280) + attacker.getStat(STAT.physicalAttack) * 0.4,
                    1.25,
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
            maxMP: 400,
            mpRegen: 10 / 5
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
                    1 / holder.totalStats.attackTime * (holder.getStat(STAT.attackRange) === STAT.ATTACK_RANGE.melee?
                        growByLevel(holder.level, 20, 40):
                        growByLevel(holder.level, 30, 60)),
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
