import {RUNE_DATA} from "./Data.js";

export default class Rune {
    constructor(param) {
        // 如果参数是字符串，从 runeData 中查找符文
        if (typeof param === 'string') {
            const rune = RUNE_DATA.find(item => item.name === param);
            if (!rune) {
                throw new Error(`Rune "${param}" not found in runeData!`);
            }
            this.init(rune); // 用查找到的符文对象初始化
        }
        // 如果参数是对象，直接初始化
        else if (typeof param === 'object' && param !== null) {
            this.init(param);
        }
        // 其他情况报错
        else {
            throw new Error('Invalid parameter: expected rune name (string) or rune config (object)');
        }
    }

    // 初始化符文属性
    init({name, color, stats, level = 5}) {
        this.name = name;
        this.color = color;
        this.stats = stats;
        this.level = level;
    }
}