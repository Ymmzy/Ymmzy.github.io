import {ATTACK_SPEED_MODEL, DAMAGE_TYPE, SKILL_TAG, STAT, TRIGGER} from "../constants.js";
import {growByLevel} from "../utils.js";
import {EFFECT} from "../Effect.js";

export const HERO_DATA = [
    {
        name: "阿古朵",
        initialStats: {
            maxHP: 3280,
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
            maxHP: 198,
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
                value: "山猕",
                options: ["赤甲", "蜥蜴", "猎豹", "山猕", "山豪", "烈雉", "猩红石像", "蔚蓝石像", "红隼"]
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
                        },
                        "红隼": {
                            name: STAT.physicalPenetration,
                            valueMin: 60,
                            valueMax: 120
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
                effect: (holder, rate) => EFFECT.statAdd(holder, STAT.attackSpeed, growByLevel(holder.level, 0.15, 0.3), rate),
                rate: 1
            }
        ],
        exportFileName: function () {
            return [this.name, this.bonusStats.release.value, this.CP.toFixed(0)].join("_")
        }
    }
];
