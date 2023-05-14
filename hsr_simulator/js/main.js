const TY_energyM = 19.44;
const TY_speedA = 30;

//DOM
const btns = document.querySelector("#btns");
const status = document.querySelector("#status");
const printStatus = (turn, totalAction, ...args) => {
    let str = '<div class="show_turn">';
    str += "<b>turn: " + turn + "</b> totalAction=" + totalAction.toFixed(2) + " ";
    args.forEach((arg) => {
        str += "<b>" + args + "</b> ";
    });
    for (let i = 0; i < characters.point; i++) {
        str += "♦";
    }
    str += '</div><div class="show_status">';
    characters.forEach((character) => {
        if (character.print) str += character.show() + "<br>";
    });
    if (turn > 0) str += "=======================================</div>";
    status.innerHTML = str + status.innerHTML;
};

//battle
let turn = 0;
let totalAction = 0;
let characters = [];
const nextTurn = () => {
    if (turn > 0) {
        characters[0].turnEnd(characters);
    }
    characters.sort((a, b) => {
        return a.action.request > b.action.request ? 1 : b.action.request > a.action.request ? -1 : 0
    });
    let past = Math.max(0, characters[0].action.request);
    characters.forEach((character) => {
        character.pass(past);
    });
    totalAction += past;
    printStatus(++turn, totalAction, characters[0].id);
    characters[0].turnBegin(characters);
};
const reset = () => {
    while (btns.children.length > 1) btns.removeChild(btns.children[1]);
    status.innerHTML = "";

    let SJ = ShenJun();
    let JY = JingYuan();
    let TY = TingYun();
    JY.color = "#cc8800";
    SJ.color = "#cc4400";
    TY.color = "#4d0099";
    //MiJi
    SJ.attributes.attackTimes.add = 3;
    JY.ShenJun = SJ;
    TY.defaultTarget = JY;
    TY.attributes.energy.multiply += TY_energyM;
    TY.attributes.speed.add += TY_speedA;

    characters = [];
    characters.point = 3;
    characters.push(JY);
    characters.push(SJ);
    characters.push(TY);
    JY.addButtons(btns);
    TY.addButtons(btns);

    turn = 0;
    totalAction = 0;
    printStatus(turn, totalAction);
};
const displayStatus = () => {
    const cl = document.querySelector("html").classList;
    if (cl.contains("hide_status")) cl.remove("hide_status");
    else cl.add("hide_status");
};

reset();
