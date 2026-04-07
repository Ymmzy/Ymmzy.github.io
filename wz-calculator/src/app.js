import {CONFIG} from "./config.js";
import {initData} from "./ui/InitData.js";
import {initButton} from "./ui/ButtonBar.js";
import {initHeroGrid} from "./ui/HeroGrid.js";
import {initEquipmentGrid} from "./ui/EquipmentGrid.js";
import {initRuneGrid} from "./ui/RuneGrid.js";
import {initShopGrid} from "./ui/ShopGrid.js";
import {initRuneShopGrid} from "./ui/RuneShopGrid.js";

function init() {
    console.warn("版本：" + CONFIG.VERSION);

    const hero = initData();
    const updates = [];

    initButton(hero, updates);
    initHeroGrid(hero, updates);
    initEquipmentGrid(hero, updates);
    initRuneGrid(hero, updates);
    initShopGrid(hero, updates);
    initRuneShopGrid(hero, updates);
}

document.addEventListener('touchstart', () => {}, {passive: true});

init();
