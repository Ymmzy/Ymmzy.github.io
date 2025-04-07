const attackSpeedModel = {
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
const heroData = [
    {
        name: "阿古朵",
        initialStats: {
            maxHP: 3351,
            maxMP: 600,
            moveSpeed: 370,

            physicalAttack: 176,
            physicalDefense: 150,

            magicDefense: 75,

            attackRange: 'ranged',
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
        attackSpeedModel: attackSpeedModel.A,
        skills: [
            {
                name: "普通攻击",
                tags: ["attack"],
                effect: function (attacker, defender, rate = 1) {
                    attacker.damageNAList[defender].push({
                        source: "普通攻击",
                        type: "physical",
                        value: (attacker.getStat("physicalAttack") + attacker.getStat("precision")) *
                            (1 + attacker.getStat("criticalRate") * (attacker.getStat("criticalDamage") - 1)),
                        rate: rate
                    });
                },
                rate: 1
            },
            {
                name: "放生",
                tags: ["stats"],
                effect: function (holder, rate = 1) {
                    const releaseList = {
                        "赤甲": {
                            name: "criticalRate",
                            valueMin: 0.1,
                            valueMax: 0.2
                        },
                        "蜥蜴": {
                            name: "magicDefense",
                            valueMin: 140,
                            valueMax: 280
                        },
                        "猎豹": {
                            name: "moveSpeed",
                            valueMin: 25,
                            valueMax: 50
                        },
                        "山猕": {
                            name: "physicalDefense",
                            valueMin: 140,
                            valueMax: 280
                        },
                        "山豪": {
                            name: "maxHP",
                            valueMin: 400,
                            valueMax: 800
                        },
                        "烈雉": {
                            name: "attackSpeed",
                            valueMin: 0.15,
                            valueMax: 0.3
                        },
                        "猩红石像": {
                            name: "physicalAttack",
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
                            tags: ["伤害"],
                            trigger: ["normal"],
                            effect: function (attacker, defender, rate = 1) {
                                attacker.damageNAList[defender].push({
                                    source: "放生: 蔚蓝石像",
                                    type: "magic",
                                    value: growByLevel(attacker.level, releaseList["蔚蓝石像"].valueMin, releaseList["蔚蓝石像"].valueMax),
                                    rate: 1
                                });
                            }
                        });
                    }
                    else {
                        let release = releaseList[holder.bonusStats.release.value]
                        let stats = {};
                        stats[release.name] = growByLevel(holder.level, release.valueMin, release.valueMax);
                        holder.extraStats.add(stats);
                    }
                },
                rate: 1
            }
        ]
    }
];
const enemyData = {
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
        name: "物理输出"
    },
    enemyEHP_2: {
        name: "法术输出"
    }
}
const equipmentData = [
    {
        name: "碎星锤",
        type: "physical",
        price: 2080,
        stats: {
            physicalAttack: 80,
            cooldownReduction: 0.1
        },
        passiveList: [
            {
                name: "破甲",
                tags: ["物穿"],
                trigger: ["stats"],
                effect: function (holder, rate = 1) {
                    holder.extraStats.add({physicalPenetrationPercent: 0.4})
                },
                priority: 0.4
            }
        ]
    },
    {
        name: "破魔刀",
        type: "physical",
        price: 2060,
        stats: {
            maxHP: 500,
            physicalAttack: 90,
            magicDefense: 100
        },
        passiveList: [
            {
                name: "破魔",
                tags: ["法抗"],
                trigger: ["stats"],
                effect: function (holder, rate = 1) {
                    holder.extraStats.add({magicDefense: 0.6 * holder.getStat("physicalAttack")})
                },
                priority: 0.6
            }
        ]
    },
    {
        name: "寒霜侵袭",
        type: "physical",
        price: 2060,
        stats: {
            maxHP: 750,
            physicalAttack: 70,
            attackSpeed: 0.3
        },
        passiveList: [
            {
                name: "寒霜",
                tags: ["减速"],
                trigger: ["normal", "skill"],
                effect: function (attacker, defender, rate = 1) {
                },
                priority: 0.1
            },
            {
                name: "冻伤",
                tags: ["伤害"],
                trigger: ["normal", "skill"],
                effect: function (attacker, defender, rate = 1) {
                    attacker.damageCDList[defender].push({
                        source: "寒霜侵袭",
                        type: "physical",
                        value: growByLevel(attacker.level, 135, 270) + 0.45 * attacker.extraStats.physicalAttack,
                        cooldown: 3,
                        rate: rate
                    });
                },
                cooldown: 3,
                priority: 0.45
            },
        ]
    },
    {
        name: "制裁之刃",
        type: "physical",
        price: 1860,
        stats: {
            physicalAttack: 100,
            attackSpeed: 0.15,
            physicalLifesteal: 0.15
        },
        passiveList: [
            {
                name: "重伤",
                tags: ["重伤"],
                trigger: ["normal", "skill"],
                effect: function (attacker, defender, rate = 1) {
                },
                priority: 0.35
            },
            {
                name: "回魂",
                tags: ["治疗"],
                trigger: ["defend"],
                effect: function (attacker, defender, rate = 1) {
                    defender.healList[attacker].push({
                        value: growByLevel(defender.level, 400, 610),
                        cooldown: 20,
                        rate: rate
                    });
                },
                rate: 0.5,
                cooldown: 20,
                priority: 610
            },
        ]
    },
    {
        name: "纯净苍穹",
        type: "physical",
        price: 2120,
        stats: {
            maxHP: 500,
            physicalAttack: 100,
            cooldownReduction: 0.1
        },
        active: {
            name: "驱散",
            tags: ["免伤"],
            effect: function (holder, rate = 1) {
                holder.extraStats.add({damageReduction: 0.35 * rate})
            },
            rate: 0.2,
            cooldown: 90,
        },
        passiveList: [
            {
                name: "残废",
                tags: ["减速", "减伤"],
                trigger: ["skill"],
                effect: function (attacker, defender, rate = 1) {
                },
                priority: 0.3
            },
        ]
    },
    {
        name: "末世",
        type: "physical",
        price: 2160,
        stats: {
            physicalAttack: 60,
            attackSpeed: 0.3,
            physicalLifesteal: 0.1
        },
        passiveList: [
            {
                name: "破败",
                tags: ["伤害"],
                trigger: ["normal"],
                effect: function (attacker, defender, rate = 1) {
                    attacker.damageNAList[defender].push({
                        source: "末世",
                        type: "physical",
                        value: 0.08 * defender.getStat("maxHP"),
                        rate: rate
                    });
                },
                rate: 0.3,
                priority: 0.08
            },
        ]
    },
    {
        name: "泣血之刃",
        type: "physical",
        price: 1800,
        stats: {
            maxHP: 500,
            physicalAttack: 100,
            physicalLifesteal: 0.25
        },
        passiveList: [
            {
                name: "回魂",
                tags: ["治疗"],
                trigger: ["defend"],
                effect: function (attacker, defender, rate = 1) {
                    defender.healList[attacker].push({
                        value: growByLevel(defender.level, 400, 610),
                        cooldown: 20,
                        rate: rate
                    });
                },
                rate: 0.5,
                cooldown: 20,
                priority: 610
            },
        ]
    },
    {
        name: "无尽战刃",
        type: "physical",
        price: 2110,
        stats: {
            physicalAttack: 120,
            criticalRate: 0.2
        },
        passiveList: [
            {
                name: "无尽",
                tags: ["暴伤"],
                trigger: ["stats"],
                effect: function (holder, rate = 1) {
                    holder.extraStats.add({criticalDamage: Math.min(0.5, 0.2 + 0.01 * Math.floor(holder.getStat("criticalRate") / 0.02))})
                },
                priority: 0.5
            },
        ]
    },
    {
        name: "宗师之力",
        type: "physical",
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
                tags: ["加速", "伤害"],
                trigger: ["normal"],
                effect: function (attacker, defender, rate = 1) {
                    attacker.damageCDList[defender].push({
                        source: "宗师之力",
                        type: "physical",
                        value: 0.8 * attacker.getStat("physicalAttack"),
                        cooldown: 3,
                        rate: rate
                    });
                },
                rate: 0.6,
                cooldown: 3,
                priority: 0.8
            },
        ]
    },
    {
        name: "闪电匕首",
        type: "physical",
        price: 1840,
        stats: {
            attackSpeed: 0.35,
            moveSpeed: 0.08
        },
        passiveList: [
            {
                name: "电弧",
                tags: ["伤害"],
                trigger: ["normal"],
                effect: function (attacker, defender, rate = 1) {
                    attacker.damageNAList[defender].push({
                        source: "闪电匕首",
                        type: "magic",
                        value: growByLevel(attacker.level, 40, 82) + growByLevel(attacker.level, 140, 420) / 3,
                        rate: rate
                    });
                },
                priority: 420
            },
        ]
    },
    {
        name: "影刃",
        type: "physical",
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
                tags: ["攻速", "加速"],
                trigger: ["stats"],
                effect: function (holder, rate = 1) {
                    holder.extraStats.add({
                        attackSpeed: 0.2 * rate,
                        moveSpeed: 0.05 * rate
                    });
                },
                priority: 0.2
            },
        ]
    },
    {
        name: "暗影战斧",
        type: "physical",
        price: 2090,
        stats: {
            maxHP: 500,
            physicalAttack: 80,
            cooldownReduction: 0.1
        },
        passiveList: [
            {
                name: "切割",
                tags: ["物穿"],
                trigger: ["stats"],
                effect: function (holder, rate = 1) {
                    holder.extraStats.add({physicalPenetration: growByLevel(holder.level, 90, 180)});
                },
                priority: 180
            },
        ]
    },
    {
        name: "强者破军",
        type: "physical",
        price: 2540,
        stats: {
            physicalAttack: 150,
            cooldownReduction: 0.05
        },
        passiveList: [
            {
                name: "破军",
                tags: ["增伤"],
                trigger: ["stats"],
                effect: function (holder, rate = 1) {
                    holder.extraStats.add({damageIncreased: 0.3 * rate});
                },
                rate: 0.4,
                priority: 0.3
            },
        ]
    },
    {
        name: "逐日之弓",
        type: "physical",
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
                tags: ["精准"],
                trigger: ["stats"],
                effect: function (holder, rate = 1) {
                    holder.extraStats.add({precision: holder.getStat("attackRange") === 'ranged' ? 50: 25});
                },
                priority: 25
            },
        ],
        active: {
            name: "逐日",
            tags: ["射程", "加速"],
            effect: function (holder, rate = 1) {
            },
            cooldown: 60,
        }
    },
    {
        name: "仁者破晓",
        type: "physical",
        price: 2570,
        stats: {
            physicalAttack: 90,
            attackSpeed: 0.3,
            criticalRate: 0.1
        },
        passiveList: [
            {
                name: "破甲",
                tags: ["物穿"],
                trigger: ["stats"],
                effect: function (holder, rate = 1) {
                    holder.extraStats.add({physicalPenetrationPercent: holder.getStat("attackRange") === 'ranged' ? 0.3: 0.15});
                },
                priority: 0.15
            },
            {
                name: "破晓",
                tags: ["精准"],
                trigger: ["stats"],
                effect: function (holder, rate = 1) {
                    holder.extraStats.add({precision: holder.getStat("attackRange") === 'ranged' ? 50: 25});
                },
                priority: 25
            },
        ]
    },
    {
        name: "逐风",
        type: "physical",
        price: 2090,
        stats: {
            maxHP: 700,
            physicalAttack: 65,
            attackSpeed: 0.25
        },
        passiveList: [
            {
                name: "逐风",
                tags: ["攻速", "增伤"],
                trigger: ["stats"],
                effect: function (holder, rate = 1) {
                    holder.extraStats.add({
                        attackSpeed: 0.07 * 5 * rate,
                        damageIncreased: 0.03 * 5 * rate
                    });
                },
                rate: 0.7,
                priority: 0.07
            }
        ]
    },


];
const runeData = [
    {
        name: "传承",
        color: "red",
        stats: {
            physicalAttack: 3.2
        },
        level: 5
    },
    {
        name: "无双",
        color: "red",
        stats: {
            criticalRate: 0.07,
            criticalDamage: 0.036
        },
        level: 5
    },
    {
        name: "纷争",
        color: "red",
        stats: {
            physicalAttack: 2.5,
            physicalLifesteal: 0.005
        },
        level: 5
    },
    {
        name: "红月",
        color: "red",
        stats: {
            attackSpeed: 0.016,
            criticalRate: 0.005
        },
        level: 5
    },
    {
        name: "异变",
        color: "red",
        stats: {
            physicalAttack: 2,
            physicalPenetration: 3.6
        },
        level: 5
    },
    {
        name: "宿命",
        color: "red",
        stats: {
            attackSpeed: 0.01,
            maxHP: 33.7,
            physicalDefense: 2.3
        },
        level: 5
    },
    {
        name: "祸源",
        color: "red",
        stats: {
            criticalRate: 0.016
        },
        level: 5
    },
    {
        name: "长生",
        color: "blue",
        stats: {
            maxHP: 75
        },
        level: 5
    },
    {
        name: "狩猎",
        color: "blue",
        stats: {
            attackSpeed: 0.01,
            moveSpeed: 0.01
        },
        level: 5
    },
    {
        name: "夺萃",
        color: "blue",
        stats: {
            physicalLifesteal: 0.016
        },
        level: 5
    },
    {
        name: "兽痕",
        color: "blue",
        stats: {
            maxHP: 60,
            criticalRate: 0.005
        },
        level: 5
    },
    {
        name: "繁荣",
        color: "blue",
        stats: {
            physicalLifesteal: 0.01,
            magicDefense: 4.1
        },
        level: 5
    },
    {
        name: "调和",
        color: "blue",
        stats: {
            maxHP: 45,
            hpRegen: 5.2 / 5,
            moveSpeed: 0.004
        },
        level: 5
    },
    {
        name: "鹰眼",
        color: "green",
        stats: {
            physicalAttack: 0.9,
            physicalPenetration: 6.4
        },
        level: 5
    },
    {
        name: "怜悯",
        color: "green",
        stats: {
            cooldownReduction: 0.01
        },
        level: 5
    },
    {
        name: "霸者",
        color: "green",
        stats: {
            physicalDefense: 9
        },
        level: 5
    },
    {
        name: "均衡",
        color: "green",
        stats: {
            physicalDefense: 5,
            magicDefense: 5
        },
        level: 5
    },
    {
        name: "虚空",
        color: "green",
        stats: {
            maxHP: 37.5,
            cooldownReduction: 0.006
        },
        level: 5
    },
    {
        name: "灵山",
        color: "green",
        stats: {
            magicDefense: 9
        },
        level: 5
    },
    {
        name: "回声",
        color: "green",
        stats: {
            physicalDefense: 2.7,
            magicDefense: 2.7,
            cooldownReduction: 0.006
        },
        level: 5
    },
];


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

function growByLevel(level, min, max) {
    return min + (max - min) * (level - 1) / 14;
}

export {heroData, enemyData, equipmentData, runeData}