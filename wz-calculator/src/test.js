import Hero from "./game/Hero.js"
import {HERO_DATA, ENEMY_DATA, EQUIPMENT_DATA, RUNE_DATA, RUNE_COLOR, DAMAGE_TYPE} from "./game/Data.js"
import Equipment from "./game/Equipment.js";

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
    hero.setEnemy(
        [new Hero(ENEMY_DATA.enemyDPS_1, false), new Hero(ENEMY_DATA.enemyDPS_2, false)],
        [new Hero(ENEMY_DATA.enemyEHP_1, false), new Hero(ENEMY_DATA.enemyEHP_2, false)]
    );
    let saveData = JSON.parse(localStorage.getItem('saveData'));
    if (saveData) {
        Equipment.setSaveData(saveData.equipmentData);
        hero.setSaveData(saveData.hero);
    }
    hero.updateDelta(RUNE_DATA, EQUIPMENT_DATA);

    window.hero = hero;
    window.equipmentData = EQUIPMENT_DATA;
    window.runeData = RUNE_DATA;
}

function initButton() {
    const getButton = (label, onclick) => {
        const btn = document.createElement("button");
        btn.classList.add("btn");
        btn.innerText = label;
        btn.onclick = onclick;
        return btn;
    }

    const btnContainer = document.querySelector("#buttonContainer");
    btnContainer.appendChild(getButton("编辑", event => {
        const json = JSON.stringify({
            hero: hero.getSaveData(),
            equipmentData: Equipment.getSaveData()
        },null, '\t');
        const textarea = document.createElement("textarea");
        textarea.value = json;
        textarea.classList.add("ag-theme-alpine-dark");
        textarea.classList.add("char-edit");
        art.dialog({
            content: textarea,
            padding: '8px 8px 0 8px',
            ok: () => {
                let data = JSON.parse(textarea.value);
                Equipment.setSaveData(data.equipmentData);
                hero.setSaveData(data.hero);
                hero.updateDelta(RUNE_DATA, EQUIPMENT_DATA);
                updates.forEach(update => update());
                return true;
            },
            cancel: true,
            lock: true,
            follow: event.target,
            resize: false,
            drag: false,
            duration: 100,
        });
    }));
    btnContainer.appendChild(getButton("导入", () => {
        function handleFileSelect(event) {
            const file = event.target.files[0];

            const reader = new FileReader();
            reader.onload = event => {
                const result = event.target.result
                if (typeof result === "string") {
                    const data = JSON.parse(result);

                    Equipment.setSaveData(data.equipmentData);
                    hero.setSaveData(data.hero);
                    hero.updateDelta(RUNE_DATA, EQUIPMENT_DATA);
                    updates.forEach(update => update());
                } else {
                    console.warn("导入文件格式错误");
                }
            };

            reader.readAsText(file);
        }

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', handleFileSelect, false);

        fileInput.click();
    }));
    btnContainer.appendChild(getButton("导出", () => {
        const filename = hero.exportFileName() + ".json";

        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([JSON.stringify({
            hero: hero.getSaveData(),
            equipmentData: Equipment.getSaveData()
        }, null, '\t')], {type: 'application/json'}));
        link.download = filename;
        link.click();
    }));
    btnContainer.appendChild(getButton("暂存", () => localStorage.setItem('saveData', JSON.stringify({
        hero: hero.getSaveData(),
        equipmentData: Equipment.getSaveData()
    }))));
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

        // magicAttack: "法攻",
        // magicLifesteal: "法吸",
        // magicPenetration: "法穿",
        // magicPenetrationPercent: "法穿%",

        // 战斗属性
        criticalRate: "暴击",
        criticalDamage: "暴伤",
        attackSpeed: "攻速",
        attackTime: "间隔",
        cooldownReduction: "冷却",
        attackRange: "范围",

        // 特殊属性
        precision: "精准",
        damageIncreased: "增伤",
        damageReduction: "免伤",
        physicalDamageReduction: "物免",
        healIncreased: "增疗"

    };
    const TOOLTIP_KEYS = ["DPS_1", "EHP_1", "DPS_2", "EHP_2"];

    const getSubRowData = () => {
        let subRowData = [[], []];
        [
            {key: "CP", value: hero.CP},
            {key: "price", value: hero.totalPrice},
            {key: "DPS", value: hero.DPS.average},
            {key: "EHP", value: hero.EHP.average},
            {key: "DPS_1", value: hero.DPS[0], enemy: hero.enemiesDPS[0].name},
            {key: "EHP_1", value: hero.EHP[0], enemy: hero.enemiesEHP[0].name},
            {key: "DPS_2", value: hero.DPS[1], enemy: hero.enemiesDPS[1].name},
            {key: "EHP_2", value: hero.EHP[1], enemy: hero.enemiesEHP[1].name},
            {key: "name", value: hero.name},
            {key: "level", value: hero.level},
            ...Object.keys(STAT_KEYS).map(key => ({
                key: key,
                value: hero.getStat(key)
            })),
            ...Object.keys(hero.bonusStats).filter(key => typeof hero.bonusStats[key] === 'object').map(key => hero.bonusStats[key])
        ].forEach((row, i) => subRowData[i % 2].push(row));
        return subRowData;
    }
    let subRowData = getSubRowData();

    class CustomTooltip {
        init(params) {
            this.eGui = document.createElement('div');
            if (TOOLTIP_KEYS.includes(params.data.key)) {
                this.eGui.className = 'custom-tooltip';
                this.children = [document.createElement('div'), document.createElement('div')];
                this.getGui().append(...this.children);
                if (params.data.key.includes("DPS")) {
                    let gridOptions = {
                        defaultColDef: {
                            menuTabs: [],
                            flex: 1
                        },
                        columnDefs: [
                            {headerName: '来源', field: 'source', minWidth: 84},
                            {headerName: '类型', field: 'type'},
                            {headerName: '伤害', field: 'value', valueFormatter: params => params.value.toFixed(0)},
                            {headerName: '冷却', field: 'cooldown'},
                            {headerName: '应用', field: 'rate'},
                        ]
                    }
                    if (hero.damageNAList[params.data.enemy].length) {
                        new agGrid.Grid(this.children[0], {
                            ...gridOptions,
                            rowData: hero.damageNAList[params.data.enemy].map(damage => ({...damage, cooldown: "-"}))
                        });
                    } else {
                        this.children[0].remove();
                    }
                    if (hero.damageCDList[params.data.enemy].length) {
                        new agGrid.Grid(this.children[1], {
                            ...gridOptions,
                            rowData: hero.damageCDList[params.data.enemy]
                        });
                    } else {
                        this.children[1].remove();
                    }
                } else {
                    let gridOptions = {
                        defaultColDef: {
                            menuTabs: [],
                            flex: 1
                        },
                        columnDefs: [
                            {headerName: '来源', field: 'source', minWidth: 84},
                            {headerName: '类型', field: 'type'},
                            {headerName: '数值', field: 'value', valueFormatter: params => params.value.toFixed(0)},
                            {headerName: '冷却', field: 'cooldown'},
                            {headerName: '应用', field: 'rate'},
                        ]
                    }
                    if (hero.healList[params.data.enemy].length) {
                        new agGrid.Grid(this.children[0], {
                            ...gridOptions,
                            rowData: hero.healList[params.data.enemy].map(heal => ({...heal, type: "-"}))
                        });
                    } else {
                        this.children[0].remove();
                    }
                    if (hero.shieldList[params.data.enemy].length) {
                        new agGrid.Grid(this.children[1], {
                            ...gridOptions,
                            rowData: hero.shieldList[params.data.enemy].map(shield => ({
                                ...shield,
                                type: shield.types.includes(DAMAGE_TYPE.real) ? "真实" : shield.types.length === 1 ? shield.types[0] : "普通"
                            }))
                        });
                    } else {
                        this.children[1].remove();
                    }
                }
                this.popupDiv = [...document.body.children].slice(-2);
            }
        }

        getGui() {
            return this.eGui;
        }

        destroy() {
            this.popupDiv?.forEach(div => div.remove());
        }
    }

    const gridOptions = {
        defaultColDef: {
            menuTabs: [],
            flex: 1
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
                    if (params.data.key === "attackTime") return params.value.toFixed(3);
                    if (typeof params.value !== 'number') return params.value;
                    if (params.value === 0) return "";
                    return params.value < 3 ? `${Math.floor(params.value * 100)}%` : Math.floor(params.value);
                },
                tooltipField: "value",
                tooltipComponent: 'customTooltip', // 使用自定义 tooltip,
            }
        ],
        components: {
            customTooltip: CustomTooltip
        },
        tooltipShowDelay: 0,
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
            suppressMovable: true,
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
    const getRowData = () => {
        let runes = hero.getRunes();
        runes.forEach(rune => rune.clear = "清空");
        return runes;
    }

    const gridOptions = {
        defaultColDef: {
            menuTabs: [],
            enableCellChangeFlash: true,
            suppressMovable: true,
            flex: 1
        },
        columnDefs: [
            {headerName: "颜色", field: "color", flex: 0.6},
            {headerName: "名称", field: "name"},
            {headerName: "数量", field: "count",filter: 'agNumberColumnFilter'},
            {
                headerName: "操作",
                field: "clear",
                flex: 0.6,
                cellRenderer: params => {
                    return `<button>清空</button>`;
                }
            }
        ],
        rowClassRules: {
            'bg-add bg-red': params => params.data.color === RUNE_COLOR.red,
            'bg-add bg-blue': params => params.data.color === RUNE_COLOR.blue,
            'bg-add bg-green': params => params.data.color === RUNE_COLOR.green
        },
        rowData: getRowData(),
        // isRowFiltered : node => node.data.count === 0,
        getRowId: params => params.data.name,
        onCellClicked: params => {
            if (params.colDef.field === "clear") {
                hero.removeRune(params.data.name, 10);
            } else {
                hero.removeRune(params.data.name);
            }
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
            const applyRate = (skill, newRate) => {
                let changed = false;
                if (skill) {
                    changed = true;
                    if (skill.rateChanged) {
                        skill.rate = newRate;
                        if (newRate === skill.oldRate) skill.rateChanged = false;
                    } else {
                        skill.oldRate = skill.rate;
                        skill.rate = newRate;
                        skill.rateChanged = true;
                    }
                }
                return changed;
            }

            const equipment = EQUIPMENT_DATA.find(e => e.name === params.data.name);
            const rateMap = {
                passiveRate_1: equipment.passiveList[0],
                passiveRate_2: equipment.passiveList[1],
                activeRate: equipment.active
            };
            if (applyRate(rateMap[params.colDef.field], Number(params.value))) {
                hero.updateStats();
                hero.updateDelta(RUNE_DATA, EQUIPMENT_DATA);
                updates.forEach(update => update());
            }
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

function initRuneShopGrid() {
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
                    const color = Object.keys(RUNE_COLOR).find(key => RUNE_COLOR[key] === params.data.color); // 取当前行的颜色值
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

init();