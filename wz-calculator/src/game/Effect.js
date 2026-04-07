export const EFFECT = {
    statAdd: (holder, name, value, rate) => {
        holder.extraStats[name] += value * rate;
    },
    damageNA: (attacker, defender, source, type, value, rate) => {
        attacker.damageNAList[defender.name].push({ source, type, value, rate });
    },
    damageCD: (attacker, defender, source, type, value, cooldown, rate) => {
        attacker.damageCDList[defender.name].push({ source, type, value, cooldown, rate });
    },
    heal: (attacker, defender, source, value, cooldown, rate) => {
        defender.healList[attacker.name].push({ source, value, cooldown, rate });
    },
    healByTime: (attacker, defender, source, value, rate) => {
        defender.healList[attacker.name].push({
            source,
            value: value * defender.battleTime.total,
            cooldown: defender.battleTime.total,
            rate
        });
    },
    healByNormalAttack: (attacker, defender, source, value, rate) => {
        attacker.healList[defender.name].push({
            source,
            value: value * attacker.battleTime.normalAttack,
            cooldown: attacker.battleTime.normalAttack,
            rate
        });
    },
    shield: (attacker, defender, source, types, value, cooldown, rate) => {
        defender.shieldList[attacker.name].push({ source, types, value, cooldown, rate });
    }
};
