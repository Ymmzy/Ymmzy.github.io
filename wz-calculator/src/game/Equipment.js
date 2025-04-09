import {EQUIPMENT_DATA} from "./Data.js"

export default class Equipment {
    constructor(param) {
        // 如果参数是字符串，从 equipmentData 中查找匹配的装备
        if (typeof param === 'string') {
            const equipment = EQUIPMENT_DATA.find(item => item.name === param);
            if (!equipment) {
                throw new Error(`Equipment "${param}" not found!`);
            }
            // 使用找到的装备对象初始化
            this.init(equipment);
        }
        // 如果参数是对象，直接初始化
        else if (typeof param === 'object') {
            this.init(param);
        }
        // 其他情况报错
        else {
            throw new Error('Invalid parameter: expected string or object');
        }
    }

    // 初始化装备属性
    init({ name, type, price, stats, active = undefined, passiveList = [] }) {
        this.name = name;
        this.type = type;
        this.price = price;
        this.stats = stats;
        this.active = active;
        this.passiveList = passiveList;
    }
}

Equipment.getSaveData = () => {
    console.log("====== Save Equipments ======");
    return EQUIPMENT_DATA.flatMap(equipment => {
        let data = {};
        if (equipment.active?.rateChanged) data.active = equipment.active.rate;
        if (equipment.passiveList[0]?.rateChanged) (data.passiveList ??= [])[0] = equipment.passiveList[0].rate;
        if (equipment.passiveList[1]?.rateChanged) (data.passiveList ??= [])[1] = equipment.passiveList[1].rate;
        if (Object.keys(data).length === 0) {
            return [];
        } else {
            return {
                name: equipment.name,
                ...data
            }
        }
    });
}

Equipment.setSaveData = (saveData) => {
    console.log("====== Load Equipments ======");
    console.log(saveData);

    const restoreRate = skill => {
        skill.rate = skill.oldRate;
        skill.rateChanged = false;
    }

    const changeRate = (skill, newRate) => {
        skill.oldRate = skill.rate;
        skill.rate = newRate;
        skill.rateChanged = true;
    }

    EQUIPMENT_DATA.forEach(equipment => {
        if (equipment.active?.rateChanged) restoreRate(equipment.active);
        if (equipment.passiveList[0]?.rateChanged) restoreRate(equipment.passiveList[0]);
        if (equipment.passiveList[1]?.rateChanged) restoreRate(equipment.passiveList[1]);
    })

    saveData.forEach(data => {
        let equipment = EQUIPMENT_DATA.find(equipment => equipment.name === data.name);
        if (data.active) changeRate(equipment.active, data.active);
        if (data.passiveList?.[0]) changeRate(equipment.passiveList[0], data.passiveList[0]);
        if (data.passiveList?.[1]) changeRate(equipment.passiveList[1], data.passiveList[1]);
    })
}