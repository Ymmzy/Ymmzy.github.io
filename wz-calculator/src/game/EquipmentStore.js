import {EQUIPMENT_DATA} from "./data/EquipmentData.js";
import {CONFIG} from "../config.js";

export function saveEquipmentRates() {
    if (CONFIG.debug.logSaveLoad) console.log("====== Save Equipments ======");
    return EQUIPMENT_DATA.flatMap(equipment => {
        const data = {};
        if (equipment.active?.rateChanged) data.active = equipment.active.rate;
        equipment.passiveList.forEach((p, i) => {
            if (p?.rateChanged) (data.passiveList ??= [])[i] = p.rate;
        });
        return Object.keys(data).length ? [{name: equipment.name, ...data}] : [];
    });
}

export function loadEquipmentRates(saveData) {
    if (CONFIG.debug.logSaveLoad) {
        console.log("====== Load Equipments ======");
        console.log(saveData);
    }

    const restoreRate = skill => { skill.rate = skill.oldRate; skill.rateChanged = false; };
    const changeRate = (skill, rate) => { skill.oldRate = skill.rate; skill.rate = rate; skill.rateChanged = true; };
    const slots = eq => [eq.active, ...eq.passiveList];

    EQUIPMENT_DATA.forEach(eq => slots(eq).forEach(s => s?.rateChanged && restoreRate(s)));

    saveData.forEach(data => {
        const eq = EQUIPMENT_DATA.find(e => e.name === data.name);
        if (data.active) changeRate(eq.active, data.active);
        data.passiveList?.forEach((rate, i) => rate != null && changeRate(eq.passiveList[i], rate));
    });
}
