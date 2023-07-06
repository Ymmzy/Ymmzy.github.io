import {co, proto} from "./calcOrigin.js";
import {} from "./calc.js";
import {main} from "./main.js";

let mainCharacter = null;
const saveData = JSON.parse(localStorage.getItem('saveData'));
saveData && proto.jyf.Character.loadCharacter(saveData, char => {
    mainCharacter = char;
    main(mainCharacter);
});

function getButton(label, onclick) {
    const btn = document.createElement("button");
    btn.classList.add("btn");
    btn.innerText = label;
    btn.onclick = onclick;
    return btn;
}

const btnCon = document.querySelector("#ButtonContainer");
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
                mainCharacter = char;
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
btnCon.appendChild(getButton("导入", () => proto.jyf.Character.importJson(char => {
    mainCharacter = char;
    main(mainCharacter);
})));
btnCon.appendChild(getButton("导出", () => proto.jyf.Character.exportJson(mainCharacter.final)));
btnCon.appendChild(getButton("暂存", () => localStorage.setItem('saveData', JSON.stringify(proto.jyf.Character.saveCharacter(mainCharacter.final)))));