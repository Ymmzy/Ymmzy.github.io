import {DAMAGE_TYPE} from "../constants.js";

export const ENEMY_DATA = {
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
            equipments: ["抵抗之靴", "红莲斗篷", "永夜守护", "反伤刺甲", "霸者重装", "不祥征兆"],
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
            equipments: ["抵抗之靴", "影刃", "无尽战刃", "仁者破晓", "末世", "逐日之弓"],
            runes: [["祸源", 10], ["夺萃", 10], ["鹰眼", 10]]
        }
    },
    enemyEHP_1: {
        name: "物理输出",
        bonusStats: {
            damageType: DAMAGE_TYPE.physical,
            rate: 0.6,
            equipments: ["抵抗之靴", "暗影战斧", "暴烈之甲", "纯净苍穹", "强者破军", "魔女斗篷"],
            runes: [["异变", 10], ["鹰眼", 10], ["狩猎", 10]]
        }
    },
    enemyEHP_2: {
        name: "法术输出",
        bonusStats: {
            damageType: DAMAGE_TYPE.magic,
            rate: 0.4,
            equipments: ["秘法之靴", "占位", "占位", "占位", "虚无法杖", "占位"],
            runes: [["梦魇", 10], ["心眼", 10], ["狩猎", 10]]
        }
    }
};
