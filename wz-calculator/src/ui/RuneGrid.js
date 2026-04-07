import {RUNE_COLOR} from "../game/constants.js";
import {EQUIPMENT_DATA} from "../game/data/EquipmentData.js";
import {RUNE_DATA} from "../game/data/RuneData.js";

export function initRuneGrid(hero, updates) {
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
            {headerName: "数量", field: "count", filter: 'agNumberColumnFilter'},
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
            filterType: 'number',
            type: 'notEqual',
            filter: 0
        }
    });

    updates.push(() => gridOptions.api.applyTransaction({update: getRowData()}));
}
