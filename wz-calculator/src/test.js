import Hero from "./game/Hero.js"
import {HERO_DATA, ENEMY_DATA, EQUIPMENT_DATA, RUNE_DATA, RUNE_COLOR} from "./game/Data.js"

let hero = null;
let updates = null;

function init() {
    initData();
    initButton();

    updates = [];
    initHeroGrid();
    initEquipmentGrid();
    initRuneGrid();
    initShopGrid();
    initRuneShopGrid();
}

function initData() {
    hero = new Hero(HERO_DATA[0]);
    window.hero = hero;
    window.equipmentData = EQUIPMENT_DATA;
    window.runeData = RUNE_DATA;
    hero.setEnemy(
        [new Hero(ENEMY_DATA.enemyDPS_1), new Hero(ENEMY_DATA.enemyDPS_2)],
        [new Hero(ENEMY_DATA.enemyEHP_1), new Hero(ENEMY_DATA.enemyEHP_2)]
    );
    // hero.addEquipment("影刃");
    // hero.addEquipment("无尽战刃");
    hero.addEquipment("仁者破晓");
    // hero.addEquipment("闪电匕首");
    hero.addEquipment("末世");
    hero.addRune("祸源", 5);
    hero.addRune("宿命", 3);
    hero.addRune("鹰眼", 6);
    hero.addRune("虚空", 1);
    hero.addRune("夺萃", 5);
    hero.addRune("狩猎", 2);
    // hero.addRune("狩猎", 20);
    hero.updateDelta(RUNE_DATA, EQUIPMENT_DATA);
}

function initButton() {
    function getButton(label, onclick) {
        const btn = document.createElement("button");
        btn.classList.add("btn");
        btn.innerText = label;
        btn.onclick = onclick;
        return btn;
    }

    const btnCon = document.querySelector("#buttonContainer");
    btnCon.appendChild(getButton("编辑", event => {
        const json = JSON.stringify(proto.jyf.Character.saveCharacter(mainCharacter.final), null, '\t');
        const textarea = document.createElement("textarea");
        textarea.value = json;
        textarea.classList.add("ag-theme-alpine-dark");
        textarea.classList.add("char-edit");
        const dialog = art.dialog({
            content: textarea,
            padding: '8px 8px 0 8px',
            ok: () => {
                let ok = false;
                proto.jyf.Character.loadCharacter(JSON.parse(textarea.value), char => {
                    //mainCharacter = char;
                    main(mainCharacter);
                    ok = true;
                });
                return ok;
            },
            cancel: true,
            lock: true,
            follow: event.target,
            resize: false,
            drag: false,
            duration: 100,
        });
    }));
    btnCon.appendChild(getButton("导入", () => {
    }));
    btnCon.appendChild(getButton("导出", () => {
    }));
    btnCon.appendChild(getButton("暂存", () => {
    }));
}

function initHeroGrid() {
    const GRID_ID = ["#heroGrid-sub-1", "#heroGrid-sub-2"];
    const DATA_KEYS = {
        CP: "CP",
        price: "价值",
        DPS: "DPS",
        EHP: "EHP",
        DPS_1: "DPS-1",
        EHP_1: "EHP-1",
        DPS_2: "DPS-2",
        EHP_2: "EHP-2",
        name: "英雄",
        level: "等级"
    };
    const STAT_KEYS = {
        maxHP: "生命",
        moveSpeed: "移速",

        physicalDefense: "物防",
        magicDefense: "法防",

        physicalAttack: "物攻",
        physicalLifesteal: "物吸",
        physicalPenetration: "物穿",
        physicalPenetrationPercent: "物穿%",

        magicAttack: "法攻",
        magicLifesteal: "法吸",
        magicPenetration: "法穿",
        magicPenetrationPercent: "法穿%",

        // 战斗属性
        criticalRate: "暴击",
        criticalDamage: "暴伤",
        attackSpeed: "攻速",
        attackRange: "范围",

        // 特殊属性
        cooldownReduction: "冷却",
        precision: "精准",
        damageIncreased: "增伤",
        damageReduction: "免伤",
    };

    const getSubRowData = () => {
        let subRowData = [[], []];
        [
            {key: "CP", value: hero.CP},
            {key: "price", value: hero.totalPrice},
            {key: "DPS", value: hero.DPS.average},
            {key: "EHP", value: hero.EHP.average},
            {key: "DPS_1", value: hero.DPS[0]},
            {key: "EHP_1", value: hero.EHP[0]},
            {key: "DPS_2", value: hero.DPS[1]},
            {key: "EHP_2", value: hero.EHP[1]},
            {key: "name", value: hero.name},
            {key: "level", value: hero.level},
            ...Object.keys(STAT_KEYS).map(key => ({
                key: key,
                value: hero.getStat(key)
            })),
            ...Object.keys(hero.bonusStats).map(key => hero.bonusStats[key])
        ].forEach((row, i) => subRowData[i % 2].push(row));
        return subRowData;
    }
    let subRowData = getSubRowData();

    const gridOptions = {
        defaultColDef: {
            menuTabs: [],
            flex: 1,
        },
        columnDefs: [
            {
                headerName: 'Key',
                field: 'key',
                cellClass: 'min-w-80',
                valueFormatter: params => STAT_KEYS[params.value] || DATA_KEYS[params.value]
            },
            {
                headerName: 'Value',
                field: 'value',
                enableCellChangeFlash: true,
                cellDataType: 'text',
                valueFormatter: params => {
                    if (typeof params.value !== 'number') return params.value;
                    if (params.value === 0) return "";
                    return params.value < 3 ? `${(params.value * 100).toFixed(0)}%` : params.value.toFixed(0);
                }
            }
        ],
        rowClassRules: {
            'bg-add bg-purple': params => params.data.key === "CP",
            'bg-add bg-yellow': params => params.data.key === "price",
            'bg-add bg-red': params => params.data.key.slice(0, 3) === "DPS",
            'bg-add bg-blue': params => params.data.key.slice(0, 3) === "EHP"
        },
        getRowId: params => params.data.key
    };
    const subGridOptions = [
        {...gridOptions, rowData: subRowData[0]},
        {...gridOptions, rowData: subRowData[1]}
    ];

    [0, 1].forEach(i => {
        const element = document.querySelector(GRID_ID[i]);
        element.innerHTML = '';
        new agGrid.Grid(element, subGridOptions[i])
    });

    updates.push(() => {
        const subRowData = getSubRowData();
        subGridOptions[0].api.applyTransaction({update: subRowData[0]});
        subGridOptions[1].api.applyTransaction({update: subRowData[1]});
    });
}

function initEquipmentGrid() {
    const GRID_ID = "#equipmentGrid";
    const getRowData = () => hero.getEquipments();

    const gridOptions = {
        defaultColDef: {
            menuTabs: [],
            enableCellChangeFlash: true,
            flex: 1
        },
        columnDefs: [
            {headerName: "位置", field: "key"},
            {headerName: "名称", field: "name"},
            {headerName: "价格", field: "price"}
        ],
        rowData: getRowData(),
        getRowId: params => params.data.key,
        onRowClicked: params => {
            hero.removeEquipment(params.data.index);
            hero.updateDelta(RUNE_DATA, EQUIPMENT_DATA);
            updates.forEach(update => update());
        }
    }

    const element = document.querySelector(GRID_ID);
    element.innerHTML = '';
    new agGrid.Grid(element, gridOptions);

    updates.push(() => gridOptions.api.applyTransaction({update: getRowData()}));
}

function initRuneGrid() {
    const GRID_ID = "#runeGrid";
    const getRowData = () => hero.getRunes();

    const gridOptions = {
        defaultColDef: {
            menuTabs: [],
            enableCellChangeFlash: true,
            flex: 1
        },
        columnDefs: [
            {headerName: "颜色", field: "color"},
            {headerName: "名称", field: "name", flex: 1.6},
            {headerName: "数量", field: "count",filter: 'agNumberColumnFilter'}
        ],
        rowClassRules: {
            'bg-add bg-red': params => params.data.color === RUNE_COLOR.red,
            'bg-add bg-blue': params => params.data.color === RUNE_COLOR.blue,
            'bg-add bg-green': params => params.data.color === RUNE_COLOR.green
        },
        rowData: getRowData(),
        // isRowFiltered : node => node.data.count === 0,
        getRowId: params => params.data.name,
        onRowClicked: params => {
            hero.removeRune(params.data.name);
            hero.updateDelta(RUNE_DATA, EQUIPMENT_DATA);
            updates.forEach(update => update());
        }
    }

    const element = document.querySelector(GRID_ID);
    element.innerHTML = '';
    new agGrid.Grid(element, gridOptions);
    gridOptions.api.setFilterModel({
        count: {
            filterType: 'number', // 明确指定筛选类型
            type: 'notEqual',     // 筛选类型
            filter: 0            // 筛选值
        }
    });

    updates.push(() => gridOptions.api.applyTransaction({update: getRowData()}));

}

function initShopGrid() {
    const GRID_ID = "#shopGrid";
    const STAT_KEYS_1 = {
        maxHP: "生命",
        physicalDefense: "物防",
        magicDefense: "法防",
        moveSpeed: "移速",

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
            ...equipment.stats,
            passive_1: equipment.passiveList[0] ? equipment.passiveList[0].tags.join(" "): null,
            passiveRate_1: equipment.passiveList[0] ? equipment.passiveList[0].rate: null,
            passive_2: equipment.passiveList[1] ? equipment.passiveList[1].tags.join(" "): null,
            passiveRate_2: equipment.passiveList[1] ? equipment.passiveList[1].rate: null,
            active: equipment.active? equipment.active.tags.join(" "): null,
            activeRate: equipment.active? equipment.active.rate: null
        }));
    };
    const gridOptions = {
        defaultColDef: {
            sortable: true,
            sortingOrder: ['desc', 'asc'],
            menuTabs: [],
            enableCellChangeFlash: true,
            minWidth: 60,
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
                headerName: "类型",
                field: "type",
                width: 60,
                pinned: 'left'
            },
            {
                headerName: "△CP",
                field: "deltaCP",
                width: 60,
                pinned: 'left',
                valueFormatter: params => params.value.toFixed(0),
                cellClass: 'bg-add bg-purple'
            },
            {
                headerName: "△DPS",
                field: "deltaDPS",
                width: 60,
                pinned: 'left',
                valueFormatter: params => params.value.toFixed(0),
                cellClass: 'bg-add bg-red'
            },
            {
                headerName: "△EHP",
                field: "deltaEHP",
                width: 60,
                pinned: 'left',
                valueFormatter: params => params.value.toFixed(0),
                cellClass: 'bg-add bg-blue'
            },
            ...Object.keys(STAT_KEYS_1).map(key => ({headerName: STAT_KEYS_1[key], field: key})),
            {headerName: "被动1", field: "passive_1", minWidth: 84, flex: 2},
            {headerName: "应用", field: "passiveRate_1"},
            {headerName: "被动2", field: "passive_2", minWidth: 84, flex: 2},
            {headerName: "应用", field: "passiveRate_2"},
            {headerName: "主动", field: "active", minWidth: 84, flex: 2},
            {headerName: "应用", field: "activeRate"},
            ...Object.keys(STAT_KEYS_2).map(key => ({headerName: STAT_KEYS_2[key], field: key})),
        ],
        rowData: getRowData(),
        getRowId: params => params.data.name,
        onRowClicked: params => {
            hero.addEquipment(params.data.name);
            hero.updateDelta(RUNE_DATA, EQUIPMENT_DATA);
            updates.forEach(update => update());
        }
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

function initRuneShopGrid() {
    const GRID_ID = "#runeShopGrid";
    const STAT_KEYS = {
        maxHP: "生命",
        physicalDefense: "物防",
        magicDefense: "法防",
        attackSpeed: "攻速",
        moveSpeed: "移速",
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
            ...rune.stats
        }));
    };

    const gridOptions = {
        defaultColDef: {
            sortable: true,
            sortingOrder: ['desc', 'asc'],
            menuTabs: [],
            enableCellChangeFlash: true,
            minWidth: 60,
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
                headerName: "颜色",
                field: "color",
                width: 60,
                pinned: 'left'
            },
            {
                headerName: "△CP",
                field: "deltaCP",
                width: 60,
                pinned: 'left',
                valueFormatter: params => params.value.toFixed(0),
                cellClass: 'bg-add bg-purple'
            },
            {
                headerName: "△DPS",
                field: "deltaDPS",
                width: 60,
                pinned: 'left',
                valueFormatter: params => params.value.toFixed(0),
                cellClass: 'bg-add bg-red'
            },
            {
                headerName: "△EHP",
                field: "deltaEHP",
                width: 60,
                pinned: 'left',
                valueFormatter: params => params.value.toFixed(0),
                cellClass: 'bg-add bg-blue'
            },
            ...Object.keys(STAT_KEYS).map(key => ({headerName: STAT_KEYS[key], field: key}))
        ],
        rowData: getRowData(),
        getRowId: params => params.data.name,
        onRowClicked: params => {
            hero.addRune(params.data.name);
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

init();