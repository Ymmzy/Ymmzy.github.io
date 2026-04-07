import {EQUIPMENT_DATA} from "../game/data/EquipmentData.js";
import {RUNE_DATA} from "../game/data/RuneData.js";

export function initShopGrid(hero, updates) {
    const GRID_ID = "#shopGrid";
    const STAT_KEYS_1 = {
        maxHP: "生命",
        physicalDefense: "物防",
        magicDefense: "法防",
        moveSpeedIncreased: "移速",

        physicalAttack: "物攻",
        criticalRate: "暴击",
        attackSpeed: "攻速",
        cooldownReduction: "冷却",
        physicalLifesteal: "物吸",
    }
    const STAT_KEYS_2 = {
        magicAttack: "法攻",
        maxMP: "法力",
        hpRegen: "回血",
        mpRegen: "回蓝",
    }
    const getRowData = () => {
        return EQUIPMENT_DATA.map(equipment => ({
            name: equipment.name,
            type: equipment.type,
            price: equipment.price,
            deltaCP: equipment.delta.CP,
            deltaDPS: equipment.delta.DPS,
            deltaEHP: equipment.delta.EHP,
            effective: equipment.delta.CP / equipment.price,
            ...equipment.stats,
            passive_1: equipment.passiveList[0] ? equipment.passiveList[0].tags.join(" ") : null,
            passiveRate_1: equipment.passiveList[0] ? equipment.passiveList[0].rate : null,
            passive_2: equipment.passiveList[1] ? equipment.passiveList[1].tags.join(" ") : null,
            passiveRate_2: equipment.passiveList[1] ? equipment.passiveList[1].rate : null,
            active: equipment.active ? equipment.active.tags.join(" ") : null,
            activeRate: equipment.active ? equipment.active.rate : null
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
                pinned: 'left'
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
                headerName: "性价",
                field: "effective",
                width: 60,
                flex: 0,
                valueFormatter: params => (params.value * 100).toFixed(0),
                cellClass: 'bg-add bg-yellow'
            },
            {
                headerName: "应用 ⏵ 被动1",
                field: "passiveRate_1",
                maxWidth: 55,
                headerClass: 'header-merged-left',
                editable: params => params.data[params.colDef.field] !== null,
                cellStyle: {padding: '2px'},
                cellRenderer: params => params.value === null ? '' : `<div class="editable-cell">${params.value}</div>`
            },
            {
                headerName: "被动1",
                field: "passive_1",
                minWidth: 84,
                headerClass: 'header-merged-right'
            },
            {
                headerName: "应用 ⏵ 被动2",
                field: "passiveRate_2",
                maxWidth: 55,
                headerClass: 'header-merged-left',
                editable: params => params.data[params.colDef.field] !== null,
                cellStyle: {padding: '2px'},
                cellRenderer: params => params.value === null ? '' : `<div class="editable-cell">${params.value}</div>`
            },
            {
                headerName: "被动2",
                field: "passive_2",
                minWidth: 84,
                headerClass: 'header-merged-right'
            },
            {
                headerName: "应用 ⏵ 主动",
                field: "activeRate",
                maxWidth: 55,
                headerClass: 'header-merged-left',
                editable: params => params.data[params.colDef.field] !== null,
                cellStyle: {padding: '2px'},
                cellRenderer: params => params.value === null ? '' : `<div class="editable-cell">${params.value}</div>`
            },
            {
                headerName: "主动",
                field: "active",
                minWidth: 84,
                headerClass: 'header-merged-right'
            },
            ...Object.keys(STAT_KEYS_1).map(key => ({headerName: STAT_KEYS_1[key], field: key})),
            ...Object.keys(STAT_KEYS_2).map(key => ({headerName: STAT_KEYS_2[key], field: key})),
        ],
        rowData: getRowData(),
        getRowId: params => params.data.name,
        onCellClicked: params => {
            if (params.colDef.field.includes("Rate") && params.value !== null) return;
            hero.addEquipment(params.data.name);
            hero.updateDelta(RUNE_DATA, EQUIPMENT_DATA);
            updates.forEach(update => update());
        },
        onCellValueChanged: params => {
            const equipment = EQUIPMENT_DATA.find(e => e.name === params.data.name);
            const rateMap = {
                passiveRate_1: equipment.passiveList[0],
                passiveRate_2: equipment.passiveList[1],
                activeRate: equipment.active
            };
            const skill = rateMap[params.colDef.field];
            if (!skill) return;
            const newRate = Number(params.value);
            if (!skill.rateChanged) skill.oldRate = skill.rate;
            skill.rate = newRate;
            skill.rateChanged = newRate !== skill.oldRate;
            hero.updateStats();
            hero.updateDelta(RUNE_DATA, EQUIPMENT_DATA);
            updates.forEach(fn => fn());
        },
        singleClickEdit: true,
        stopEditingWhenCellsLoseFocus: true
    }

    const element = document.querySelector(GRID_ID);
    element.innerHTML = '';
    new agGrid.Grid(element, gridOptions);
    gridOptions.columnApi.applyColumnState({
        state: [{colId: 'deltaCP', sort: 'desc'}],
        defaultState: {sort: null},
    });
    gridOptions.api.setAnimateRows(true);

    updates.push(() => gridOptions.api.applyTransaction({update: getRowData()}));
}
