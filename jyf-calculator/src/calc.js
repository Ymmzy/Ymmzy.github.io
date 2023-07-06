import {calcMul, co, D, isRelationAct, N, proto, Se, U, W, x} from "./calcOrigin.js";

const CONSTANT = {
    TURN: 20,
    TYPE: {
        [proto.jyf.Eft.Type.FIST]: 0.25,
        [proto.jyf.Eft.Type.SWORD]: 0.4,
        [proto.jyf.Eft.Type.KNIFE]: 0.15,
        [proto.jyf.Eft.Type.UNUSUAL]: 0.2,
        [proto.jyf.Eft.Type.HIDDEN_WEAPON]: 0
    },
    ENEMY_MAIN_SKILL: 250,
    ENEMY_OTHER_SKILL: 80,
    CD_SUB_RATIO: 0.01,
    MALE_PERCENT: 0.75,
    ENEMY_EFT_LEVEL: 15,
    ENEMY_BENEVOLENCE: -20,
    BP_ATTACK_RATIO: 10,
    BP_DEFENSE_RATIO: 500,
    BP_TOTAL_RATIO: 10,
    BP_SPECIAL_RATIO: 10,

}

const BP = {
    hp: (hp, char, enemy) => [
        1,
        10000 / hp
    ],
    // mp: (mp, char, enemy) => [1, 1],
    attack: (attack, char, enemy) => [
        (attack + 30) / 230,
        1
    ],
    defense: (defense, char, enemy) => [
        1,
        230 / (defense * (1 - CALC.ignore_defense(enemy.getIgnoreDefense())) + 30)
    ],
    speed: (speed, char, enemy) => [
        CALC.speed(speed) / 200,
        1
    ],
    fist: (fist, char, enemy) => {
        const atk_skill = char.AA.type === proto.jyf.Eft.Type.FIST ? fist : 0;
        const def_skill = fist / 2 + char.AA.main_skill / 10;
        return [
            (atk_skill + 100) / 100,
            350 / (def_skill - CALC.ignore_skill(enemy.getIgnoreSkill(), def_skill) + 100) * CONSTANT.TYPE[proto.jyf.Eft.Type.FIST]
        ];
    },
    sword: (sword, char, enemy) => {
        const atk_skill = char.AA.type === proto.jyf.Eft.Type.SWORD ? sword : 0;
        const def_skill = sword / 2 + char.AA.main_skill / 10;
        return [
            (atk_skill + 100) / 100,
            350 / (def_skill - CALC.ignore_skill(enemy.getIgnoreSkill(), def_skill) + 100) * CONSTANT.TYPE[proto.jyf.Eft.Type.SWORD]
        ];
    },
    knife: (knife, char, enemy) => {
        const atk_skill = char.AA.type === proto.jyf.Eft.Type.KNIFE ? knife : 0;
        const def_skill = knife / 2 + char.AA.main_skill / 10;
        return [
            (atk_skill + 100) / 100,
            350 / (def_skill - CALC.ignore_skill(enemy.getIgnoreSkill(), def_skill) + 100) * CONSTANT.TYPE[proto.jyf.Eft.Type.KNIFE]
        ];
    },
    unusual: (unusual, char, enemy) => {
        const atk_skill = char.AA.type === proto.jyf.Eft.Type.UNUSUAL ? unusual : 0;
        const def_skill = unusual / 2 + char.AA.main_skill / 10;
        return [
            (atk_skill + 100) / 100,
            350 / (def_skill - CALC.ignore_skill(enemy.getIgnoreSkill(), def_skill) + 100) * CONSTANT.TYPE[proto.jyf.Eft.Type.UNUSUAL]
        ];
    },
    hidden_weapon: (hidden_weapon, char, enemy) => {
        const atk_skill = char.AA.type === proto.jyf.Eft.Type.HIDDEN_WEAPON ? hidden_weapon : 0;
        const def_skill = hidden_weapon / 2 + char.AA.main_skill / 20;
        return [
            (atk_skill + 100) / 100,
            350 / (def_skill - CALC.ignore_skill(enemy.getIgnoreSkill(), def_skill) + 100) * CONSTANT.TYPE[proto.jyf.Eft.Type.HIDDEN_WEAPON]
        ];
    },
    // iq: (iq, char, enemy) => [1, 1],
    // benevolence: (benevolence, char, enemy) => [1, 1],
    // constitution: (constitution, char, enemy) => [1, 1],
    critical: (critical, char, enemy) => [
        1 + CALC.critical(critical),
        1
    ],
    double_hit: (double_hit, char, enemy) => [
        1 + CALC.double_hit(double_hit),
        1
    ],
    borrow_strength: (borrow_strength, char, enemy) => {
        const oldAttack = char.AA.attack;
        const newAttack = oldAttack * (1 + CALC.borrow_strength(borrow_strength, oldAttack, enemy.getAttack()));
        return [
            (newAttack + 30) / (oldAttack + 30),
            1
        ];
    },
    ignore_defense: (ignore_defense, char, enemy) => {
        const oldDef = enemy.getDefense();
        const newDef = oldDef * (1 - CALC.ignore_defense(ignore_defense, oldDef));
        return [
            (oldDef + 30) / (newDef + 30),
            1
        ];
    },
    ignore_skill: (ignore_skill, char, enemy) => {
        const k = CONSTANT.TYPE[char.AA.type];
        const same = CONSTANT.ENEMY_MAIN_SKILL / 2 + CONSTANT.ENEMY_MAIN_SKILL / (char.AA.type === proto.jyf.Eft.Type.HIDDEN_WEAPON ? 20 : 10);
        const diff = CONSTANT.ENEMY_OTHER_SKILL / 2 + CONSTANT.ENEMY_MAIN_SKILL / (char.AA.type === proto.jyf.Eft.Type.HIDDEN_WEAPON ? 20 : 10);
        const oldMul = k / (same + 100) + (1 - k) / (diff + 100);
        const newMul = k / (same - CALC.ignore_skill(ignore_skill, same) + 100) + (1 - k) / (diff - CALC.ignore_skill(ignore_skill, diff) + 100);
        return [
            newMul / oldMul,
            1
        ];
    },
    damage_increase: (damage_increase, char, enemy) => [
        1 + CALC.damage_increase(damage_increase, char.AA.current_mp, char.AA.cost),
        1
    ],
    accuracy: (accuracy, char, enemy) => {
        const p = CALC.accuracy(accuracy);
        const ep1 = CALC.shift_attack(enemy.getShiftAttack()) * (1 - CONSTANT.CD_SUB_RATIO * 20);
        const ep2 = CALC.dodge(enemy.getDodge()) * (1 - CONSTANT.CD_SUB_RATIO * 3);
        const ep3 = CALC.break_move(enemy.getBreakMove()) * (1 - CONSTANT.CD_SUB_RATIO * 20);
        const oldMul = (1 - ep1) * (1 - ep2) * (1 - ep3);
        const newMul = p + (1 - p) * oldMul;
        return [
            newMul / oldMul,
            1
        ];
    },
    damage_reduce: (damage_reduce, char, enemy) => [
        1,
        1 - CALC.damage_reduce(damage_reduce, char.AA.current_mp)
    ],
    armor_defense: (armor_defense, char, enemy) => [
        1,
        1 - CALC.armor_defense(armor_defense)
    ],
    damage_reduce_from_male: (damage_reduce_from_male, char, enemy) => [
        1,
        1 - CALC.damage_reduce_from_male(damage_reduce_from_male) * CONSTANT.MALE_PERCENT
    ],
    dodge: (dodge, char, enemy) => {
        const reduce = 1 - CALC.dodge_reduce_p(dodge) * CALC.dodge_reduce(dodge);
        const p1 = CALC.shift_attack(char.AA.shift_attack) * (1 - CONSTANT.CD_SUB_RATIO * 20);
        let p2_0 = CALC.dodge(dodge);
        char.AA.dodge_attempt_ratio && (p2_0 += (1 - p2_0) * p2_0 * CALC.dodge_attempt_ratio(char.AA.dodge_attempt_ratio));
        const p2 = p2_0 * (1 - CONSTANT.CD_SUB_RATIO * 3);
        const epa = CALC.accuracy(enemy.getAccuracy());
        const oldMul = epa + (1 - epa) * (1 - p1);
        const newMul = epa * (1 - char.getDodgeIgnoreAccuracy() * p2) + (1 - epa) * (1 - p1) * (1 - p2);
        return [
            1,
            newMul / oldMul * reduce
        ];
    },
    shift_attack: (shift_attack, char, enemy) => {
        const reduce = 1 - CALC.shift_attack_reduce_p(shift_attack) * CALC.shift_attack_reduce(shift_attack);
        const p1 = CALC.shift_attack(shift_attack) * (1 - CONSTANT.CD_SUB_RATIO * 20);
        const epa = CALC.accuracy(enemy.getAccuracy());
        const oldMul = 1;
        const newMul = epa + (1 - epa) * (1 - p1);
        return [
            1 + (1 - epa) * p1 * (1 - CALC.shift_attack_damage_reduce(shift_attack)) * 0.5,
            newMul / oldMul * reduce
        ];
    },
    damage_rebound: (damage_rebound, char, enemy) => [
        1 + CALC.damage_rebound(damage_rebound) * (1 - CONSTANT.CD_SUB_RATIO * 20) * CALC.damage_rebound_damage(enemy.getDamageReduce()) * 0.5,
        1
    ],
    break_move: (break_move, char, enemy) => {
        const reduce = 1 - CALC.break_move_reduce_p(break_move) * CALC.break_move_reduce(break_move);
        const p1 = CALC.shift_attack(char.AA.shift_attack) * (1 - CONSTANT.CD_SUB_RATIO * 20);
        let p2_0 = CALC.dodge(char.AA.dodge);
        char.AA.dodge_attempt_ratio && (p2_0 += (1 - p2_0) * p2_0 * CALC.dodge_attempt_ratio(char.AA.dodge_attempt_ratio));
        const p2 = p2_0 * (1 - CONSTANT.CD_SUB_RATIO * 3);
        const p3 = CALC.break_move(break_move) * (1 - CONSTANT.CD_SUB_RATIO * 20);
        const epa = CALC.accuracy(enemy.getAccuracy());
        const oldMul = epa * (1 - char.getDodgeIgnoreAccuracy() * p2) + (1 - epa) * (1 - p1) * (1 - p2);
        const newMul = epa * (1 - char.getDodgeIgnoreAccuracy() * p2) + (1 - epa) * (1 - p1) * (1 - p2) * (1 - p3);
        return [
            1,
            newMul / oldMul * reduce
        ];
    },
    mp_defense: (mp_defense, char, enemy) => {
        const p = CALC.mp_defense(mp_defense) * (1 - CONSTANT.CD_SUB_RATIO * 40 * (1 - char.getMpDefenseNoCd()));
        return [
            1,
            1 - p * (0.8 + 0.2 * char.getMpDefenseNoCost())
        ];
    },
    sharp: (sharp, char, enemy) => [
        1 + sharp / (100 + sharp),
        1
    ],
    damage_increase_to_female: (damage_increase_to_female, char, enemy) => [
        1 + CALC.damage_increase_to_female(damage_increase_to_female) * (1 - CONSTANT.MALE_PERCENT),
        1
    ],
    damage_increase_to_evil: (damage_increase_to_evil, char, enemy) => [
        1 + CALC.damage_increase_to_evil(damage_increase_to_evil, char.AA.benevolence),
        1
    ],
    damage_increase_by_evil: (damage_increase_by_evil, char, enemy) => [
        1 + CALC.damage_increase_by_evil(damage_increase_by_evil, char.AA.benevolence),
        1
    ],
    damage_increase_by_reduce_hp: (damage_increase_by_reduce_hp, char, enemy) => [
        1 + damage_increase_by_reduce_hp / 50,
        char.AA.hp / (char.AA.hp - char.AA.power * damage_increase_by_reduce_hp / 500 * 15)
    ],
    damage_increase_by_iq: (damage_increase_by_iq, char, enemy) => [
        1 + damage_increase_by_iq * char.AA.iq / 12000,
        1
    ],
    strength_accumulation: (strength_accumulation, char, enemy) => {
        const frame = CONSTANT.TURN * 50;
        const act = frame / 3 * strength_accumulation;
        const pas = frame / 50 * char.AA.strength_accumulation_when_being_attacked;
        const atk_count = frame / (10000 / CALC.speed(char.AA.speed));
        const oldMul = 1 + (pas / 1600) * CALC.strength_accumulation_value(1600) / atk_count * 0.9;
        const newMul = 1 + ((act + pas) / 1600) * CALC.strength_accumulation_value(1600) / atk_count * 0.9;
        return [
            newMul / oldMul,
            1
        ];
    },
    strength_accumulation_when_being_attacked: (strength_accumulation_when_being_attacked, char, enemy) => {
        const frame = CONSTANT.TURN * 50;
        const act = frame / 3 * char.AA.strength_accumulation;
        const pas = frame / 50 * strength_accumulation_when_being_attacked;
        const atk_count = frame / (10000 / CALC.speed(char.AA.speed));
        const oldMul = 1 + (act / 1600) * CALC.strength_accumulation_value(1600) / atk_count * 0.9;
        const newMul = 1 + ((act + pas) / 1600) * CALC.strength_accumulation_value(1600) / atk_count * 0.9;
        return [
            newMul / oldMul,
            1
        ];
    },
    damage_increase_with_less_hp: (damage_increase_with_less_hp, char, enemy) => [
        1 + damage_increase_with_less_hp / 200,
        1
    ],
    critical_damage_increase: (critical_damage_increase, char, enemy) => {
        const p = CALC.critical(char.AA.critical);
        const oldMul = 1 + p;
        const newMul = (1 - p) + 2 * p * (1 + critical_damage_increase / 100);
        return [
            newMul / oldMul,
            1
        ];
    },
    accuracy_damage_increase: (accuracy_damage_increase, char, enemy) => {
        const p = CALC.accuracy(char.AA.accuracy);
        const ep1 = CALC.shift_attack(enemy.getShiftAttack()) * (1 - CONSTANT.CD_SUB_RATIO * 20);
        const ep2 = CALC.dodge(enemy.getDodge()) * (1 - CONSTANT.CD_SUB_RATIO * 3);
        const ep3 = CALC.break_move(enemy.getBreakMove()) * (1 - CONSTANT.CD_SUB_RATIO * 20);
        const oldMul = p + (1 - p) * (1 - ep1) * (1 - ep2) * (1 - ep3);
        const newMul = p * (1 + accuracy_damage_increase / 100) + (1 - p) * (1 - ep1) * (1 - ep2) * (1 - ep3);
        return [
            newMul / oldMul,
            1
        ];
    },
    damage_increase_by_unknown_eft: (damage_increase_by_unknown_eft, char, enemy) => [
        1 + damage_increase_by_unknown_eft / (80 + 0.3 * damage_increase_by_unknown_eft),
        1
    ],
    damage_increase_by_speed: (damage_increase_by_speed, char, enemy) => [
        1 + damage_increase_by_speed * char.AA.speed / (25000 + 70 * char.AA.speed),
        1
    ],
    counterattack: (counterattack, char, enemy) => {
        const p = CALC.counterattack(counterattack) * (1 - CONSTANT.CD_SUB_RATIO * 10);
        const skill = CONSTANT.ENEMY_OTHER_SKILL + CALC.counterattack_add_skill(counterattack);
        const dmg = (skill + 100) / (CONSTANT.ENEMY_MAIN_SKILL + 100) * CALC.counterattack_k(counterattack);
        return [
            1 + p * dmg * 0.5,
            1
        ];
    },
    // injury: (injury, char, enemy) => [1, 1],
    // no_ignore_injury: (no_ignore_injury, char, enemy) => [1, 1],
    revival: (revival, char, enemy) => {
        let mul = 1;
        for (let count = 1; count < 4; count++) {
            let p = CALC.revival(revival, count);
            count === 1 && (p = Math.min(1, p * (1 + char.getBoostRevive())));
            mul += p * CALC.revival_hp(revival, char.AA.hp, count) / char.AA.hp;
        }
        return [
            1,
            1 / mul
        ];
    },
    // stiff: (stiff, char, enemy) => [1, 1],
    // keep_alive: (keep_alive, char, enemy) => [1, 1],
    // dodge_attempt_ratio: (dodge_attempt_ratio, char, enemy) => [1, 1],
    hp_absorb: (hp_absorb, char, enemy) => [
        1,
        1 / (1 + hp_absorb / 100 * (100 - char.AA.benevolence) / 200)
    ],
    hp_recovery: (hp_recovery, char, enemy) => [
        1,
        char.AA.hp / (char.AA.hp + CONSTANT.TURN * 50 / 2 * hp_recovery / 3)
    ],
    // mp_recovery: (mp_recovery, char, enemy) => [1, 1],
    // injury_recovery: (injury_recovery, char, enemy) => [1, 1],
    // ignore_injury: (ignore_injury, char, enemy) => [1, 1],
    evil_hp_recovery: (evil_hp_recovery, char, enemy) => [
        1,
        char.AA.benevolence < 0 ? char.AA.hp / (char.AA.hp + CONSTANT.TURN * 50 / 2 * evil_hp_recovery / 3) : 1
    ],
    // mp_absorb: (mp_absorb, char, enemy) => [1, 1],
    // mp_elimination: (mp_elimination, char, enemy) => [1, 1],
    damage_reduce_with_more_mp: (damage_reduce_with_more_mp, char, enemy) => [
        1,
        1 - damage_reduce_with_more_mp / (100 + damage_reduce_with_more_mp * 1.3)
    ],
    // reduce_mp: (reduce_mp, char, enemy) => [1, 1],
    // damage_to_poisoned: (damage_to_poisoned, char, enemy) => [1, 1],
    // stap: (stap, char, enemy) => [1, 1],
    // poison: (poison, char, enemy) => [1, 1],
    // blind: (blind, char, enemy) => [1, 1],
    // poison_all_over: (poison_all_over, char, enemy) => [1, 1],
    // stap_cause_injury: (stap_cause_injury, char, enemy) => [1, 1],
    // ignore_hidden_weapon: (ignore_hidden_weapon, char, enemy) => [1, 1],
    // no_ignore_stap: (no_ignore_stap, char, enemy) => [1, 1],
    // no_ignore_poison: (no_ignore_poison, char, enemy) => [1, 1],
    // boost_stap: (boost_stap, char, enemy) => [1, 1],
    // boost_fracture: (boost_fracture, char, enemy) => [1, 1],
    power: (power, char, enemy) => [
        power / 1000,
        1
    ],
    // attack_distance: (attack_distance, char, enemy) => [1, 1],
    // attack_range: (attack_range, char, enemy) => [1, 1],
    // fracture: (fracture, char, enemy) => [1, 1],
    // fade: (fade, char, enemy) => [1, 1],
    // boost_blind: (boost_blind, char, enemy) => [1, 1],
    // stap_recovery: (stap_recovery, char, enemy) => [1, 1],
    // poison_recovery: (poison_recovery, char, enemy) => [1, 1],
    // ignore_stap: (ignore_stap, char, enemy) => [1, 1],
    // ignore_poison: (ignore_poison, char, enemy) => [1, 1],
    // slap_rebound: (slap_rebound, char, enemy) => [1, 1],
    type: (type, char, enemy) => {
        const k = CONSTANT.TYPE[type];
        const same = CONSTANT.ENEMY_MAIN_SKILL / 2 + CONSTANT.ENEMY_MAIN_SKILL / (type === proto.jyf.Eft.Type.HIDDEN_WEAPON ? 20 : 10);
        const diff = CONSTANT.ENEMY_OTHER_SKILL / 2 + CONSTANT.ENEMY_MAIN_SKILL / (type === proto.jyf.Eft.Type.HIDDEN_WEAPON ? 20 : 10);
        return [
            100 * (k / (same + 100) + (1 - k) / (diff + 100)),
            1
        ];
    },
    main_skill: (main_skill, char, enemy) => {
        const k = CALC.main_skill(main_skill);
        const p1 = CALC.shift_attack(char.AA.shift_attack) * (1 - CONSTANT.CD_SUB_RATIO * 20);
        let p2_0 = CALC.dodge(char.AA.dodge);
        char.AA.dodge_attempt_ratio && (p2_0 += (1 - p2_0) * p2_0 * CALC.dodge_attempt_ratio(char.AA.dodge_attempt_ratio));
        const p2 = p2_0 * (1 - CONSTANT.CD_SUB_RATIO * 3);
        const p3 = CALC.break_move(char.AA.break_move) * (1 - CONSTANT.CD_SUB_RATIO * 20);
        const reduce = (1 - k) * (1 - k * (1 - CONSTANT.CD_SUB_RATIO * 20));
        const epa = CALC.accuracy(enemy.getAccuracy());
        const oldMul = epa * (1 - char.getDodgeIgnoreAccuracy() * p2) + (1 - epa) * (1 - p1) * (1 - p2) * (1 - p3);
        const newMul = epa * (1 - char.getDodgeIgnoreAccuracy() * p2) + (1 - epa) * (1 - p1) * (1 - p2) * (1 - p3) * reduce;
        return [
            1,
            newMul / oldMul
        ];
    },
}

const CALC = {
    speed: (speed) => 400 - 360 * Math.exp(-0.005 * speed),
    injury: (injury, enemy_ignore_injury) => injury * 50 / (50 + enemy_ignore_injury),
    poison: (poison, enemy_ignore_poison) => poison * 50 / (50 + enemy_ignore_poison),
    stap: (stap, enemy_ignore_stap) => stap * 50 / (50 + enemy_ignore_stap),
    poison_all_over: (poison_all_over, enemy_ignore_poison) => poison_all_over * 50 / (50 + enemy_ignore_poison),
    ignore_defense: (ignore_defense) => ignore_defense / (70 + 1.5 * ignore_defense),
    constitution: (constitution, additionalEfts) => Math.min((10 + additionalEfts) * 100, constitution) * 10,
    ignore_skill: (ignore_skill, enemy_skill) => 100 - 8000 / (80 + ignore_skill) + enemy_skill * ignore_skill / (200 + 2 * ignore_skill),
    critical: (critical) => critical / (100 + critical),
    borrow_strength: (borrow_strength, attack, enemy_attack) => enemy_attack / (enemy_attack + attack + 30) * 2 * borrow_strength / (borrow_strength + 100),
    damage_increase: (damage_increase, current_mp, cost) => damage_increase * (1 - Math.exp(-0.0001 * (current_mp + cost * 10))) / (100 + 0.5 * damage_increase),
    accuracy: (accuracy) => accuracy / (80 + 1.2 * accuracy),
    shift_attack: (shift_attack) => shift_attack / (100 + shift_attack),
    shift_attack_reduce_p: (shift_attack) => shift_attack / (100 + 3 * shift_attack),
    shift_attack_reduce: (shift_attack) => shift_attack / (70 + 1.5 * shift_attack),
    shift_attack_damage_reduce: (shift_attack) => Math.max(0, (CONSTANT.ENEMY_EFT_LEVEL - shift_attack / 3 + 5) / (CONSTANT.ENEMY_EFT_LEVEL + shift_attack / 3 + 5)),
    dodge: (dodge) => dodge / (95 + 1.2 * dodge),
    dodge_reduce_p: (dodge) => dodge / (200 + 3 * dodge),
    dodge_reduce: (dodge) => dodge / (140 + 1.5 * dodge),
    break_move: (break_move) => break_move / (100 + break_move),
    break_move_reduce_p: (break_move) => break_move / (100 + 3 * break_move),
    break_move_reduce: (break_move) => break_move / (70 + 1.5 * break_move),
    damage_reduce: (damage_reduce, current_mp) => 1 - (damage_reduce * 0.5 + 100) / (100 + damage_reduce * (1.5 - Math.exp(-0.0002 * current_mp))),
    armor_defense: (armor_defense) => armor_defense / (100 + 2 * armor_defense),
    damage_reduce_from_male: (damage_reduce_from_male) => damage_reduce_from_male / (100 + 2 * damage_reduce_from_male),
    mp_defense: (mp_defense) => mp_defense / (100 + mp_defense),
    damage_rebound: (damage_rebound) => damage_rebound / (100 + damage_rebound),
    damage_rebound_damage: (enemy_damage_reduce) => 100 / (enemy_damage_reduce + 100),
    damage_increase_to_female: (damage_increase_to_female) => 100 / (100 + damage_increase_to_female),
    damage_increase_to_evil: (damage_increase_to_evil, benevolence) => Math.max(-CONSTANT.ENEMY_BENEVOLENCE, 0.5 * (benevolence - CONSTANT.ENEMY_BENEVOLENCE)) * damage_increase_to_evil / (8000 + 30 * damage_increase_to_evil),
    damage_increase_by_evil: (damage_increase_by_evil, benevolence) => (50 - 0.5 * benevolence) * damage_increase_by_evil / (8000 + 30 * damage_increase_by_evil),
    strength_accumulation_value: (strength_accumulation_value) => strength_accumulation_value / (500 + 0.3 * strength_accumulation_value) - 1,
    counterattack: (counterattack) => counterattack / (100 + counterattack),
    counterattack_add_skill: (counterattack) => counterattack + CONSTANT.ENEMY_MAIN_SKILL * counterattack / (2 * counterattack + 100),
    counterattack_k: (counterattack) => 1 - Math.exp(-0.0035 * counterattack) + counterattack / 6 / (CONSTANT.ENEMY_EFT_LEVEL + 5),
    main_skill: (main_skill) => main_skill / (1.5 * CONSTANT.ENEMY_MAIN_SKILL + main_skill),
    double_hit: (double_hit) => 1 - Math.exp(-0.018 * double_hit),
    dodge_attempt_ratio: (dodge_attempt_ratio) => dodge_attempt_ratio / (70 + dodge_attempt_ratio * 1.5),
    revival: (revival, count) => (1 - Math.exp(-revival * 0.018)) / count,
    revival_hp: (revival, hp, count) => Math.min(hp, hp * (1 - Math.exp(-revival * 0.01)) / count + 50 * revival),
};

function splitAndUpper(str) {
    let e = "";
    for (let i of str.split("_")) {
        e = e + i.charAt(0).toUpperCase() + i.slice(1);
    }
    return e;
}

function splitAndLower(str) {
    let e = "";
    for (let i of str.split(/(?=[A-Z])/)) {
        e = e + i.charAt(0).toLowerCase() + i.slice(1) + "_";
    }
    return e.slice(0, -1);
}

export {splitAndUpper, splitAndLower};

Array.prototype.addDelta = function (key, char) {
    const oldBP = char.BP[key];
    const newBP = char.calcBP(key);
    this[0] *= newBP[0] / oldBP[0];
    this[1] *= (newBP[1] / oldBP[1]) || 0;
    return this;
}

proto.jyf.AttributeEnhancement.EFT_LIST = N.map(list => list.map(str => splitAndLower(str)));
proto.jyf.AttributeEnhancement.prototype.addAttrEnh = function (attrEnh, mul, char, attrList, team) {
    team || (team = [char]);
    if ((attrEnh.getRequiredGender() === proto.jyf.Gender.GENDER_UNKNOWN || char.getGender() === attrEnh.getRequiredGender()) && !(attrEnh.getRequiredPositiveBenevolence() && char.getBenevolence() <= 0 || attrEnh.getRequiredNegativeBenevolence() && char.getBenevolence() >= 0)) {
        if (attrEnh.getMultiplyByEftId() > 0) {
            let o = char.getEftsList().find((t) => {
                return t.getId() === attrEnh.getMultiplyByEftId();
            });
            if (null == o) {
                return;
            }
            mul = o.getLevel();
        }
        if (attrEnh.getRequiredEftId() > 0) {
            if (null == char.getEftsList().find((t) => {
                return t.getId() === attrEnh.getRequiredEftId();
            })) {
                return;
            }
        }
        if (attrEnh.getMultiplyByEftType() !== proto.jyf.Eft.Type.UNKNOWN) {
            mul = 0;
            for (let o of char.getEftsList()) {
                if (!(o.getLevel() < 10)) {
                    if (co.getEftProto(o.getId()).getType() === attrEnh.getMultiplyByEftType()) {
                        ++mul;
                    }
                }
            }
        }
        if (attrEnh.getMultiplyByEfts()) {
            mul = 0;
            for (let e of char.getEftsList()) {
                if (e.getLevel() >= 10) {
                    ++mul;
                }
            }
        }
        attrEnh.getPerTenIq() && (mul = Math.floor(char.getIq() / 10));
        if (attrEnh.getMultiplyByPractice()) {
            mul = 0;
            for (let e of char.getEftsList()) {
                mul = mul + e.getPracticeCount();
            }
        }
        attrEnh.getMultiplyByTeamMembers() && (mul = team.length - 1);
        if (attrEnh.getMultiplyByTeamMembersGender() !== proto.jyf.Gender.GENDER_UNKNOWN) {
            mul = 0;
            for (let n of team) {
                if (n.getGender() === attrEnh.getMultiplyByTeamMembersGender()) {
                    ++mul;
                }
            }
        }
        if (!attrList) {
            attrList = x;
        }
        for (let a of attrList) {
            this["setAdd" + a](this["getAdd" + a]() + attrEnh["getAdd" + a]() * mul);
        }
        for (let t of D) {
            this["setAdd" + t](Math.max(this["getAdd" + t](), attrEnh["getAdd" + t]()));
        }
    }
};

proto.jyf.EftEnhancement.EFT_LIST = W.map(list => list.map(str => splitAndLower(str)));
proto.jyf.EftEnhancement.prototype.addEftEnh = function (eftEnh, mul, attrList) {
    if (!attrList) {
        attrList = U;
    }
    for (let attr of attrList) {
        this["setAdd" + attr](this["getAdd" + attr]() + eftEnh["getAdd" + attr]() * mul);
    }
};

proto.jyf.Character.PROP_LIST = {
    BP_total: '综合',
    BP_special: '特殊',
    BP_attack: '输出',
    BP_defense: '防守',
    name: '主角',
    team: '队伍',
    eftName: '主武功',
    power: '威力',
    attack_distance: '攻击距离',
    attack_range: '打击范围',
};
proto.jyf.Character.ATTR_LIST = {
    hp: '最大生命',
    mp: '最大内力',
    attack: '攻击',
    defense: '防御',
    speed: '速度',
    fist: '拳掌',
    sword: '御剑',
    knife: '耍刀',
    unusual: '奇门',
    hidden_weapon: '暗器',
    iq: '悟性',
    benevolence: '仁义',
    constitution: '气血充盈',
    current_mp: '平均内力',
    critical: '暴起一击',
    double_hit: '左右开弓',
    borrow_strength: '借力打力',
    ignore_defense: '以虚击实',
    ignore_skill: '以巧胜拙',
    damage_increase: '劲雄凝重',
    accuracy: '出其不意',
    damage_reduce: '内功卸力',
    armor_defense: '宝甲护体',
    damage_reduce_from_male: '倾国倾城',
    dodge: '闪躲趋避',
    shift_attack: '牵引挪移',
    damage_rebound: '内力反震',
    break_move: '料敌机先',
    mp_defense: '真气护体',
    sharp: '切金断玉',
    damage_increase_to_female: '无耻下流',
    damage_increase_to_evil: '惩奸除恶',
    damage_increase_by_evil: '心狠手辣',
    damage_increase_by_reduce_hp: '舍身一击',
    damage_increase_by_iq: '攻敌破绽',
    strength_accumulation: '积蓄劲力',
    strength_accumulation_when_being_attacked: '借力蓄力',
    damage_increase_with_less_hp: '越战越勇',
    critical_damage_increase: '一击制敌',
    accuracy_damage_increase: '攻其不备',
    damage_increase_by_unknown_eft: '无迹可寻',
    damage_increase_by_speed: '以快制慢',
    counterattack: '借招还招',
    injury: '附加内伤',
    no_ignore_injury: '强化致伤',
    revival: '起死回生',
    stiff: '真气反噬',
    keep_alive: '屹立不倒',
    dodge_attempt_ratio: '趋退若神',
    hp_absorb: '嗜血成性',
    hp_recovery: '生命回复',
    mp_recovery: '内力回复',
    injury_recovery: '内伤回复',
    ignore_injury: '内伤抗性',
    evil_hp_recovery: '吸饮生血',
    mp_absorb: '内力吸取',
    mp_elimination: '消敌内力',
    damage_reduce_with_more_mp: '气贯周身',
    poison: '附加中毒',
    poison_all_over: '周身剧毒',
    no_ignore_poison: '强化毒性',
    damage_to_poisoned: '万毒噬心',
    cost: '消耗内力',
    type: '主兵器',
    main_skill: '拆招兵器',
};
proto.jyf.Character.HIDDEN_ATTR_LIST = {
    //main_skill: '主兵器值',
};
proto.jyf.Character.TYPE_KEY_LIST = ["unknown", "fist", "sword", "knife", "unusual", "light", "internal", "hidden_weapon", "special"];
proto.jyf.Character.prototype.updateAABP = function () {
    this.AA = {};
    [...Object.keys(proto.jyf.Character.PROP_LIST), ...Object.keys(proto.jyf.Character.HIDDEN_ATTR_LIST)].forEach(key => {
        const upperKey = splitAndUpper(key);
        this["get" + upperKey] && (this.AA[key] = this["get" + upperKey]());
    });
    Object.keys(proto.jyf.Character.ATTR_LIST).forEach(key => {
        const upperKey = splitAndUpper(key);
        const eftEnh = this.getEftInfo().getEftEnhancement();
        let value = 0;
        this["get" + upperKey] && (value += this["get" + upperKey]());
        eftEnh && eftEnh["getAdd" + upperKey] && (value += eftEnh["getAdd" + upperKey]());
        this.AA[key] = value;
    });

    this.BP = {};
    Object.keys(this.AA).forEach(key => {
        BP[key] ?
            this.BP[key] = this.calcBP(key) :
            this.BP[key] = [1, 1];
    });

    const bpv = [1, 1];
    let skill_defense = 0;
    for (const key in this.BP) {
        bpv[0] *= this.BP[key][0];
        proto.jyf.Character.TYPE_KEY_LIST.includes(key) ?
            skill_defense += this.BP[key][1] :
            bpv[1] *= this.BP[key][1];
    }
    this.BP.skill_defense = [1, skill_defense];

    this.AA.BP_attack = CONSTANT.BP_ATTACK_RATIO * bpv[0];
    this.AA.BP_defense = CONSTANT.BP_DEFENSE_RATIO / bpv[1] / skill_defense;
    this.AA.BP_total = CONSTANT.BP_TOTAL_RATIO * bpv[0] / bpv[1] / skill_defense;

    const [poison, poison_all_over, no_ignore_poison, damage_to_poisoned] = [this.AA.poison, this.AA.poison_all_over, this.AA.no_ignore_poison, this.AA.damage_to_poisoned];
    const enemy_ignore_poison = Math.max(0, 17 - no_ignore_poison);
    const enemy_poisoned = (poison + poison_all_over * 0.5) * 50 / (50 + enemy_ignore_poison);
    const dmg_poison = [
        enemy_poisoned * 0.01 * 50 / 3,
        (1 + this.getDamageToPoisonedAttempt()) * (enemy_poisoned + poison * 25 / (50 + enemy_ignore_poison)) * damage_to_poisoned / (100 + 0.3 * damage_to_poisoned) * (0.3 + 15000 / 50000),
        (1 + this.getDamageToPoisonedAttempt()) * (enemy_poisoned + poison_all_over * 25 / (50 + enemy_ignore_poison)) * damage_to_poisoned / (100 + 0.3 * damage_to_poisoned) * (0.3 + 15000 / 50000),
    ];
    this.AA.BP_special = (dmg_poison[0] + dmg_poison[1] * this.BP.speed[0] * this.BP.accuracy[0] * (this.BP.double_hit[0] || 1) + dmg_poison[2]) * this.AA.BP_defense / 500;
    return this;
};
proto.jyf.Character.prototype.calcBP = function (key) {
    if (!this.AA[key] || !BP[key]) return [1, 1];
    return BP[key](this.AA[key], this, this.enemy);
};
proto.jyf.Character.prototype.updateFinal = function (gridOptions) {
    const EftLevelMaxOnce = () => {
        let hasLevelUp = false;
        this.final = co.finalizeCharacterProto(this);
        for (let eftInfo of this.getEftsList()) {
            let newLevel = 10;
            let newEftInfo = co.getEftInfoProto(this.final, eftInfo.getId());
            if (newEftInfo.hasEftEnhancement()) {
                newLevel += newEftInfo.getEftEnhancement().getAddMaxLevel();
            }
            if (newLevel !== eftInfo.getLevel()) {
                eftInfo.setLevel(newLevel);
                if (gridOptions) gridOptions.api.getRowNode(eftInfo.getId()).setDataValue("level", newLevel);
                hasLevelUp = true;
            }
        }
        return hasLevelUp;
    }

    // noinspection StatementWithEmptyBodyJS
    for (; EftLevelMaxOnce();) ;
    this.final = co.finalizeCharacterProto(this, this.team);
    this.final.setOrigin(this).setMainEft(this.mainEft).setTeam(this.team).setEnemy(this.enemy).setActRelations(this.actRelations).updateAABP();
    return this;
};
proto.jyf.Character.prototype.setOrigin = function (origin) {
    this.origin = origin;
    return this;
};
proto.jyf.Character.prototype.setMainEft = function (eft) {
    this.mainEft = eft;
    return this;
};
proto.jyf.Character.prototype.setTeam = function (team) {
    this.team = team;
    return this;
};
proto.jyf.Character.prototype.setEnemy = function (enemy) {
    this.enemy = enemy;
    return this;
};
proto.jyf.Character.prototype.getTeam = function (team) {
    return this.team.slice(1).map(char => char.getName()).toString();
};
proto.jyf.Character.prototype.getEftName = function () {
    return this.mainEft.getName();
};
proto.jyf.Character.prototype.getEftInfo = function () {
    if (this.mainEftInfo) return this.mainEftInfo;
    this.mainEftInfo = co.getEftInfoProto(this, this.mainEft.getId());
    return this.mainEftInfo;
}
proto.jyf.Character.prototype.getType = function () {
    return this.mainEft.getType();
};
proto.jyf.Character.prototype.getPower = function () {
    return co.getEftInfoPower(this.getEftInfo(), this);
};
proto.jyf.Character.prototype.getAttackDistance = function () {
    return co.getEftInfoAttackDistance(this.getEftInfo(), this);
};
proto.jyf.Character.prototype.getAttackRange = function () {
    return co.getEftInfoAttackRange(this.getEftInfo(), this);
};
proto.jyf.Character.prototype.getCost = function () {
    return co.getEftInfoCost(this.getEftInfo(), this);
}
proto.jyf.Character.prototype.getMainSkill = function () {
    return Math.max(this.AA.fist || 0, this.AA.sword || 0, this.AA.knife || 0, this.AA.unusual || 0);
}
proto.jyf.Character.prototype.getCurrentMp = function () {
    const mp = this.getMp();
    const frame = CONSTANT.TURN * 50 / 2;
    const double_hit = this.getDoubleHit() + (this.getEftInfo().hasEftEnhancement() ? this.getEftInfo().getEftEnhancement().getAddDoubleHit() : 0);
    const cost = frame / (10000 / CALC.speed(this.getSpeed())) * this.getCost() * (1 + CALC.double_hit(double_hit));
    const recovery = frame / 3 * this.getMpRecovery();
    const absorb = frame * this.getMpAbsorb();
    const defense = this.getHp() * CALC.mp_defense(this.getMpDefense()) * (1 - CONSTANT.CD_SUB_RATIO * 40 * (1 - this.getMpDefenseNoCd())) * (1 - this.getMpDefenseNoCost());
    return Math.min(mp, mp - cost + recovery + absorb - defense);
};
proto.jyf.Character.prototype.setActRelations = function (actRelations) {
    this.actRelations = actRelations;
    return this;
};
proto.jyf.Character.prototype.getActRelations = function () {
    if (!this.actRelations) return [];
    return this.actRelations;
};
proto.jyf.Character.prototype.updateActRelations = function () {
    this.actRelations = [];
    for (let relation of Se[this.getId()]) {
        if (isRelationAct(this.team, relation)) this.actRelations.push(relation);
    }
    return this;
};
proto.jyf.Character.exportJson = function (char) {
    const data = proto.jyf.Character.saveCharacter(char);
    const filename = (data.isLeader ? "主角" : "队友") + "_" + data.name + data.team.length + "_" + data.mainEft + "_" + char.AA.BP_total.toFixed(0) + "_" + char.AA.BP_attack.toFixed(0) + "_" + char.AA.BP_defense.toFixed(0) + ".json";

    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, '\t')], {type: 'application/json'}));
    link.download = filename;
    link.click();
};
proto.jyf.Character.saveCharacter = function (char) {
    if (char.getId() !== 1) {
        return {
            isLeader: char.getAdditionalEfts() > 0,
            name: char.getName(),
            mainEft: char.getEftName(),
            weapon: co.getEquipmentProto(char.getWeapon().getId()).getName(),
            armor: co.getEquipmentProto(char.getArmor().getId()).getName(),
            benevolence: char.getBenevolence(),
            team: char.team.map(char => char.getName()),
            efts: char.getEftsList().map(eftInfo => co.getEftProto(eftInfo.getId()).getName()),
            practice: char.getEftsList().map(eftInfo => eftInfo.getPracticeCount())
        };
    } else {
        const baseChar = co.getCharacterProto(1);
        return {
            isLeader: true,
            name: char.getName(),
            mainEft: char.getEftName(),
            weapon: co.getEquipmentProto(char.getWeapon().getId()).getName(),
            armor: co.getEquipmentProto(char.getArmor().getId()).getName(),
            benevolence: char.getBenevolence(),
            team: char.team.map(char => char.getName()),
            efts: char.getEftsList().map(eftInfo => co.getEftProto(eftInfo.getId()).getName()),
            practice: char.getEftsList().map(eftInfo => eftInfo.getPracticeCount()),
            add: {
                hp: char.origin.getHp() - baseChar.getHp(),
                mp: char.origin.getMp() - baseChar.getMp(),
                attack: char.origin.getAttack() - baseChar.getAttack(),
                defense: char.origin.getDefense() - baseChar.getDefense(),
                speed: char.origin.getSpeed() - baseChar.getSpeed(),
                fist: char.origin.getFist() - baseChar.getFist(),
                sword: char.origin.getSword() - baseChar.getSword(),
                knife: char.origin.getKnife() - baseChar.getKnife(),
                unusual: char.origin.getUnusual() - baseChar.getUnusual(),
                hidden_weapon: char.origin.getHiddenWeapon() - baseChar.getHiddenWeapon(),
                iq: char.origin.getIq() - baseChar.getIq()
            }
        };
    }
};
proto.jyf.Character.importJson = function (callback) {
    function handleFileSelect(event) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = function (event) {
            const jsonData = event.target.result;
            proto.jyf.Character.loadCharacter(JSON.parse(jsonData), callback);
        };

        reader.readAsText(file);
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', handleFileSelect, false);

    fileInput.click();
};
proto.jyf.Character.loadCharacter = function (data, callback) {
    if (co.getCharacterProtos().find(char => char.getName() === data.name)) {
        const char = co.getCharacterProtos().find(char => char.getName() === data.name).cloneMessage();
        char.setAdditionalEfts(data.isLeader ? 2 : 0);
        char.setMainEft(co.getEftProtos().find(eft => eft.getName() === data.mainEft).applyJointAttack(char));
        const weaponId = data.weapon ? co.getEquipmentProtos().find(eq => eq.getName() === data.weapon).getId() : 0;
        const armorId = data.armor ? co.getEquipmentProtos().find(eq => eq.getName() === data.armor).getId() : 0;
        char.setWeapon(weaponId ? new proto.jyf.Character.EquipmentInfo().setId(weaponId).setQuality(1) : new proto.jyf.Character.EquipmentInfo());
        char.setArmor(armorId ? new proto.jyf.Character.EquipmentInfo().setId(armorId).setQuality(1) : new proto.jyf.Character.EquipmentInfo());
        data.isLeader && char.setBenevolence(data.benevolence);
        char.setTeam([char].concat(data.team.filter(charName => charName !== data.name).map(charName => {
            let mate = co.getCharacterProtos().find(char => char.getName() === charName);
            if (!mate) {
                const gift = co.getGiftProtos().find(gift => gift.getName() === charName);
                mate = co.getCharacterProtos()[0].cloneMessage();
                mate.setAttributeEnhancementsList(gift.getAttributeEnhancementsList());
                mate.setEftEnhancementsList(gift.getEftEnhancementsList());
                mate.setAdditionalEfts(gift.getAdditionalEfts());
                mate.setName(charName);
            }
            return mate;
        })));
        if (!data.efts.includes(data.mainEft)) data.efts.push(data.mainEft);
        char.setEftsList(data.efts.map(eftName => new proto.jyf.Character.EftInfo().setId(co.getEftProtos().find(eft => eft.getName() === eftName).getId()).setLevel(10)));
        data.isLeader && data.practice.forEach((count, i) => char.getEftsList()[i] && char.getEftsList()[i].setPracticeCount(count));
        if (char.getEftsList().find(eftInfo => co.getEftProto(eftInfo.getId()).getRequiredGender() === proto.jyf.Gender.GENDER_SHEMALE)) {
            if (co.getCharacterProtos().find(char => char.getName() === data.name).getGender() !== proto.jyf.Gender.GENDER_SHEMALE) {
                char.setDamageIncrease(-20);
                char.setDamageReduce(-20);
                char.setGender(proto.jyf.Gender.GENDER_SHEMALE);
            }
        }

        callback(char);
    } else if (co.getGiftProtos().find(gift => gift.getName() === data.name)) {
        const char = co.getCharacterProtos()[0].cloneMessage();
        const gift = co.getGiftProtos().find(gift => gift.getName() === data.name);
        char.setAttributeEnhancementsList(gift.getAttributeEnhancementsList());
        char.setEftEnhancementsList(gift.getEftEnhancementsList());
        char.setAdditionalEfts(gift.getAdditionalEfts());
        char.setName(data.name);
        char.setMainEft(co.getEftProtos().find(eft => eft.getName() === data.mainEft).applyJointAttack(char));
        const weaponId = data.weapon ? co.getEquipmentProtos().find(eq => eq.getName() === data.weapon).getId() : 0;
        const armorId = data.armor ? co.getEquipmentProtos().find(eq => eq.getName() === data.armor).getId() : 0;
        char.setWeapon(weaponId ? new proto.jyf.Character.EquipmentInfo().setId(weaponId).setQuality(1) : new proto.jyf.Character.EquipmentInfo());
        char.setArmor(armorId ? new proto.jyf.Character.EquipmentInfo().setId(armorId).setQuality(1) : new proto.jyf.Character.EquipmentInfo());
        char.setBenevolence(data.benevolence);
        char.setTeam([char].concat(data.team.filter(charName => charName !== data.name).map(charName => co.getCharacterProtos().find(char => char.getName() === charName)).filter(mate => typeof mate !== "undefined")));
        if (!data.efts.includes(data.mainEft)) data.efts.push(data.mainEft);
        char.setEftsList(data.efts.map(eftName => new proto.jyf.Character.EftInfo().setId(co.getEftProtos().find(eft => eft.getName() === eftName).getId()).setLevel(10)));
        data.practice.forEach((count, i) => char.getEftsList()[i] && char.getEftsList()[i].setPracticeCount(count));
        for (const key in data.add) {
            const upper = splitAndUpper(key);
            char["set" + upper](char["get" + upper]() + data.add[key]);
        }
        if (char.getEftsList().find(eftInfo => co.getEftProto(eftInfo.getId()).getRequiredGender() === proto.jyf.Gender.GENDER_SHEMALE)) {
            char.setDamageIncrease(-20);
            char.setDamageReduce(-20);
            char.setGender(proto.jyf.Gender.GENDER_SHEMALE);
        }

        callback(char);
    } else {
        console.warn("No such character:", data.name);
    }
};

proto.jyf.Eft.PROP_LIST = {
    id: "ID",
    name: "名称",
    delta_total: "△总",
    delta_special: "△特",
    delta_attack: "△攻",
    delta_defense: "△防",
    type: "主类型",
    secondary_type: "副类型",
};
proto.jyf.Eft.ATTR_LIST = {
    attack: '攻击',
    defense: '防御',
    speed: '速度',
    fist: '拳掌',
    sword: '御剑',
    knife: '耍刀',
    unusual: '奇门',
    hidden_weapon: '暗器',
    constitution: '气血充盈',
    mp: '最大内力',
    critical: '暴起一击',
    borrow_strength: '借力打力',
    ignore_defense: '以虚击实',
    ignore_skill: '以巧胜拙',
    damage_increase: '劲雄凝重',
    accuracy: '出其不意',
    damage_reduce: '内功卸力',
    damage_reduce_from_male: '倾国倾城',
    dodge: '闪躲趋避',
    shift_attack: '牵引挪移',
    damage_rebound: '内力反震',
    break_move: '料敌机先',
    mp_defense: '真气护体',
    damage_increase_by_iq: '攻敌破绽',
    strength_accumulation: '积蓄劲力',
    strength_accumulation_when_being_attacked: '借力蓄力',
    critical_damage_increase: '一击制敌',
    accuracy_damage_increase: '攻其不备',
    damage_increase_by_unknown_eft: '无迹可寻',
    damage_increase_by_speed: '以快制慢',
    counterattack: '借招还招',
    injury: '附加内伤',
    no_ignore_injury: '强化致伤',
    revival: '起死回生',
    stiff: '真气反噬',
    keep_alive: '屹立不倒',
    dodge_attempt_ratio: '趋退若神',
    hp_absorb: '嗜血成性',
    hp_recovery: '生命回复',
    mp_recovery: '内力回复',
    injury_recovery: '内伤回复',
    ignore_injury: '内伤抗性',
    evil_hp_recovery: '吸饮生血',
    mp_absorb: '内力吸取',
    mp_elimination: '消敌内力',
    damage_reduce_with_more_mp: '气贯周身',
    double_hit: '左右开弓',
    armor_defense: '宝甲护体',
    sharp: '切金断玉',
    damage_increase_to_female: '无耻下流',
    damage_increase_to_evil: '惩奸除恶',
    damage_increase_by_evil: '心狠手辣',
    damage_increase_by_reduce_hp: '舍身一击',
    damage_increase_with_less_hp: '越战越勇',
    hp: '最大生命',
    poison: '附加中毒',
    poison_all_over: '周身剧毒',
    no_ignore_poison: '强化毒性',
    damage_to_poisoned: '万毒噬心',
    power: '威力',
    power_percent: '威力陡增',
};
proto.jyf.Eft.ALL_KEYS = [...Object.keys(proto.jyf.Eft.PROP_LIST), ...Object.keys(proto.jyf.Eft.ATTR_LIST)];
proto.jyf.Eft.deltaCache = {};
proto.jyf.Eft.prototype.getCache = function (key, value) {
    const cache = proto.jyf.Eft.deltaCache[key];
    if (cache) return cache[value];
    proto.jyf.Eft.deltaCache[key] = {};
    return null;
};
proto.jyf.Eft.prototype.updateAA = function (char) {
    // keyList || (keyList = Object.keys(proto.jyf.Eft.ATTR_LIST));
    this.AA = {};
    Object.keys(proto.jyf.Eft.PROP_LIST).forEach(key => {
        const getter = "get" + splitAndUpper(key);
        this[getter] && (this.AA[key] = this[getter]());
    });
    Object.keys(proto.jyf.Eft.ATTR_LIST).forEach(key => {
        if (!proto.jyf.Eft.ATTR_LIST[key]) return;
        let value = 0;
        let getter = "getAdd" + splitAndUpper(key);
        if (this.mainAttrEnh && this.mainAttrEnh[getter]) value += this.mainAttrEnh[getter]();
        if (this.mainEftEnh && this.mainEftEnh[getter]) value += this.mainEftEnh[getter]();
        if (value) this.AA[key] = value;
    });
    if (this.getRequiredGender() === proto.jyf.Gender.GENDER_SHEMALE && char.getGender() !== proto.jyf.Gender.GENDER_SHEMALE) {
        this.AA.damage_increase = (this.AA.damage_increase || 0) - 20;
        this.AA.damage_reduce = (this.AA.damage_reduce || 0) - 20;
    }
    if (this.getName() === "神行百变") {
        this.AA.dodge += 10;
    }
};
proto.jyf.Eft.prototype.updateDelta = function (char) {
    this.delta = {};
    let main_skill = char.AA.main_skill;
    const dv = [1, 1];
    for (const key in this.AA) {
        if (!proto.jyf.Eft.ATTR_LIST[key]) continue;
        const value = this.AA[key];
        if (proto.jyf.Character.TYPE_KEY_LIST.includes(key) && key !== "hidden_weapon" && char.AA[key] + value > main_skill) {
            main_skill = char.AA[key] + value;
        }
        const cache = this.getCache(key, value);
        if (cache) {
            this.delta[key] = cache;
        } else {
            this.delta[key] = [1, 1];

            char.AA[key] += value;

            if (key === "power") {
                this.delta[key][0] *= 1 + value / char.AA.power_base;
            } else if (key === "power_percent") {
                this.delta[key][0] *= (100 + value + char.AA.power_percent_total) / (100 + char.AA.power_percent_total);
            } else if (key === "constitution") {
                const maxActCon = (char.getAdditionalEfts() + 10) * 100;
                const dHp = (Math.min(char.AA.constitution, maxActCon) - Math.min(char.AA.constitution - value, maxActCon)) * 10;
                char.AA.hp += dHp;
                this.delta[key].addDelta("hp", char);
                char.AA.hp -= dHp;
            } else if (key === "mp") {
                char.AA.current_mp += value;
                this.delta[key]
                    .addDelta("damage_increase", char)
                    .addDelta("damage_reduce", char);
                char.AA.current_mp -= value;
            } else if (key === "mp_recovery") {
                char.AA.current_mp += value / 3 * CONSTANT.TURN * 50 / 2;
                this.delta[key]
                    .addDelta("damage_increase", char)
                    .addDelta("damage_reduce", char);
                char.AA.current_mp -= value / 3 * CONSTANT.TURN * 50 / 2;
            } else if (key === "mp_absorb") {
                char.AA.current_mp += value * CONSTANT.TURN;
                this.delta[key]
                    .addDelta("damage_increase", char)
                    .addDelta("damage_reduce", char);
                char.AA.current_mp -= value * CONSTANT.TURN;
            } else if (key === "attack") {
                this.delta[key]
                    .addDelta("attack", char)
                    .addDelta("borrow_strength", char);
            } else if (key === "speed") {
                this.delta[key]
                    .addDelta("speed", char)
                    .addDelta("damage_increase_by_speed", char)
                    .addDelta("strength_accumulation", char)
                    .addDelta("strength_accumulation_when_being_attacked", char);
            } else if (key === "shift_attack") {
                this.delta[key]
                    .addDelta("shift_attack", char)
                    .addDelta("dodge", char)
                    .addDelta("break_move", char)
                    .addDelta("main_skill", char);
            } else if (key === "dodge") {
                this.delta[key]
                    .addDelta("dodge", char)
                    .addDelta("break_move", char)
                    .addDelta("main_skill", char);
            } else if (key === "break_move") {
                this.delta[key]
                    .addDelta("break_move", char)
                    .addDelta("main_skill", char);
            } else if (proto.jyf.Character.TYPE_KEY_LIST.includes(key)) {
                const ds = [1, 1].addDelta(key, char);
                if (key === proto.jyf.Character.TYPE_KEY_LIST[char.getType()]) {
                    this.delta[key][0] *= ds[0];
                }
                const d = ds[1] * char.BP[key][1] - char.BP[key][1];
                const oldSkillDefense = char.BP.skill_defense[1];
                const newSkillDefense = oldSkillDefense + d;
                this.delta[key][1] *= newSkillDefense / oldSkillDefense;
            } else {
                this.delta[key].addDelta(key, char);
            }

            char.AA[key] -= value;

            proto.jyf.Eft.deltaCache[key][value] = this.delta[key];
        }
        dv[0] *= this.delta[key][0];
        dv[1] *= this.delta[key][1];
    }

    if (main_skill > char.AA.main_skill) {
        const cache = this.getCache("main_skill", main_skill);
        if (cache) {
            this.delta.main_skill = cache;
        } else {
            const oldMainSkill = char.AA.main_skill;
            char.AA.main_skill = main_skill;

            const d_fist = [1, 1].addDelta("fist", char)[1] * char.BP.fist[1] - char.BP.fist[1];
            const d_sword = [1, 1].addDelta("sword", char)[1] * char.BP.sword[1] - char.BP.sword[1];
            const d_knife = [1, 1].addDelta("knife", char)[1] * char.BP.knife[1] - char.BP.knife[1];
            const d_unusual = [1, 1].addDelta("unusual", char)[1] * char.BP.unusual[1] - char.BP.unusual[1];
            const d_hidden_weapon = [1, 1].addDelta("hidden_weapon", char)[1] * char.BP.hidden_weapon[1] - char.BP.hidden_weapon[1];
            const oldSkillDefense = char.BP.skill_defense[1];
            const newSkillDefense = oldSkillDefense + d_fist + d_sword + d_knife + d_unusual + d_hidden_weapon;
            const d = newSkillDefense / oldSkillDefense * [1, 1].addDelta("main_skill", char)[1];
            this.delta.main_skill = [1, d];
            proto.jyf.Eft.deltaCache.main_skill[main_skill] = this.delta.main_skill;

            char.AA.main_skill = oldMainSkill;
        }

        dv[1] *= this.delta.main_skill[1];
    }

    this.AA.delta_attack = (dv[0] - 1) * char.AA.BP_attack;
    this.AA.delta_defense = (1 / dv[1] - 1) * char.AA.BP_defense;
    this.AA.delta_total = (dv[0] / dv[1] - 1) * char.AA.BP_total;
    this.AA.delta_special = this.AA.delta_attack + this.AA.delta_defense;
};
proto.jyf.Eft.prototype.getRelatedEftsList = function () {
    if (this.relatedEftsList) return this.relatedEftsList;
    this.relatedEftsList = [];
    for (let eft of co.getEftProtos()) {
        if (eft.getId() === this.getId()) continue;
        let isRelated = false;
        for (let eftEnh of eft.getEftEnhancementsList()) {
            if (co.isEftEnhancementRelated(eftEnh, this)) {
                isRelated = true;
                break;
            }
        }
        if (!isRelated) {
            for (let attrEnh of eft.getAttributeEnhancementsList()) {
                if (attrEnh.getMultiplyByEftId() === this.getId()) {
                    isRelated = true;
                    break;
                }
                if (attrEnh.getRequiredEftId() === this.getId()) {
                    isRelated = true;
                    break;
                }
            }
        }
        if (isRelated) {
            this.relatedEftsList.push(eft);
        }
    }
    return this.relatedEftsList;
};
proto.jyf.Eft.prototype.getAttrEnhEftsList = function () {
    if (this.attrEnhEftsList) return this.attrEnhEftsList;
    this.attrEnhEftsList = new Set();
    for (let attrEnh of this.getAttributeEnhancementsList()) {
        if (attrEnh.getMultiplyByEftId()) {
            this.attrEnhEftsList.add(co.getEftProto(attrEnh.getMultiplyByEftId()));
        }
        if (attrEnh.getRequiredEftId()) {
            this.attrEnhEftsList.add(co.getEftProto(attrEnh.getRequiredEftId()));
        }
        if (attrEnh.getMultiplyByEftType() !== proto.jyf.Eft.Type.UNKNOWN) {
            co.getEftProtos().filter(eft => eft.getType() === attrEnh.getMultiplyByEftType()).forEach(eft => this.attrEnhEftsList.add(eft));
        }
        if (attrEnh.getMultiplyByEfts()) {
            co.getEftProtos().forEach(eft => this.attrEnhEftsList.add(eft));
        }
    }
    return this.attrEnhEftsList;
};
proto.jyf.Eft.prototype.getMainAttrEnh = function () {
    return this.mainAttrEnh;
};
proto.jyf.Eft.prototype.setMaxLevel = function (maxLevel) {
    this.maxLevel = maxLevel;
};
proto.jyf.Eft.prototype.updateMainAttrEnh = function (char, team) {
    this.mainAttrEnh = new proto.jyf.AttributeEnhancement();
    const level = this.maxLevel || 10;
    for (let attrEnh of this.getAttributeEnhancementsList()) {
        const mul = calcMul(attrEnh, level);
        if (mul) this.mainAttrEnh.addAttrEnh(attrEnh, mul, char, N[this.getId()], team);
    }
    for (let eftEnh of this.getEftEnhancementsList()) {
        if (eftEnh.getAddMaxLevel()) {
            let mul = calcMul(eftEnh, level);
            let eftInfo = co.getEftInfoProto(char, eftEnh.getId());
            if (mul && eftInfo) {
                for (let attrEnh of co.getEftProto(eftInfo.getId()).getAttributeEnhancementsList()) {
                    let mul = calcMul(attrEnh, eftInfo.getLevel() + eftEnh.getAddMaxLevel()) - calcMul(attrEnh, eftInfo.getLevel());
                    if (mul) this.mainAttrEnh.addAttrEnh(attrEnh, mul, char, N[eftInfo.getId()], team);
                }
            }
        }
    }
    for (let attrEnh of char.getAttributeEnhancementsList()) {
        if ((attrEnh.getRequiredGender() === proto.jyf.Gender.GENDER_UNKNOWN || char.getGender() === attrEnh.getRequiredGender()) && !(attrEnh.getRequiredPositiveBenevolence() && char.getBenevolence() <= 0 || attrEnh.getRequiredNegativeBenevolence() && char.getBenevolence() >= 0)) {
            let mul = co.attrEnhRelated(attrEnh, this);
            if (mul) {
                for (let attr of x) {
                    this.mainAttrEnh["setAdd" + attr](this.mainAttrEnh["getAdd" + attr]() + attrEnh["getAdd" + attr]() * mul);
                }
                for (let attr of D) {
                    this.mainAttrEnh["setAdd" + attr](Math.max(this.mainAttrEnh["getAdd" + attr](), attrEnh["getAdd" + attr]()));
                }
            }
        }
    }
    for (let eftInfo of char.getEftsList()) {
        let eft = co.getEftProto(eftInfo.getId());
        for (let attrEnh of eft.getAttributeEnhancementsList()) {
            let mul = calcMul(attrEnh, eftInfo.getLevel());
            if (mul) {
                if ((attrEnh.getRequiredGender() === proto.jyf.Gender.GENDER_UNKNOWN || char.getGender() === attrEnh.getRequiredGender()) && !(attrEnh.getRequiredPositiveBenevolence() && char.getBenevolence() <= 0 || attrEnh.getRequiredNegativeBenevolence() && char.getBenevolence() >= 0)) {
                    mul = mul * co.attrEnhRelated(attrEnh, this);
                    if (mul) {
                        for (let attr of x) {
                            this.mainAttrEnh["setAdd" + attr](this.mainAttrEnh["getAdd" + attr]() + attrEnh["getAdd" + attr]() * mul);
                        }
                        for (let attr of D) {
                            this.mainAttrEnh["setAdd" + attr](Math.max(this.mainAttrEnh["getAdd" + attr](), attrEnh["getAdd" + attr]()));
                        }
                    }
                }
            }
        }
    }
    for (let relation of char.getActRelations()) {
        for (let attrEnh of relation.getAttributeEnhancementsList()) {
            if ((attrEnh.getRequiredGender() === proto.jyf.Gender.GENDER_UNKNOWN || char.getGender() === attrEnh.getRequiredGender()) && !(attrEnh.getRequiredPositiveBenevolence() && char.getBenevolence() <= 0 || attrEnh.getRequiredNegativeBenevolence() && char.getBenevolence() >= 0)) {
                let mul = co.attrEnhRelated(attrEnh, this);
                if (mul) {
                    for (let attr of x) {
                        this.mainAttrEnh["setAdd" + attr](this.mainAttrEnh["getAdd" + attr]() + attrEnh["getAdd" + attr]() * mul);
                    }
                    for (let attr of D) {
                        this.mainAttrEnh["setAdd" + attr](Math.max(this.mainAttrEnh["getAdd" + attr](), attrEnh["getAdd" + attr]()));
                    }
                }
            }
        }
    }
    this.updateAA(char);
};
proto.jyf.Eft.prototype.getMainEftEnh = function () {
    return this.mainEftEnh;
};
proto.jyf.Eft.prototype.updateMainEftEnh = function (char) {
    const eft = char.mainEft;
    this.mainEftEnh = new proto.jyf.EftEnhancement();
    const level = this.maxLevel || 10;
    this.getEftEnhancementsList().forEach(eftEnh => {
        if (co.isEftEnhancementRelated(eftEnh, eft)) {
            const mul = calcMul(eftEnh, level);
            this.mainEftEnh.addEftEnh(eftEnh, mul, W[this.getId()]);
        }
    });
};
proto.jyf.Eft.prototype.applyEftEnhAddMaxLvl = function (level, symbol = 1) {
    level || (this.maxLevel && (level = this.maxLevel)) || (level = 10);
    for (let eftEnh of this.getEftEnhancementsList()) {
        if (eftEnh.getAddMaxLevel()) {
            const mul = calcMul(eftEnh, level);
            if (mul) {
                co.getEftProtos().forEach(eft => {
                    if (co.isEftEnhancementRelated(eftEnh, eft)) {
                        if (!eft.maxLevel) eft.maxLevel = 10;
                        eft.maxLevel += eftEnh.getAddMaxLevel() * mul * symbol;
                    }
                });
            }
        }
    }
};
proto.jyf.Eft.prototype.applyJointAttack = function (char) {
    const jointAttack = this.getJointAttack();
    if (jointAttack) {
        char.setEftEnhancementsList(char.getEftEnhancementsList().concat(jointAttack.getEftEnhancement().setId(this.getId())));
        console.log("apply joint attack")
    }
    return this;
};

co.attrEnhRelated = function (attrEnh, eft) {
    if (eft.getId() === attrEnh.getMultiplyByEftId()) {
        return eft.maxLevel || 10;
    }
    if (eft.getId() === attrEnh.getRequiredEftId()) {
        return 1;
    }
    if (attrEnh.getMultiplyByEftType() !== proto.jyf.Eft.Type.UNKNOWN) {
        return eft.getType() === attrEnh.getMultiplyByEftType() ? 1 : 0;
    }
    if (attrEnh.getMultiplyByEfts()) {
        return 1;
    }
    return 0;
};

export {};