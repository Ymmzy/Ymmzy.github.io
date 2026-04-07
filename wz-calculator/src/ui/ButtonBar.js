import {EQUIPMENT_DATA} from "../game/data/EquipmentData.js";
import {RUNE_DATA} from "../game/data/RuneData.js";
import {saveEquipmentRates, loadEquipmentRates} from "../game/EquipmentStore.js";

export function initButton(hero, updates) {
    const getFullSaveData = () => ({
        hero: hero.getSaveData(),
        equipmentData: saveEquipmentRates()
    });

    const loadAndRefresh = (data) => {
        loadEquipmentRates(data.equipmentData);
        hero.setSaveData(data.hero);
        hero.updateDelta(RUNE_DATA, EQUIPMENT_DATA);
        updates.forEach(fn => fn());
    };

    // 打开 artDialog 并支持点击遮罩关闭
    const openDialog = (opts) => {
        const dlg = art.dialog({...opts, lock: true, resize: false, drag: false, duration: 100});
        if (dlg._lockMask) dlg._lockMask.unbind('click dblclick').bind('click', () => dlg.close());
        return dlg;
    };

    const addButton = (label, onclick) => {
        const btn = document.createElement("button");
        btn.classList.add("btn");
        btn.innerText = label;
        btn.onclick = onclick;
        btnContainer.appendChild(btn);
    };

    const btnContainer = document.querySelector("#buttonContainer");

    // ========== 参数编辑 ==========
    addButton("参数", event => {
        const fields = [
            {label: "冷却缩减系数", get: () => hero.bonusStats.cooldownReductionToDPS, set: v => hero.bonusStats.cooldownReductionToDPS = v},
            {label: "移动速度系数", get: () => hero.bonusStats.moveSpeedToEHP, set: v => hero.bonusStats.moveSpeedToEHP = v},
            {label: "战斗时长", get: () => hero.battleTime.total, set: v => hero.battleTime.total = v},
            {label: "普攻时长", get: () => hero.battleTime.normalAttack, set: v => hero.battleTime.normalAttack = v},
            {label: "输出坦克占比", get: () => hero.enemiesDPS[0].bonusStats.rate, set: v => { hero.enemiesDPS[0].bonusStats.rate = v; hero.enemiesDPS[1].bonusStats.rate = 1 - v; }},
            {label: "受伤物理占比", get: () => hero.enemiesEHP[0].bonusStats.rate, set: v => { hero.enemiesEHP[0].bonusStats.rate = v; hero.enemiesEHP[1].bonusStats.rate = 1 - v; }},
        ];

        const form = document.createElement("div");
        const inputs = fields.map(f => {
            const row = document.createElement("div");
            row.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:6px;";
            const lbl = document.createElement("label");
            lbl.textContent = f.label;
            lbl.style.cssText = "color:#ccc;font-size:13px;white-space:nowrap;";
            const inp = document.createElement("input");
            inp.type = "number";
            inp.step = "any";
            inp.value = f.get();
            inp.style.cssText = "width:80px;padding:3px 6px;background:#1a1a2e;color:#eee;border:1px solid #555;border-radius:3px;font-size:13px;";
            row.append(lbl, inp);
            form.appendChild(row);
            return inp;
        });

        openDialog({
            content: form,
            padding: '12px',
            ok: () => {
                fields.forEach((f, i) => f.set(Number(inputs[i].value)));
                hero.updateStats();
                hero.updateDelta(RUNE_DATA, EQUIPMENT_DATA);
                updates.forEach(fn => fn());
                return true;
            },
            cancel: true,
            follow: event.target,
        });
    });

    // ========== 导入 ==========
    addButton("导入", () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', e => {
            const reader = new FileReader();
            reader.onload = ev => {
                if (typeof ev.target.result === "string") {
                    loadAndRefresh(JSON.parse(ev.target.result));
                } else {
                    console.warn("导入文件格式错误");
                }
            };
            reader.readAsText(e.target.files[0]);
        }, false);
        fileInput.click();
    });

    // ========== 导出 ==========
    addButton("导出", () => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob(
            [JSON.stringify(getFullSaveData(), null, '\t')],
            {type: 'application/json'}
        ));
        link.download = hero.exportFileName() + ".json";
        link.click();
    });

    // ========== 槽位管理 ==========
    const SLOT_COUNT = 12;
    const SLOT_STORAGE_KEY = 'slotData';

    const readSlots = () => {
        try { return JSON.parse(localStorage.getItem(SLOT_STORAGE_KEY)) || {}; }
        catch { return {}; }
    };

    const STAGE_MAP = {5: '满装', 1: '2件', 2: '3件', 3: '4件', 4: '5件'};
    const SLOT_FIELDS = [
        {key: 'stage', label: '',    bg: null,                       width: '34px', fmt: v => STAGE_MAP[v] ?? v},
        {key: 'CP',    label: 'CP',  bg: 'rgba(255,0,255,0.18)',     width: '52px', fmt: v => Math.round(v)},
        {key: 'DPS',   label: 'DPS', bg: 'rgba(255,0,0,0.18)',       width: '52px', fmt: v => Math.round(v)},
        {key: 'EHP',   label: 'EHP', bg: 'rgba(0,0,255,0.18)',       width: '58px', fmt: v => Math.round(v)},
        {key: 'tank',  label: '坦',  bg: null,                       width: '36px', fmt: v => v},
        {key: 'phys',  label: '物',  bg: null,                       width: '36px', fmt: v => v},
    ];

    const extractSlotInfo = (h) => {
        if (!h) return null;
        return {
            stage: h.stage ?? '-',
            CP: h.CP, DPS: h.DPS, EHP: h.EHP,
            tank: h.enemyRate?.dps ? Object.values(h.enemyRate.dps)[0] : '-',
            phys: h.enemyRate?.ehp ? Object.values(h.enemyRate.ehp)[0] : '-',
        };
    };

    const renderSlotInfo = (infoEl, heroData) => {
        infoEl.innerHTML = '';
        const vals = extractSlotInfo(heroData);
        if (!vals) {
            infoEl.textContent = '空';
            infoEl.style.color = '#666';
            return;
        }
        SLOT_FIELDS.forEach(f => {
            const s = document.createElement('span');
            const bgStyle = f.bg ? `background:${f.bg};border-radius:2px;` : '';
            s.style.cssText = `color:#ccc;display:inline-block;width:${f.width};text-align:left;padding:0 4px;margin-right:4px;${bgStyle}`;
            s.textContent = f.label ? `${f.label}:${f.fmt(vals[f.key])}` : f.fmt(vals[f.key]);
            infoEl.appendChild(s);
        });
    };

    const lastSlot = localStorage.getItem('lastSlot');
    const slotBtn = document.createElement("button");
    slotBtn.classList.add("btn");
    slotBtn.innerText = lastSlot ? `槽位${lastSlot}` : '槽位';
    const updateSlotBtn = (i) => { slotBtn.innerText = `槽位${i}`; };
    btnContainer.appendChild(slotBtn);
    slotBtn.onclick = event => {
        const slots = readSlots();
        const container = document.createElement("div");
        container.style.cssText = "display:flex;flex-direction:column;gap:4px;max-width:calc(100vw - 40px);";

        for (let i = 1; i <= SLOT_COUNT; i++) {
            const row = document.createElement("div");
            row.style.cssText = "display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid #333;";

            const label = document.createElement("span");
            label.style.cssText = "color:#ccc;font-size:13px;min-width:32px;flex-shrink:0;";
            label.textContent = `槽位${i}`;

            const info = document.createElement("span");
            info.style.cssText = "font-size:12px;flex:1;min-width:0;overflow:hidden;white-space:nowrap;font-family:monospace;";
            renderSlotInfo(info, slots[i]?.hero);

            const saveBtn = document.createElement("button");
            saveBtn.textContent = "存";
            saveBtn.style.cssText = "padding:2px 8px;font-size:12px;cursor:pointer;background:#2a4a2a;color:#ccc;border:1px solid #555;border-radius:3px;";
            saveBtn.onclick = () => {
                const current = readSlots();
                const saveData = getFullSaveData();
                saveData.hero.CP = Math.round(hero.CP);
                saveData.hero.DPS = Math.round(hero.DPS.average);
                saveData.hero.EHP = Math.round(hero.EHP.average);
                current[i] = saveData;
                localStorage.setItem(SLOT_STORAGE_KEY, JSON.stringify(current));
                localStorage.setItem('lastSlot', i);
                updateSlotBtn(i);
                renderSlotInfo(info, current[i].hero);
            };

            const loadBtn = document.createElement("button");
            loadBtn.textContent = "读";
            loadBtn.style.cssText = "padding:2px 8px;font-size:12px;cursor:pointer;background:#2a2a4a;color:#ccc;border:1px solid #555;border-radius:3px;";
            loadBtn.onclick = () => {
                const current = readSlots();
                if (!current[i]) return;
                loadAndRefresh(current[i]);
                localStorage.setItem('lastSlot', i);
                updateSlotBtn(i);
                select.value = hero.stage;
            };

            row.append(label, info, saveBtn, loadBtn);
            container.appendChild(row);
        }

        openDialog({
            content: container,
            padding: '10px',
            follow: event.target,
        });
    };

    // ========== Stage 下拉框 ==========
    const stageLabels = [[5, "满装"], [1, "2件"], [2, "3件"], [3, "4件"], [4, "5件"]];
    const select = document.createElement("select");
    select.classList.add("btn");
    select.style.cssText = "vertical-align:middle;cursor:pointer;";
    stageLabels.forEach(([value, label]) => {
        const opt = document.createElement("option");
        opt.value = value;
        opt.text = label;
        if (value === hero.stage) opt.selected = true;
        select.appendChild(opt);
    });
    select.addEventListener("change", () => {
        hero.setStage(Number(select.value));
        hero.updateDelta(RUNE_DATA, EQUIPMENT_DATA);
        updates.forEach(fn => fn());
    });
    btnContainer.appendChild(select);
}
