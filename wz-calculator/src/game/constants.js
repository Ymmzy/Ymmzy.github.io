import {calculatePolynomial} from "./utils.js";

const AS_COEFFICIENTS = [8.21793E-09, -4.60542E-06, 1.05739E-03, -1.43292E-01];

function createAttackSpeedModel(baseFrames) {
    return {
        calculateAttackTime: (attackSpeed) =>
            0.066 * calculatePolynomial(4, [...AS_COEFFICIENTS, baseFrames], attackSpeed)
    };
}

export const ATTACK_SPEED_MODEL = {
    A: createAttackSpeedModel(1.71208E+01),
    C: createAttackSpeedModel(1.61208E+01),
};

export const DAMAGE_TYPE = {
    physical: "物理",
    magic: "法术",
    real: "真实"
};

export const EQUIPMENT_TYPE = {
    "physical": "攻击",
    "magic": "法术",
    "defense": "防御",
    "move": "移动",
    "jungle": "打野",
    "support": "辅助"
};

export const SKILL_TAG = {
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
    cooldownReduction: "冷却",
    revive: "复活"
};

export const TRIGGER = {
    normalAttack: "普攻",
    skill: "技能",
    defend: "受击",
    auto: "自动"
};

export const RUNE_COLOR = {
    red: "红",
    blue: "蓝",
    green: "绿"
};

export const STAT = {
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
};
