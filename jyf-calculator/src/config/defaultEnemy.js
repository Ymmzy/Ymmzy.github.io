import {proto} from "../calcOrigin.js";

export function getDefaultEnemy() {
    const enemy = new proto.jyf.Character();
    enemy.setName("默认敌人");
    enemy.setHp(15000);
    enemy.setMp(18000);
    enemy.setAttack(300);
    enemy.setDefense(250);
    enemy.setIgnoreDefense(40);
    enemy.setIgnoreSkill(40);
    enemy.setAccuracy(80);
    enemy.setDodge(60);
    enemy.setShiftAttack(25);
    enemy.setBreakMove(10);
    return enemy;
}