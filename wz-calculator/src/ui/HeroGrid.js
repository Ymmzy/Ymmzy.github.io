import {DAMAGE_TYPE} from "../game/constants.js";
import {EQUIPMENT_DATA} from "../game/data/EquipmentData.js";
import {RUNE_DATA} from "../game/data/RuneData.js";

export function initHeroGrid(hero, updates) {
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
            if (!TOOLTIP_KEYS.includes(params.data.key)) return;

            this.eGui.className = 'custom-tooltip';
            this.children = [document.createElement('div'), document.createElement('div')];
            this.getGui().append(...this.children);

            const tooltipColumns = (valueHeader) => ({
                defaultColDef: {menuTabs: [], flex: 1},
                columnDefs: [
                    {headerName: '来源', field: 'source', minWidth: 84},
                    {headerName: '类型', field: 'type'},
                    {headerName: valueHeader, field: 'value', valueFormatter: p => p.value.toFixed(0)},
                    {headerName: '冷却', field: 'cooldown'},
                    {headerName: '应用', field: 'rate'},
                ]
            });

            const createGrid = (el, opts, data) => {
                if (data.length) {
                    new agGrid.Grid(el, {...opts, rowData: data});
                } else {
                    el.remove();
                }
            };

            if (params.data.key.includes("DPS")) {
                const opts = tooltipColumns('伤害');
                createGrid(this.children[0], opts, hero.damageNAList[params.data.enemy].map(d => ({...d, cooldown: "-"})));
                createGrid(this.children[1], opts, hero.damageCDList[params.data.enemy]);
            } else {
                const opts = tooltipColumns('数值');
                createGrid(this.children[0], opts, hero.healList[params.data.enemy].map(h => ({...h, type: "-"})));
                createGrid(this.children[1], opts, hero.shieldList[params.data.enemy].map(s => ({
                    ...s,
                    type: s.types.includes(DAMAGE_TYPE.real) ? "真实" : s.types.length === 1 ? s.types[0] : "普通"
                })));
            }
            this.popupDiv = [...document.body.children].slice(-2);
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
                cellRenderer: params => {
                    if (params.data.options) {
                        const select = document.createElement('select');
                        select.style.cssText = 'width:100%;background:transparent;color:inherit;border:none;outline:none;cursor:pointer;';
                        params.data.options.forEach(opt => {
                            const option = document.createElement('option');
                            option.value = opt;
                            option.text = opt;
                            option.style.background = '#181d1f';
                            if (opt === params.value) option.selected = true;
                            select.appendChild(option);
                        });
                        select.addEventListener('change', () => {
                            const bonusStat = Object.values(hero.bonusStats).find(v => v.key === params.data.key);
                            if (bonusStat) bonusStat.value = select.value;
                            hero.updateStats();
                            hero.updateDelta(RUNE_DATA, EQUIPMENT_DATA);
                            updates.forEach(fn => fn());
                        });
                        return select;
                    }
                    if (params.data.key === "attackTime") return params.value.toFixed(3);
                    if (typeof params.value !== 'number') return params.value;
                    if (params.value === 0) return "";
                    return params.value < 3 ? `${Math.floor(params.value * 100)}%` : Math.floor(params.value);
                },
                tooltipField: "value",
                tooltipComponent: 'customTooltip',
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
