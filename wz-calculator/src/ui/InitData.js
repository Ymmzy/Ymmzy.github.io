import Hero from "../game/Hero.js";
import Unit from "../game/Unit.js";
import {HERO_DATA} from "../game/data/HeroData.js";
import {ENEMY_DATA} from "../game/data/EnemyData.js";
import {EQUIPMENT_DATA} from "../game/data/EquipmentData.js";
import {RUNE_DATA} from "../game/data/RuneData.js";
import {loadEquipmentRates} from "../game/EquipmentStore.js";
import {CONFIG} from "../config.js";

export function initData() {
    const hero = new Hero(HERO_DATA[0]);
    hero.setEnemy(
        [new Unit(ENEMY_DATA.enemyDPS_1, false), new Unit(ENEMY_DATA.enemyDPS_2, false)],
        [new Unit(ENEMY_DATA.enemyEHP_1, false), new Unit(ENEMY_DATA.enemyEHP_2, false)]
    );
    try {
        const lastSlot = localStorage.getItem('lastSlot');
        const slots = lastSlot && JSON.parse(localStorage.getItem('slotData'));
        const saveData = slots?.[lastSlot] || JSON.parse(localStorage.getItem('saveData'));
        if (saveData) {
            loadEquipmentRates(saveData.equipmentData);
            hero.setSaveData(saveData.hero);
        }
    } catch (error) {
        console.warn(error);
    }
    hero.updateDelta(RUNE_DATA, EQUIPMENT_DATA);

    if (CONFIG.debug.exposeGlobals) {
        window.hero = hero;
        window.equipmentData = EQUIPMENT_DATA;
        window.runeData = RUNE_DATA;
    }

    return hero;
}
