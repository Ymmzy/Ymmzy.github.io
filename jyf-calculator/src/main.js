import {
    co, proto,
} from "./calcOrigin.js";
import {getDefaultEnemy} from "./config/defaultEnemy.js";

export function main(mainCharacter) {
    const mainEft = mainCharacter.mainEft;
    const team = mainCharacter.team;
    co.getEftInfoProto(mainCharacter, mainEft.getId()) || mainCharacter.addEfts().setId(mainEft.getId()).setLevel(10);
    mainCharacter.setEnemy(getDefaultEnemy()).updateActRelations().updateFinal();

    initEft();

    let ableEftList = initAbleEftList();

    function initAbleEftList() {
        const iq = mainCharacter.getIq();
        return co.getEftProtos().filter(eft => {
            if (mainCharacter.getGender() === proto.jyf.Gender.GENDER_FEMALE
                && (eft.getRequiredGender() === proto.jyf.Gender.GENDER_MALE || eft.getRequiredGender() === proto.jyf.Gender.GENDER_SHEMALE))
                return false;
            if (iq < eft.getRequiredIq() || (eft.getRequiredMaximumIq() && iq > eft.getRequiredMaximumIq())) return co.ableToLearnWithoutIqRequirement(mainCharacter.final, eft);
            return true;
        });
    }

    function initEft() {
        co.getEftProtos().forEach(eft => eft.maxLevel && (eft.maxLevel = 10));
        for (let eftEnh of mainCharacter.getEftEnhancementsList()) {
            if (eftEnh.getAddMaxLevel()) {
                co.getEftProtos().forEach(eft => {
                    if (co.isEftEnhancementRelated(eftEnh, eft)) {
                        if (!eft.maxLevel) eft.maxLevel = 10;
                        eft.maxLevel += eftEnh.getAddMaxLevel();
                    }
                });
            }
        }
        for (let eftInfo of mainCharacter.getEftsList()) {
            co.getEftProto(eftInfo.getId()).applyEftEnhAddMaxLvl(eftInfo.getLevel());
        }
        co.getEftProtos().forEach(eft => {
            eft.mainEftEnh = null;
        });
        mainEft.getRelatedEftsList().forEach(eft => {
            eft.updateMainEftEnh(mainCharacter.final);
        });
        co.getEftProtos().forEach(eft => {
            eft.updateMainAttrEnh(mainCharacter.final, team);
            eft.updateDelta(mainCharacter.final);
        });
    }

    function learnEft(eft) {
        let eftInfo = mainCharacter.addEfts();
        let level = eft.maxLevel || 10;
        eftInfo.setId(eft.getId());
        eftInfo.setLevel(level);

        if (eft.getRequiredGender() === proto.jyf.Gender.GENDER_SHEMALE && mainCharacter.getGender() !== proto.jyf.Gender.GENDER_SHEMALE) {
            mainCharacter.setDamageIncrease(mainCharacter.getDamageIncrease() - 20);
            mainCharacter.setDamageReduce(mainCharacter.getDamageReduce() - 20);
            mainCharacter.setGender(proto.jyf.Gender.GENDER_SHEMALE);
        }

        mainCharacter.updateFinal(charEftGridOptions);
        eft.applyEftEnhAddMaxLvl(eftInfo.getLevel());
        new Set([...eft.getRelatedEftsList(), ...eft.getAttrEnhEftsList()]).forEach(eft => eft.updateMainAttrEnh(mainCharacter.final, team));
        proto.jyf.Eft.deltaCache = {};
        ableEftList.forEach(eft => eft.updateDelta(mainCharacter.final));

        charAttrGridOptions.api.applyTransaction({update: getCharAttrRowData()});
        charEftGridOptions.api.applyTransaction({add: [getCharEftRow(eftInfo)]});
        eftGridOptions.api.applyTransaction({update: getEftRowData()});
    }

    function forgetEft(eft) {
        let eftInfo = co.getEftInfoProto(mainCharacter, eft.getId());
        mainCharacter.setEftsList(mainCharacter.getEftsList().filter(eftInfo => eftInfo.getId() !== eft.getId()));

        if (eft.getRequiredGender() === proto.jyf.Gender.GENDER_SHEMALE) {
            if (!mainCharacter.getEftsList().find(eftInfo => co.getEftProto(eftInfo.getId()).getRequiredGender() === proto.jyf.Gender.GENDER_SHEMALE)) {
                if (co.getCharacterProto(mainCharacter.getId()).getGender() !== proto.jyf.Gender.GENDER_SHEMALE) {
                    mainCharacter.setDamageIncrease(mainCharacter.getDamageIncrease() + 20);
                    mainCharacter.setDamageReduce(mainCharacter.getDamageReduce() + 20);
                    mainCharacter.setGender(co.getCharacterProto(mainCharacter.getId()).getGender());
                }
            }
        }

        mainCharacter.updateFinal(charEftGridOptions);
        eft.applyEftEnhAddMaxLvl(eftInfo.getLevel(), -1);
        new Set([eft, ...eft.getRelatedEftsList(), ...eft.getAttrEnhEftsList()]).forEach(eft => eft.updateMainAttrEnh(mainCharacter.final, team));
        proto.jyf.Eft.deltaCache = {};
        ableEftList.forEach(eft => eft.updateDelta(mainCharacter.final));

        charAttrGridOptions.api.applyTransaction({update: getCharAttrRowData()});
        eftGridOptions.api.applyTransaction({add: [eft.AA]});
        eftGridOptions.api.applyTransaction({update: getEftRowData()});
    }

    document.querySelector("#EftGrid").innerHTML = '';
    document.querySelector("#CharEftGrid").innerHTML = '';
    document.querySelector("#SubGrid-1").innerHTML = '';
    document.querySelector("#SubGrid-2").innerHTML = '';

    // region EftGrid
    const eftColDefs = [
        {
            headerName: "ID",
            field: "id",
            sortingOrder: ['asc', 'desc'],
            width: 54,
            pinned: 'left',
            menuTabs: ['filterMenuTab', 'columnsMenuTab']
        },
        {
            headerName: "名称",
            field: "name",
            sortingOrder: ['asc', 'desc'],
            filter: 'agTextColumnFilter',
            width: 94,
            pinned: 'left',
            menuTabs: ['filterMenuTab', 'columnsMenuTab']
        },
        {
            headerName: "△总",
            field: "delta_total",
            width: 64,
            pinned: 'left',
            cellClass: 'bg-add bg-total overflow-visible',
            valueFormatter: params => params.value.toFixed(1)
        },
        {
            headerName: "△特",
            field: "delta_special",
            width: 64,
            pinned: 'left',
            cellClass: 'bg-add bg-special overflow-visible',
            valueFormatter: params => params.value.toFixed(1)
        },
        {
            headerName: "△攻",
            field: "delta_attack",
            width: 64,
            pinned: 'left',
            cellClass: 'bg-add bg-attack overflow-visible',
            valueFormatter: params => params.value.toFixed(1)
        },
        {
            headerName: "△防",
            field: "delta_defense",
            width: 64,
            pinned: 'left',
            cellClass: 'bg-add bg-defense overflow-visible',
            valueFormatter: params => params.value.toFixed(1)
        },
        {
            headerName: "主类型",
            field: "type",
            sortingOrder: ['asc', 'desc'],
            filter: 'agTextColumnFilter',
            width: 66,
            menuTabs: ['filterMenuTab', 'columnsMenuTab'],
            valueFormatter: params => co.eftTypeToString(params.value),
        },
        {
            headerName: "副类型",
            field: "secondary_type",
            sortingOrder: ['asc', 'desc'],
            filter: 'agTextColumnFilter',
            width: 66,
            menuTabs: ['filterMenuTab', 'columnsMenuTab'],
            valueFormatter: params => co.eftSecondaryTypeToString(params.value),
        },
        ...Object.keys(proto.jyf.Eft.ATTR_LIST).map(key => ({
            headerName: proto.jyf.Eft.ATTR_LIST[key],
            field: key,
            enableCellChangeFlash: true,
            cellClass: "overflow-visible",
            valueFormatter: params => params.value || '',
        })),
    ];

    function getEftRowData() {
        return ableEftList.filter(eft => !co.getEftInfoProto(mainCharacter, eft.getId())).map(eft => eft.AA)
    }

    const eftRowData = getEftRowData();
    const eftGridOptions = {
        defaultColDef: {
            sortable: true,
            sortingOrder: ['desc', 'asc'],
            menuTabs: [],
            width: 50,
        },
        columnDefs: eftColDefs,
        rowData: eftRowData,
        accentedSort: true,
        // animateRows: true,
        getRowId: params => params.data.id,
        onRowClicked: function (params) {
            if (mainCharacter.getEftsList().length >= 10 + mainCharacter.getAdditionalEfts()) return;

            eftGridOptions.api.applyTransaction({remove: [params.data]});

            const eftId = params.data.id;
            learnEft(co.getEftProto(eftId));
        },
    };
    const eftGridDiv = document.querySelector('#EftGrid');
    new agGrid.Grid(eftGridDiv, eftGridOptions);
    eftGridOptions.columnApi.applyColumnState({
        state: [{colId: 'delta_total', sort: 'desc'}],
        defaultState: {sort: null},
    });
    eftGridOptions.api.setAnimateRows(true);

    const eftHeaderContainer = document.querySelector('#EftGrid .ag-header-container');
    eftHeaderContainer.addEventListener('mouseover', function (event) {
        const headerCell = event.target.closest('.ag-header-cell');
        if (headerCell) {
            const tooltipText = headerCell.querySelector('.ag-header-cell-comp-wrapper .ag-cell-label-container .ag-header-cell-label .ag-header-cell-text').textContent;

            const tooltip = document.createElement('div');
            tooltip.classList.add('eft-grid-header-tooltip');
            tooltip.textContent = tooltipText;

            const rect = headerCell.getBoundingClientRect();
            tooltip.style.position = 'absolute';
            tooltip.style.top = (rect.y + rect.height) + 'px';
            tooltip.style.left = rect.x + 'px';
            tooltip.style.minWidth = rect.width + 'px';
            tooltip.style.pointerEvents = 'none';

            document.body.appendChild(tooltip);

            const removeTooltip = function () {
                eftGridOptions.onSortChanged = null;
                headerCell.removeEventListener('click', removeTooltip);
                headerCell.removeEventListener('mouseout', removeTooltip);
                document.body.removeChild(tooltip);
            };
            eftGridOptions.onSortChanged = removeTooltip;
            headerCell.addEventListener('click', removeTooltip);
            headerCell.addEventListener('mouseout', removeTooltip);
        }
    });
    // endregion

    // region CharEftGrid
    const charEftColDefs = [
        {headerName: "名称", field: "name", width: 94},
        {headerName: "等级", field: "level", width: 66, enableCellChangeFlash: true},
        {headerName: "主类型", field: "type", width: 66},
        {headerName: "ID", field: "id", width: 54, flex: 1},
    ];

    function getCharEftRow(eftInfo) {
        return {
            id: eftInfo.getId(),
            name: co.getEftProto(eftInfo.getId()).getName(),
            type: co.eftTypeToString(co.getEftProto(eftInfo.getId()).getType()),
            level: eftInfo.getLevel(),
        }
    }

    const charEftRowData = mainCharacter.getEftsList().map(eftInfo => getCharEftRow(eftInfo));
    const charEftGridOptions = {
        defaultColDef: {
            menuTabs: [],
        },
        columnDefs: charEftColDefs,
        rowData: charEftRowData,
        animateRows: true,
        getRowId: params => params.data.id,
        onRowClicked: function (params) {
            if (params.data.id === mainEft.getId()) return;

            charEftGridOptions.api.applyTransaction({remove: [params.data]});

            const eft = co.getEftProto(params.data.id);
            forgetEft(eft);
        },
    };
    const charEftGridDiv = document.querySelector('#CharEftGrid');
    charEftGridDiv.style.minHeight = ((10 + mainCharacter.getAdditionalEfts()) * 28 + 35) + "px";
    new agGrid.Grid(charEftGridDiv, charEftGridOptions);
    // endregion

    // region charAttrGrid
    const charKeys = [...Object.keys(proto.jyf.Character.PROP_LIST), ...Object.keys(proto.jyf.Character.ATTR_LIST)];
    const charAttrColDefs = [
        {
            headerName: 'Key', field: 'key', cellClass: 'min-w-80',
            valueFormatter: params => proto.jyf.Character.PROP_LIST[params.value] || proto.jyf.Character.ATTR_LIST[params.value],
        },
        {
            headerName: 'Value', field: 'value', flex: 1, enableCellChangeFlash: true, cellDataType: 'text',
            valueFormatter: params => typeof params.value === 'number' ? (params.value === 0 ? "" : params.value.toFixed(0)) : params.value,
            cellRenderer: params => {
                const cellElement = document.createElement('div');
                cellElement.textContent = params.valueFormatted;
                cellElement.addEventListener("click", () => console.log(params.data.key, ":", params.data.value));

                if (params.valueFormatted) {
                    const bp = mainCharacter.final.BP[params.data.key];
                    bp && (bp[0] !== 1 || (bp[1] !== 1 && bp[1] !== 0)) && cellElement.addEventListener('mouseover', () => {
                        const tooltip = document.createElement('div');
                        tooltip.classList.add('char-attr-grid-tooltip');
                        tooltip.innerHTML = params.valueFormatted;
                        bp[0] !== 1 && bp[0] !== 0 && (tooltip.innerHTML += "<div class='attack'>" + Math.round(bp[0] * 1000)/1000 + "</div>");
                        bp[1] !== 1 && bp[1] !== 0 && (tooltip.innerHTML += "<div class='defense'>" + Math.round(bp[1] * 1000)/1000 + "</div>");

                        const rect = cellElement.getBoundingClientRect();
                        tooltip.style.position = 'absolute';
                        tooltip.style.top = rect.y + 'px';
                        tooltip.style.left = rect.x - 4 + 'px';
                        tooltip.style.minWidth = rect.width + 17 + 'px';
                        tooltip.style.minHeight = rect.height - 2 + 'px';
                        tooltip.style.pointerEvents = 'none';

                        document.body.appendChild(tooltip);

                        const removeTooltip = function () {
                            cellElement.removeEventListener('click', removeTooltip);
                            cellElement.removeEventListener('mouseout', removeTooltip);
                            document.body.removeChild(tooltip);
                        };
                        cellElement.addEventListener('click', removeTooltip);
                        cellElement.addEventListener('mouseout', removeTooltip);
                    });
                }

                return cellElement;
            }
        }
    ];

    function getCharAttrRowData() {
        return [
            ...charKeys.map(key => ({
                key: key,
                value: mainCharacter.final.AA[key]
            })),
        ];
    }

    const subRowData = [[], []];
    getCharAttrRowData().forEach((data, i) => subRowData[i % 2].push(data));
    const charAttrGridOptions = {
        defaultColDef: {
            menuTabs: [],
            flex: 1,
        },
        getRowId: params => params.data.key,
        columnDefs: charAttrColDefs,
    };
    const subGridOptions = [
        {...charAttrGridOptions, rowData: subRowData[0]},
        {...charAttrGridOptions, rowData: subRowData[1]}
    ];
    const subGridDiv = [document.querySelector("#SubGrid-1"), document.querySelector("#SubGrid-2")];
    new agGrid.Grid(subGridDiv[0], subGridOptions[0]);
    new agGrid.Grid(subGridDiv[1], subGridOptions[1]);

    charAttrGridOptions.api = {
        applyTransaction: (transaction) => {
            //only update
            const subTransaction = [{update: []}, {update: []}]
            transaction.update.forEach(data => {
                if (subGridOptions[0].api.getRowNode(data.key)) subTransaction[0].update.push(data);
                else subTransaction[1].update.push(data);
            });
            subGridOptions[0].api.applyTransaction(subTransaction[0]);
            subGridOptions[1].api.applyTransaction(subTransaction[1]);
        },
    };
// endregion

    console.log("!---------- ", mainCharacter.getName(), " loaded ----------!")
}