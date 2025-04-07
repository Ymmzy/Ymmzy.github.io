import Hero from "./game/Hero.js"
import {heroData, enemyData, equipmentData, runeData} from "./game/Data.js"

let hero = null;
let updates = null;

function init() {
    initData();
    initButton();

    updates = [];
    initHeroGrid();
    initEquipmentGrid();
    initRuneGrid();
}

function initData() {
    hero = new Hero(heroData[0]);
    window.hero = hero;
    hero.setEnemy(
        [new Hero(enemyData.enemyDPS_1), new Hero(enemyData.enemyDPS_2)],
        [new Hero(enemyData.enemyEHP_1), new Hero(enemyData.enemyEHP_2)]
    );
    hero.addEquipment("影刃");
    hero.addEquipment("无尽战刃");
    hero.addEquipment("仁者破晓");
    hero.addRune("祸源", 100);
    hero.addRune("鹰眼", 10);
    hero.addRune("夺萃", 5);
    hero.addRune("狩猎", 20);
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
    const HERO_DATA_KEYS = {
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
    const HERO_STAT_KEYS = {
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
            {key: "CP", value: 0},
            {key: "price", value: hero.totalPrice},
            {key: "DPS", value: 0},
            {key: "EHP", value: 0},
            {key: "DPS_1", value: hero.DPS[0]},
            {key: "EHP_1", value: hero.EHP[0]},
            {key: "DPS_2", value: hero.DPS[1]},
            {key: "EHP_2", value: hero.EHP[1]},
            {key: "name", value: hero.name},
            {key: "level", value: hero.level},
            ...Object.keys(HERO_STAT_KEYS).map(key => ({
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
                valueFormatter: params => HERO_STAT_KEYS[params.value] || HERO_DATA_KEYS[params.value]
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
        rowData: getRowData()
    }

    const element = document.querySelector(GRID_ID);
    element.innerHTML = '';
    new agGrid.Grid(element, gridOptions);

    updates.push(() => gridOptions.api.applyTransaction({update: getRowData()}));
}

function initRuneGrid() {
    const GRID_ID = "#runeGrid";
    const COLOR_KEYS = {
        "red": {
            text: "红",
            style: { background: 'rgba(255, 0, 0, 0.1)' }
        },
        "blue": {
            text: "蓝",
            style: { background: 'rgba(0, 0, 255, 0.1)' }
        },
        "green": {
            text: "绿",
            style: { background: 'rgba(0, 255, 0, 0.1)' }
        }
    }
    const getRowData = () => hero.getRunes();

    const gridOptions = {
        defaultColDef: {
            menuTabs: [],
            enableCellChangeFlash: true,
            flex: 1
        },
        columnDefs: [
            {
                headerName: "颜色",
                field: "color",
                valueFormatter: params => COLOR_KEYS[params.value].text,
                flex: 0.5
            },
            {headerName: "名称", field: "name"},
            {headerName: "数量", field: "count"}
        ],
        rowClassRules: {
            'bg-add bg-red': params => params.data.color === 'red',
            'bg-add bg-blue': params => params.data.color === 'blue',
            'bg-add bg-green': params => params.data.color === 'green'
        },
        rowData: getRowData()
    }

    const element = document.querySelector(GRID_ID);
    element.innerHTML = '';
    new agGrid.Grid(element, gridOptions);

    updates.push(() => gridOptions.api.applyTransaction({update: getRowData()}));

}

init();