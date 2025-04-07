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