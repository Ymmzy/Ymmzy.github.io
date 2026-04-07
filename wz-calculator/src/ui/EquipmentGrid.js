import {EQUIPMENT_DATA} from "../game/data/EquipmentData.js";
import {RUNE_DATA} from "../game/data/RuneData.js";

export function initEquipmentGrid(hero, updates) {
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
