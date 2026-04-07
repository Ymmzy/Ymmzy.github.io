import {RUNE_COLOR} from "../game/constants.js";
import {EQUIPMENT_DATA} from "../game/data/EquipmentData.js";
import {RUNE_DATA} from "../game/data/RuneData.js";

export function initRuneShopGrid(hero, updates) {
    const GRID_ID = "#runeShopGrid";
    const STAT_KEYS = {
        maxHP: "生命",
        physicalDefense: "物防",
        magicDefense: "法防",
        attackSpeed: "攻速",
        moveSpeedIncreased: "移速",
        physicalAttack: "物攻",
        physicalPenetration: "物穿",
        physicalLifesteal: "物吸",
        criticalRate: "暴击",
        criticalDamage: "暴伤",
        cooldownReduction: "冷却",
        magicAttack: "法攻",
        magicPenetration: "法穿",
        magicLifesteal: "法吸",
        hpRegen: "回血",
    }
    const getRowData = () => {
        return RUNE_DATA.map(rune => ({
            name: rune.name,
            color: rune.color,
            deltaCP: rune.delta.CP,
            deltaDPS: rune.delta.DPS,
            deltaEHP: rune.delta.EHP,
            max: "最大",
            ...rune.stats
        }));
    };

    const gridOptions = {
        defaultColDef: {
            sortable: true,
            sortingOrder: ['desc', 'asc'],
            menuTabs: [],
            enableCellChangeFlash: true,
            suppressMovable: true,
            minWidth: 55,
            flex: 1
        },
        columnDefs: [
            {
                headerName: "名称",
                field: "name",
                width: 80,
                pinned: 'left',
                cellRenderer: params => {
                    const name = params.value;
                    const color = Object.keys(RUNE_COLOR).find(key => RUNE_COLOR[key] === params.data.color);
                    return `${name} <span style="color: ${color}; opacity: 0.8; font-weight: bold;">■</span>`;
                }
            },
            {
                headerName: "△CP",
                field: "deltaCP",
                width: 55,
                pinned: 'left',
                valueFormatter: params => params.value.toFixed(0),
                cellClass: 'bg-add bg-purple'
            },
            {
                headerName: "△DPS",
                field: "deltaDPS",
                width: 60,
                flex: 0,
                valueFormatter: params => params.value.toFixed(0),
                cellClass: 'bg-add bg-red'
            },
            {
                headerName: "△EHP",
                field: "deltaEHP",
                width: 60,
                flex: 0,
                valueFormatter: params => params.value.toFixed(0),
                cellClass: 'bg-add bg-blue'
            },
            {
                headerName: "操作",
                field: "max",
                width: 60,
                flex: 0,
                cellRenderer: params => {
                    return `<button>最大</button>`;
                }
            },
            ...Object.keys(STAT_KEYS).map(key => ({headerName: STAT_KEYS[key], field: key}))
        ],
        rowData: getRowData(),
        getRowId: params => params.data.name,
        onCellClicked: params => {
            if (params.colDef.field === "max") {
                hero.addRune(params.data.name, 10);
            } else {
                hero.addRune(params.data.name);
            }
            hero.updateDelta(RUNE_DATA, EQUIPMENT_DATA);
            updates.forEach(update => update());
        }
    }

    const element = document.querySelector(GRID_ID);
    element.innerHTML = '';
    new agGrid.Grid(element, gridOptions);
    gridOptions.api.setAnimateRows(true);
    gridOptions.columnApi.applyColumnState({
        state: [{colId: 'deltaCP', sort: 'desc'}],
        defaultState: {sort: null},
    });

    updates.push(() => gridOptions.api.applyTransaction({update: getRowData()}));
}
