import o from "./dataStorage.js"

//region 6135 getDataStorage
const co = {};
o.r(co);
o.d(co, {
    BIN: () => {
        return d;
    },
    ACTIVE_EFT_FILTERS: () => {
        return z;
    },
    DIFFICULTIES: () => {
        return De;
    },
    PASSIVE_EFT_FILTERS: () => {
        return k;
    },
    ableToLearnWithoutBenevolenceRequirement: () => {
        return me;
    },
    ableToLearnWithoutIqRequirement: () => {
        return ce;
    },
    adjustPracticeCost: () => {
        return he;
    },
    castrate: () => {
        return Be;
    },
    characterAbleToLearnEft: () => {
        return we;
    },
    characterAbleToSelectGift: () => {
        return be;
    },
    characterLearnEft: () => {
        return Ce;
    },
    data: () => {
        return d;
    },
    eftSecondaryTypeToString: () => {
        return c;
    },
    eftTypeToString: () => {
        return p;
    },
    enhanceCharacterProtoByFinalStrength: () => {
        return Ee;
    },
    enhanceEftInfoProto: () => {
        return $;
    },
    filterEnhancedCharacters: () => {
        return ge;
    },
    finalizeCharacterProto: () => {
        return ee;
    },
    finalizeCharacterProtoForEftLevels: () => {
        return X;
    },
    finalizedCharacterAbleToLearnEft: () => {
        return Te;
    },
    getActiveRelationScores: () => {
        return ue;
    },
    getArmorProtoForNoEquipment: () => {
        return We;
    },
    getBattleMapProto: () => {
        return T;
    },
    getBattleMapProtos: () => {
        return w;
    },
    getBoolAttribute: () => {
        return y;
    },
    getCharacterProto: () => {
        return f;
    },
    getCharacterProtos: () => {
        return g;
    },
    getChessGiftProto: () => {
        return L;
    },
    getChessGiftProtos: () => {
        return F;
    },
    getDifficultyExplanation: () => {
        return Ue;
    },
    getDifficultyText: () => {
        return xe;
    },
    getDisplayNameForAttribute: () => {
        return pe;
    },
    getDisplayNameForBreakMove: () => {
        return le;
    },
    getEftActiveAttributeValue: () => {
        return K;
    },
    getEftInfoAttackDistance: () => {
        return V;
    },
    getEftInfoAttackRange: () => {
        return H;
    },
    getEftInfoCost: () => {
        return ie;
    },
    getEftInfoPower: () => {
        return re;
    },
    getEftInfoProto: () => {
        return Y;
    },
    getEftPassiveAttributeValue: () => {
        return O;
    },
    getEftProto: () => {
        return m;
    },
    getEftProtos: () => {
        return j;
    },
    getEnhanceRelationsObj: () => {
        return qe;
    },
    getEquipmentProto: () => {
        return v;
    },
    getEquipmentProtos: () => {
        return P;
    },
    getEventCharacterProto: () => {
        return u;
    },
    getEventProto: () => {
        return B;
    },
    getEventProtos: () => {
        return A;
    },
    getGiftProto: () => {
        return C;
    },
    getGiftProtos: () => {
        return M;
    },
    getHeadPicSrc: () => {
        return ae;
    },
    getItemProto: () => {
        return I;
    },
    getItemProtos: () => {
        return _;
    },
    getLevelBattles: () => {
        return R;
    },
    getLocationProto: () => {
        return b;
    },
    getLocationProtos: () => {
        return E;
    },
    getPopularity: () => {
        return ve;
    },
    getPracticeCount: () => {
        return Ie;
    },
    getRemainingPracticeCountForLead: () => {
        return Fe;
    },
    getRemainingPracticeCountForNonLead: () => {
        return _e;
    },
    getThirdPersonPronoun: () => {
        return Me;
    },
    getWeaponProtoForNoEquipment: () => {
        return Ne;
    },
    hasEnhanceRelation: () => {
        return fe;
    },
    identityIdToName: () => {
        return l;
    },
    isEftAttackable: () => {
        return se;
    },
    isEftEnhancementRelated: () => {
        return Q;
    },
    isEftInfoAttackable: () => {
        return de;
    },
    isSameEquipment: () => {
        return Le;
    },
    recastrate: () => {
        return Ae;
    },
    refreshEfts: () => {
        return Pe;
    },
    returnExp: () => {
        return Re;
    },
    tryEnhanceCharacterProtoAgain: () => {
        return te;
    },
    updateCharacter: () => {
        return ye;
    }
});
o[7207]({}, {}, o);

//让IDE不报Warning
const oldProto = proto;
const _proto = oldProto;
_proto.jyf = oldProto.jyf;

const dataBin = o[942]();
const a = o.n(dataBin);
const r = o[7588]();

const d = proto.jyf.Data.deserializeBinary(a());

function p(e) {
    return e == proto.jyf.Eft.Type.FIST ? "拳掌" : e == proto.jyf.Eft.Type.SWORD ? "剑法" : e == proto.jyf.Eft.Type.KNIFE ? "刀法" : e == proto.jyf.Eft.Type.UNUSUAL ? "奇门" : e == proto.jyf.Eft.Type.HIDDEN_WEAPON ? "暗器" : e == proto.jyf.Eft.Type.INTERNAL ? "内功" : e == proto.jyf.Eft.Type.LIGHT ? "轻功" : e == proto.jyf.Eft.Type.SPECIAL ? "特技" : "？？？"
}

function l(e) {
    return e > 0 ? f(e).getName() : C(-e).getName()
}

function c(e) {
    return e == proto.jyf.Eft.SecondaryType.MELEE ? "近战" : e == proto.jyf.Eft.SecondaryType.RANGE ? "远程" : e == proto.jyf.Eft.SecondaryType.SPEAR ? "长枪" : e == proto.jyf.Eft.SecondaryType.STICK ? "棍棒" : e == proto.jyf.Eft.SecondaryType.SHORT ? "短兵" : e == proto.jyf.Eft.SecondaryType.SOFT ? "软兵" : e == proto.jyf.Eft.SecondaryType.WAVE ? "音波" : e == proto.jyf.Eft.SecondaryType.GAS ? "气体" : e == proto.jyf.Eft.SecondaryType.THROW ? "投射" : e == proto.jyf.Eft.SecondaryType.MECHANICAL ? "机括" : "无"
}

function f(e) {
    return e >= d.getCharactersList().length || e <= 0 ? null : d.getCharactersList()[e]
}

function u(e) {
    return e >= d.getEventCharactersList().length || e <= 0 ? null : d.getEventCharactersList()[e]
}

function g() {
    return d.getCharactersList().slice(1)
}

function y(e, t) {
    let n = "get" + r.j(t);
    for (let t of e.getAttributeEnhancementsList())
        if (t[n]())
            return !0;
    return !1
}

function m(e) {
    return d.getEftsList()[e]
}

function h(e) {
    let t = e.indexOf("[");
    return -1 == t ? e : e.substr(0, t)
}

for (let e of d.getEventCharactersList())
    e.setName(h(e.getName()));

function R() {
    return d.getLevelBattlesList()
}

function j() {
    return d.getEftsList().slice(1)
}

function v(e, t) {
    let n = d.getEquipmentsList()[e];
    if (!t)
        return n;
    n = n.cloneMessage();
    for (let e of n.getAttributeEnhancementsList())
        for (let n of x)
            e["setAdd" + n](Math.round(e["getAdd" + n]() * (1 + t / 10) + .001));
    for (let e of n.getEftEnhancementsList())
        for (let n of U)
            e["setAdd" + n](Math.round(e["getAdd" + n]() * (1 + t / 10) + .001));
    return n
}

function P() {
    return d.getEquipmentsList().slice(1)
}

function b(e) {
    let t = d.getLocationsList();
    return e <= 0 || e >= t.length ? null : t[e]
}

function E() {
    return d.getLocationsList().slice(1)
}

function T(e) {
    return d.getBattleMapsList()[e]
}

function w() {
    return d.getBattleMapsList().slice(1)
}

function B(e) {
    return d.getEventsList()[e]
}

function A() {
    return d.getEventsList().slice(1)
}

function C(e) {
    return d.getGiftsList()[e]
}

function M() {
    return d.getGiftsList().slice(1)
}

function I(e) {
    return d.getItemsList()[e]
}

function _() {
    return d.getItemsList().slice(1)
}

function F() {
    return d.getChessGiftsList().slice(1)
}

function L(e) {
    let t = d.getChessGiftsList();
    return e <= 0 || e >= t.length ? null : t[e]
}

const S = ["injury", "stap", "poison", "blind", "critical", "borrow_strength", "ignore_defense", "ignore_skill", "damage_increase", "damage_increase_to_female", "damage_increase_to_evil", "damage_increase_by_evil", "damage_increase_by_reduce_hp", "damage_to_poisoned", "damage_increase_with_less_hp", "damage_increase_by_iq", "accuracy", "sharp", "hp_absorb", "double_hit", "accuracy_damage_increase", "critical_damage_increase", "damage_increase_by_unknown_eft", "reduce_mp", "no_ignore_poison", "no_ignore_injury", "no_ignore_stap", "stap_cause_injury", "power_percent_for_joint_attack", "damage_increase_by_speed", "boost_stap", "boost_fracture"]
    ,
    G = S.concat(["power", "power_percent", "max_level", "attack_range", "attack_distance", "boost_blind", "boost_power_percent_by_damage_increase_by_speed", "boost_power_percent_by_critical", "boost_power_percent_by_accuracy", "boost_power_percent_by_damage_increase", "boost_power_percent_by_borrow_strength", "boost_power_percent_by_injury", "boost_power_percent_by_ignore_skill", "boost_power_percent_by_damage_reduce_from_male", "boost_power_percent_by_fist", "boost_power_percent_by_sword", "boost_power_percent_by_knife", "boost_power_percent_by_unusual", "boost_power_percent_by_counterattack", "boost_power_percent_by_damage_increase_by_iq", "boost_power_percent_by_break_move", "boost_power_percent_by_strength_accumulation", "critical_damage_increase_to_single_enemy", "damage_increase_to_single_enemy", "damage_increase_to_male", "damage_increase_to_injured", "damage_increase_to_fractured", "damage_increase_to_blind", "ignore_damage_rebound", "ignore_mp_defense", "ignore_armor_defense", "ignore_damage_reduce", "fade", "fracture"])
    ,
    q = S.concat(["hp", "constitution", "mp", "attack", "defense", "speed", "fist", "sword", "knife", "unusual", "attack_buff", "popularity", "disable_double_hit", "hidden_weapon", "hp_recovery", "evil_hp_recovery", "mp_recovery", "injury_recovery", "stap_recovery", "poison_recovery", "poison_all_over", "poison_all_over_when_slap_rebound", "damage_reduce", "damage_reduce_attempt", "damage_reduce_from_male", "damage_reduce_from_male_attempt", "damage_reduce_from_all_genders", "damage_reduce_with_more_mp", "damage_reduce_with_more_mp_per_allies_nearby", "damage_reduce_from_stick", "damage_reduce_from_hidden_weapon", "damage_to_poisoned_attempt", "armor_defense", "armor_defense_attempt", "sharp_attempt", "dodge", "dodge_no_cd", "dodge_attempt_ratio", "counterattack", "counterattack_no_cd", "counterattack_damage_increase_by_counterattack", "shift_attack", "shift_attack_no_cd", "shift_attack_reduce_cd", "damage_rebound", "damage_rebound_boost_damage", "damage_rebound_no_cd", "damage_rebound_ignore_damage_reduce_ratio", "slap_rebound", "break_move", "break_move_reduce_cd", "mp_defense", "mp_defense_no_cd", "mp_defense_reduce_cd", "mp_defense_no_cost", "mp_defense_reduce_cost", "defense_move_no_cd", "strength_accumulation", "strength_accumulation_when_being_attacked", "mp_absorb", "mp_absorb_attempt", "mp_elimination", "mp_elimination_attempt", "revival", "revival_enhance", "revival_recover_mp", "revival_recover_hp", "revival_remove_debuff", "stiff", "keep_alive", "keep_alive_after_revival", "hp_absorb_no_limit", "dodge_ignore_accuracy", "boost_revive", "ignore_poison", "ignore_injury", "ignore_stap", "ignore_blind", "ignore_hidden_weapon", "ignore_critical", "ignore_semi_critical", "ignore_damage_increase", "ignore_stiff", "ignore_damage_reduce_from_male", "ignore_sharp", "semi_critical_attack_range", "semi_critical_reduce_strength_cost", "reduce_move_speed", "accuracy_damage_increase_attempt", "boost_power_percent_by_damage_increase_by_evil", "boost_power_percent_by_damage_to_poisoned", "boost_hp_recovery", "boost_evil_hp_recovery", "damage_increase_by_reduce_less_hp", "extra_poison_damage", "stap_recovery_to_nearby", "hp_recovery_to_nearby", "poison_recovery_to_nearby", "damage_increase_by_unknown_eft_always_work", "enhance_nearby_allies"])
    ,
    D = ["initial_fractured", "initial_injury", "initial_poison", "ignore_low_fractured", "ignore_low_blind", "ignore_low_stap", "ignore_low_fade", "ignore_low_poisoned"].map((e => r.j(e)))
    , x = q.map((e => r.j(e)))
    , U = G.map((e => r.j(e)))
    , N = []
    , W = [];
for (let e of d.getEftsList()) {
    let t = new Set;
    for (let n of e.getAttributeEnhancementsList())
        for (let e of x)
            0 != n["getAdd" + e]() && t.add(e);
    let n = [];
    for (let e of t)
        n.push(e);
    N.push(n);
    let o = new Set;
    for (let t of e.getEftEnhancementsList())
        for (let e of U)
            0 != t["getAdd" + e]() && o.add(e);
    let a = [];
    for (let e of o)
        a.push(e);
    W.push(a)
}
const k = {
    attack: "攻击",
    defense: "防御",
    speed: "速度",
    fist: "拳掌",
    sword: "御剑",
    knife: "耍刀",
    unusual: "奇门",
    hidden_weapon: "暗器",
    hp: "最大生命",
    mp: "最大内力",
    constitution: "气血充盈",
    injury: "附加内伤",
    stap: "附加封穴",
    poison: "附加中毒",
    stap_cause_injury: "透骨打穴",
    poison_all_over: "周身剧毒",
    critical: "暴起一击",
    borrow_strength: "借力打力",
    ignore_defense: "以虚击实",
    ignore_skill: "以巧胜拙",
    damage_increase: "劲雄凝重",
    damage_increase_by_reduce_hp: "舍身一击",
    damage_increase_to_female: "无耻下流",
    damage_to_poisoned: "万毒噬心",
    damage_increase_by_iq: "攻敌破绽",
    damage_increase_by_speed: "以快制慢",
    accuracy_damage_increase: "攻其不备",
    critical_damage_increase: "一击制敌",
    accuracy: "出其不意",
    sharp: "切金断玉",
    hp_absorb: "嗜血成性",
    double_hit: "左右开弓",
    hp_recovery: "生命回复",
    evil_hp_recovery: "吸饮生血",
    mp_recovery: "内力回复",
    injury_recovery: "内伤回复",
    stap_recovery: "封穴回复",
    poison_recovery: "中毒回复",
    ignore_injury: "内伤抗性",
    ignore_stap: "封穴抗性",
    ignore_poison: "中毒抗性",
    ignore_hidden_weapon: "收化暗器",
    damage_reduce: "内功卸力",
    damage_reduce_from_male: "倾国倾城",
    armor_defense: "宝甲护体",
    dodge: "闪躲趋避",
    dodge_attempt_ratio: "趋退若神",
    counterattack: "借招还招",
    shift_attack: "牵引挪移",
    damage_rebound: "内力反震",
    slap_rebound: "倒刺护体",
    break_move: "料敌机先",
    mp_defense: "真气护体",
    strength_accumulation: "积蓄劲力",
    strength_accumulation_when_being_attacked: "借力蓄力",
    mp_absorb: "内力吸取",
    mp_elimination: "化敌内力",
    revival: "起死回生",
    stiff: "真气反噬",
    damage_increase_to_evil: "惩奸除恶",
    reduce_mp: "运转如意",
    damage_increase_by_unknown_eft: "无迹可寻",
    keep_alive: "屹立不倒",
    no_ignore_injury: "强化致伤",
    no_ignore_stap: "强化封穴",
    no_ignore_poison: "强化毒性",
    damage_reduce_with_more_mp: "气贯周身"
}
    , z = {
    power: "威力",
    mp: "消耗内力",
    attack_distance: "攻击距离",
    attack_range: "打击范围",
    injury: "附加内伤",
    stap: "附加封穴",
    poison: "附加中毒",
    stap_cause_injury: "透骨打穴",
    blind: "附加目盲",
    fade: "附加散功",
    fracture: "附加断骨",
    critical: "暴起一击",
    borrow_strength: "借力打力",
    ignore_defense: "以虚击实",
    ignore_skill: "以巧胜拙",
    damage_increase: "劲雄凝重",
    damage_increase_by_reduce_hp: "舍身一击",
    damage_increase_to_female: "无耻下流",
    damage_to_poisoned: "万毒噬心",
    damage_increase_with_less_hp: "越战越勇",
    damage_increase_by_iq: "攻敌破绽",
    damage_increase_by_speed: "以快制慢",
    damage_increase_by_evil: "心狠手辣",
    critical_damage_increase: "一击制敌",
    accuracy_damage_increase: "攻其不备",
    accuracy: "出其不意",
    sharp: "切金断玉",
    hp_absorb: "嗜血成性",
    double_hit: "左右开弓",
    damage_increase_to_evil: "惩奸除恶",
    damage_increase_by_unknown_eft: "无迹可寻",
    no_ignore_injury: "强化致伤",
    no_ignore_stap: "强化封穴",
    no_ignore_poison: "强化毒性"
};

function O(e, t, n) {
    let o = 0;
    for (let a of e.getAttributeEnhancementsList()) {
        if (a.getMultiplyByEftType() != proto.jyf.Eft.Type.UNKNOWN && a.getMultiplyByEftType() != e.getType())
            continue;
        if (a.getMultiplyByEftId() > 0 && a.getMultiplyByEftId() != e.getId())
            continue;
        let i = J(a, n);
        0 != i && (a.getMultiplyByEftId() > 0 && (i = n),
            o += a["getAdd" + r.j(t)]() * i)
    }
    return o
}

function V(e) {
    let t = m(e.getId()).getAttackDistance();
    return e.hasEftEnhancement() && (t += e.getEftEnhancement().getAddAttackDistance()),
        t
}

function H(e) {
    let t = m(e.getId()).getAttackRange();
    return e.hasEftEnhancement() && (t += e.getEftEnhancement().getAddAttackRange()),
        t
}

function Q(e, t) {
    return e.getId() > 0 ? e.getId() == t.getId() : (e.getType() == proto.jyf.Eft.Type.UNKNOWN || e.getType() == t.getType()) && (e.getSecondaryType() == proto.jyf.Eft.SecondaryType.SECONDARY_UNKNOWN || e.getSecondaryType() == t.getSecondaryType())
}

function J(e, t) {
    return e.getRequiredLevel() > 0 ? e.getRequiredLevel() > t ? 0 : e.getPerLevelAfterRequiredLevel() ? t - e.getRequiredLevel() + 1 : 1 : t
}

function K(e, t, n) {
    let o = new proto.jyf.Character.EftInfo;
    o.setId(e.getId()),
        o.setLevel(n);
    for (let t of e.getEftEnhancementsList()) {
        let a = J(t, n);
        0 != a && (Q(t, e) && $(t, a, o))
    }
    return "power" == t ? re(o) : "attack_distance" == t ? V(o) : "attack_range" == t ? H(o) : "mp" == t ? ie(o) : o.hasEftEnhancement() ? o.getEftEnhancement()["getAdd" + r.j(t)]() : 0
}

function $(e, t, n, o) {
    n.hasEftEnhancement() || n.setEftEnhancement(new proto.jyf.EftEnhancement),
    o || (o = U);
    for (let a of o)
        n.getEftEnhancement()["setAdd" + a](n.getEftEnhancement()["getAdd" + a]() + e["getAdd" + a]() * t)
}

function Z(e, t, n, o, a) {
    if (a || (a = [n]),
    (e.getRequiredGender() == proto.jyf.Gender.GENDER_UNKNOWN || n.getGender() == e.getRequiredGender()) && !(e.getRequiredPositiveBenevolence() && n.getBenevolence() <= 0 || e.getRequiredNegativeBenevolence() && n.getBenevolence() >= 0)) {
        if (e.getMultiplyByEftId() > 0) {
            let o = n.getEftsList().find((t => t.getId() == e.getMultiplyByEftId()));
            if (null == o)
                return;
            t = o.getLevel()
        }
        if (e.getRequiredEftId() > 0) {
            if (null == n.getEftsList().find((t => t.getId() == e.getRequiredEftId())))
                return
        }
        if (e.getMultiplyByEftType() != proto.jyf.Eft.Type.UNKNOWN) {
            t = 0;
            for (let o of n.getEftsList())
                o.getLevel() < 10 || m(o.getId()).getType() == e.getMultiplyByEftType() && ++t
        }
        if (e.getMultiplyByEfts()) {
            t = 0;
            for (let e of n.getEftsList())
                e.getLevel() >= 10 && ++t
        }
        if (e.getPerTenIq() && (t = Math.floor(n.getIq() / 10)),
            e.getMultiplyByPractice()) {
            t = 0;
            for (let e of n.getEftsList())
                t += e.getPracticeCount()
        }
        if (e.getMultiplyByTeamMembers() && (t = a.length - 1),
        e.getMultiplyByTeamMembersGender() != proto.jyf.Gender.GENDER_UNKNOWN) {
            t = 0;
            for (let n of a)
                n.getGender() == e.getMultiplyByTeamMembersGender() && ++t
        }
        o || (o = x);
        for (let a of o)
            n["set" + a](n["get" + a]() + e["getAdd" + a]() * t);
        for (let t of D)
            n["set" + t](Math.max(n["get" + t](), e["getAdd" + t]()))
    }
}

function Y(e, t) {
    for (let n of e.getEftsList())
        if (n.getId() == t)
            return n;
    return null
}

function X(e) {
    let t = e.cloneMessage();
    for (let e of t.getEftsList()) {
        let n = m(e.getId());
        e.getPracticeCount() > 0 && (e.hasEftEnhancement() || e.setEftEnhancement(new proto.jyf.EftEnhancement),
            e.getEftEnhancement().setAddMaxLevel(e.getEftEnhancement().getAddMaxLevel() + e.getPracticeCount()));
        for (let o of n.getEftEnhancementsList()) {
            if (0 == o.getAddMaxLevel())
                continue;
            let n = J(o, e.getLevel());
            0 != n && ne(t, o, n, ["MaxLevel"])
        }
    }
    for (let e of t.getEftEnhancementsList())
        0 != e.getAddMaxLevel() && ne(t, e, 1, ["MaxLevel"]);
    return t
}

function ee(e, t, n) {
    t || (t = [e]);
    let o = e.cloneMessage();
    for (let t of o.getEftsList()) {
        if (e.linkedObject_ && e.linkedObject_.eftCountMap) {
            let n = e.linkedObject_.eftCountMap.get(t.getId());
            null != n && n >= 2 && (t.hasEftEnhancement() || t.setEftEnhancement(new proto.jyf.EftEnhancement),
                t.getEftEnhancement().setAddMaxLevel(t.getEftEnhancement().getAddMaxLevel() + i.k3(n)))
        }
        let n = m(t.getId());
        t.getPracticeCount() > 0 && (t.hasEftEnhancement() || t.setEftEnhancement(new proto.jyf.EftEnhancement),
            t.getEftEnhancement().setAddMaxLevel(t.getEftEnhancement().getAddMaxLevel() + t.getPracticeCount()));
        for (let e of n.getAttributeEnhancementsList()) {
            let a = J(e, t.getLevel());
            0 != a && Z(e, a, o, N[n.getId()])
        }
        for (let e of n.getEftEnhancementsList()) {
            let a = J(e, t.getLevel());
            0 != a && (ne(o, e, a, W[n.getId()]),
                0 == e.getId() ? e.getType() != proto.jyf.Eft.Type.UNKNOWN && e.getIgnoreIqRequirement() && o.addEftTypesWithoutIqRequirement(e.getType()) : e.getIgnoreIqRequirement() && o.addEftIdsWithoutIqRequirement(e.getId()))
        }
    }
    for (let e of t)
        for (let t of e.getAttributeEnhancementsList())
            (t.getApplyToTeamMembers() || o.getGender() == proto.jyf.Gender.GENDER_MALE && t.getApplyToMaleTeamMembers() || o.getGender() == proto.jyf.Gender.GENDER_FEMALE && t.getApplyToFemaleTeamMembers() || o.getGender() == proto.jyf.Gender.GENDER_SHEMALE && t.getApplyToShemaleTeamMembers() || o.getBenevolence() > 0 && t.getApplyToGoodTeamMembers()) && Z(t, 1, o);
    if (oe(o, o, t),
        o.getWeapon().getId()) {
        oe(v(o.getWeapon().getId(), o.getWeapon().getQuality()), o, t)
    } else
        oe(Ne(), o, t);
    if (o.getArmor().getId()) {
        oe(v(o.getArmor().getId(), o.getArmor().getQuality()), o, t)
    } else
        oe(We(), o, t);
    o.pendingRelations_ = [];
    for (let e of Se[o.getId()]) {
        if (Ge(t, e)) {
            let n = e.cloneMessage();
            n.setAttributeEnhancementsList(n.getAttributeEnhancementsList().filter((e => !e.getRequiredAnyDead()))),
                n.setEftEnhancementsList(n.getEftEnhancementsList().filter((e => !e.getRequiredAnyDead()))),
                oe(n, o, t);
            let a = e.cloneMessage();
            a.setAttributeEnhancementsList(a.getAttributeEnhancementsList().filter((e => e.getRequiredAnyDead()))),
                a.setEftEnhancementsList(a.getEftEnhancementsList().filter((e => e.getRequiredAnyDead()))),
                o.pendingRelations_.push(a)
        }
    }
    n && Se[o.getId()].map((e => {
            oe(e, o, t)
        }
    ));
    let a = 100 * (10 + o.getAdditionalEfts());
    o.getConstitution() > a ? o.setHp(o.getHp() + 10 * a) : o.setHp(o.getHp() + 10 * o.getConstitution());
    for (let e of o.getAttributeEnhancementsList()) {
        if (e.getLockMaxBenevolence() > 0 && o.getBenevolence() > 0 && o.setBenevolence(0),
        e.getAddEnhanceByConstitution() > 0) {
            let e = Math.floor(o.getConstitution() / 100);
            o.setAttack(o.getAttack() + 3 * e),
                o.setDefense(o.getDefense() + 3 * e),
                o.setHp(o.getHp() + 60 * e)
        }
        if (e.getAddEnhanceByMp() > 0) {
            let e = Math.floor(o.getMp() / 1e3);
            o.setFist(o.getFist() + e),
                o.setSword(o.getSword() + e),
                o.setKnife(o.getKnife() + e),
                o.setUnusual(o.getUnusual() + e),
                o.setHiddenWeapon(o.getHiddenWeapon() + e)
        }
    }
    return o
}

function te(e, t) {
    e.pendingRelations_ = e.pendingRelations_.filter((n => {
            for (let o of n.getToCharacterIdsList())
                for (let a of t)
                    if (o == a.id && !a.alive)
                        return oe(n, e),
                            !1;
            return !0
        }
    ))
}

function ne(e, t, n, o) {
    for (let a of e.getEftsList()) {
        Q(t, m(a.getId())) && $(t, n, a, o)
    }
}

function oe(e, t, n) {
    for (let o of e.getEftEnhancementsList()) {
        let e = 1;
        if (o.getMultiplyByTeamMembers()) {
            if (!n || n.length <= 1)
                continue;
            e = n.length - 1
        }
        ne(t, o, e)
    }
    for (let o of e.getAttributeEnhancementsList())
        o.getApplyToTeamMembers() || o.getApplyToMaleTeamMembers() || o.getApplyToFemaleTeamMembers() || o.getApplyToShemaleTeamMembers() || o.getApplyToGoodTeamMembers() || Z(o, 1, t, null, n)
}

function ae(e) {
    return s.M7() + "/head/" + e.getHeadPicId() + ".png"
}

function re(e, t, n) {
    let o = m(e.getId()).getPower() * e.getLevel() / 10
        , a = 0
        , r = 0
        , i = 0
        , s = 0
        , d = 0
        , p = 0
        , l = 0
        , c = 0
        , f = 0
        , u = 0
        , g = 0
        , y = 0
        , h = 0
        , R = 0;
    if (t && (s += t.getDamageIncreaseByIq(),
        r += t.getDamageIncreaseByEvil(),
        d += t.getDamageIncreaseBySpeed(),
        i += t.getDamageToPoisoned(),
        f += t.getFist(),
        u += t.getSword(),
        g += t.getKnife(),
        y += t.getUnusual(),
        h += t.getDamageReduceFromMale(),
        p += t.getCounterattack(),
        l += t.getBreakMove(),
        R += t.getDamageIncrease(),
        c += t.getStrengthAccumulation()),
        e.hasEftEnhancement()) {
        o += e.getEftEnhancement().getAddPower(),
            a += e.getEftEnhancement().getAddPowerPercent(),
        n && (a += e.getEftEnhancement().getAddBoostPowerPercentByInjury() * Math.floor(n.injury / 100),
            R += n.enhancement);
        let m = e.getEftEnhancement().getAddCritical();
        t && (m += t.getCritical()),
            a += e.getEftEnhancement().getAddBoostPowerPercentByCritical() * Math.floor(m / 10);
        let j = e.getEftEnhancement().getAddAccuracy();
        t && (j += t.getAccuracy()),
            a += e.getEftEnhancement().getAddBoostPowerPercentByAccuracy() * Math.floor(j / 10);
        let v = e.getEftEnhancement().getAddBorrowStrength();
        t && (v += t.getBorrowStrength()),
            a += e.getEftEnhancement().getAddBoostPowerPercentByBorrowStrength() * Math.floor(v / 10),
            R += e.getEftEnhancement().getAddDamageIncrease(),
            a += e.getEftEnhancement().getAddBoostPowerPercentByDamageIncrease() * Math.floor(R / 10);
        let P = e.getEftEnhancement().getAddIgnoreSkill();
        t && (P += t.getIgnoreSkill()),
            a += e.getEftEnhancement().getAddBoostPowerPercentByIgnoreSkill() * Math.floor(P / 10),
            a += e.getEftEnhancement().getAddBoostPowerPercentByFist() * Math.floor(f / 50),
            a += e.getEftEnhancement().getAddBoostPowerPercentBySword() * Math.floor(u / 50),
            a += e.getEftEnhancement().getAddBoostPowerPercentByKnife() * Math.floor(g / 50),
            a += e.getEftEnhancement().getAddBoostPowerPercentByUnusual() * Math.floor(y / 50),
            a += e.getEftEnhancement().getAddBoostPowerPercentByCounterattack() * Math.floor(p / 10),
            a += e.getEftEnhancement().getAddBoostPowerPercentByDamageReduceFromMale() * Math.floor(h / 10),
            s += e.getEftEnhancement().getAddDamageIncreaseByIq(),
            a += e.getEftEnhancement().getAddBoostPowerPercentByDamageIncreaseByIq() * Math.floor(s / 10),
            d += e.getEftEnhancement().getAddDamageIncreaseBySpeed(),
            a += e.getEftEnhancement().getAddBoostPowerPercentByDamageIncreaseBySpeed() * Math.floor(d / 10),
            a += e.getEftEnhancement().getAddBoostPowerPercentByBreakMove() * Math.floor(l / 10),
            a += e.getEftEnhancement().getAddBoostPowerPercentByStrengthAccumulation() * Math.floor(c / 10),
            r += e.getEftEnhancement().getAddDamageIncreaseByEvil(),
            i += e.getEftEnhancement().getAddDamageToPoisoned()
    }
    return t && (a += Math.floor(r / 10) * t.getBoostPowerPercentByDamageIncreaseByEvil(),
        a += Math.floor(i / 10) * t.getBoostPowerPercentByDamageToPoisoned()),
        t.AA.power_base = o,
        t.AA.power_percent_total = a,
        o = Math.round(o + o * a / 100),
    o < 0 && (o = 0),
        o
}

function ie(e, t) {
    let n = m(e.getId()).getCost() * e.getLevel() / 10
        , o = 0;
    return t && (o = t.getReduceMp()),
    e.hasEftEnhancement() && (o += e.getEftEnhancement().getAddReduceMp()),
        n = Math.round(n * (1 - o / (1.5 * o + 70))),
    n < 1 && (n = 1),
        n
}

function se(e) {
    return e.getType() == proto.jyf.Eft.Type.FIST || e.getType() == proto.jyf.Eft.Type.SWORD || e.getType() == proto.jyf.Eft.Type.KNIFE || e.getType() == proto.jyf.Eft.Type.UNUSUAL || e.getType() == proto.jyf.Eft.Type.HIDDEN_WEAPON
}

function de(e) {
    return se(m(e.getId()))
}

function pe(e, t, n) {
    let o = [];
    for (let n of e.getAttributeEnhancementsList())
        t(n) && o.push(n.getDisplayName());
    for (let n of e.getEftsList()) {
        let e = m(n.getId());
        for (let a of e.getAttributeEnhancementsList())
            a.getRequiredLevel() <= n.getLevel() && t(a) && o.push(e.getName())
    }
    if (e.getWeapon().getId() > 0) {
        let n = v(e.getWeapon().getId());
        for (let e of n.getAttributeEnhancementsList())
            t(e) && o.push(n.getName())
    }
    if (e.getArmor().getId() > 0) {
        let n = v(e.getArmor().getId());
        for (let e of n.getAttributeEnhancementsList())
            t(e) && o.push(n.getName())
    }
    if (0 == o.length)
        return n;
    let a = o[Math.floor(Math.random() * o.length)];
    return n && (a = a + "•" + n),
        a
}

function le(e, t) {
    for (let t of e.getAttributeEnhancementsList())
        if (t.getAddBreakMove() > 0 && t.getDisplayName())
            return t.getDisplayName() + "•料敌机先";
    let n = m(t.getId())
        , o = n.getType()
        , a = n.getSecondaryType();
    return o == proto.jyf.Eft.Type.FIST ? a == proto.jyf.Eft.SecondaryType.MELEE ? "破掌式" : "破气式" : o == proto.jyf.Eft.Type.SWORD ? a == proto.jyf.Eft.SecondaryType.MELEE ? "破剑式" : "破气式" : o == proto.jyf.Eft.Type.KNIFE ? a == proto.jyf.Eft.SecondaryType.MELEE ? "破刀式" : "破气式" : o == proto.jyf.Eft.Type.UNUSUAL ? a == proto.jyf.Eft.SecondaryType.MELEE ? "破掌式" : a == proto.jyf.Eft.SecondaryType.STICK || a == proto.jyf.Eft.SecondaryType.SPEAR ? "破枪式" : a == proto.jyf.Eft.SecondaryType.SHORT ? "破鞭式" : a == proto.jyf.Eft.SecondaryType.SOFT ? "破索式" : a == proto.jyf.Eft.SecondaryType.RANGE || a == proto.jyf.Eft.SecondaryType.THROW ? "破箭式" : "破气式" : o == proto.jyf.Eft.Type.HIDDEN_WEAPON && a == proto.jyf.Eft.SecondaryType.RANGE ? "破箭式" : "破气式"
}

function ce(e, t) {
    for (let n of e.getEftEnhancementsList())
        if (n.getIgnoreIqRequirement() && Q(n, t))
            return !0;
    for (let n of e.getEftIdsWithoutIqRequirementList())
        if (n == t.getId())
            return !0;
    for (let n of e.getEftTypesWithoutIqRequirementList())
        if (n == t.getType())
            return !0;
    return !1
}

function fe(e, t) {
    if (e.getId() == t.getId())
        return !1;
    for (let n of Se[e.getId()])
        if ((0 != n.getAttributeEnhancementsList().length || 0 != n.getEftEnhancementsList().length) && !n.getJustForFun())
            for (let e of n.getToCharacterIdsList())
                if (e == t.getId())
                    return !0;
    return !1
}

function ue(e) {
    let t = [];
    for (let n of e) {
        let o = 0;
        for (let t of Se[n]) {
            if (0 == t.getAttributeEnhancementsList().length && 0 == t.getEftEnhancementsList().length)
                continue;
            if (t.getJustForFun())
                continue;
            let n = !0;
            for (let o of t.getToCharacterIdsList()) {
                let t = !1;
                for (let n of e)
                    if (o == n) {
                        t = !0;
                        break
                    }
                t || (n = !1)
            }
            n && (1 == t.getFromCharacterIdsList().length ? o += 1 / t.getToCharacterIdsList().length : o += 1 / (t.getToCharacterIdsList().length - 1))
        }
        t.push(o)
    }
    return t
}

function ge(e) {
    let t = new Set;
    for (let n of e)
        for (let o of Se[n.getId()]) {
            if (0 == o.getAttributeEnhancementsList().length && 0 == o.getEftEnhancementsList().length)
                continue;
            if (o.getJustForFun())
                continue;
            let a = !0;
            for (let t of o.getToCharacterIdsList()) {
                let n = !1;
                for (let o of e)
                    if (t == o.getId()) {
                        n = !0;
                        break
                    }
                n || (a = !1)
            }
            if (a) {
                t.add(n);
                for (let n of o.getToCharacterIdsList())
                    for (let o of e)
                        if (n == o.getId()) {
                            t.add(o);
                            break
                        }
            }
        }
    return e.filter((e => t.has(e)))
}

function ye(e, t, n) {
    t || (t = [e]),
        e.setEftsList([]);
    let o = ee(e)
        , a = []
        , r = []
        , s = []
        , d = n.level
        , p = n.seed;
    null == p && (p = i.TY),
        d > 50 && e.getPreferredWeaponId() > 0 ? (e.getWeapon().setId(e.getPreferredWeaponId()).setQuality(2),
            d -= 10) : e.getWeapon().setId(0),
        d > 70 ? (e.getArmor().setId(i.sS(P().filter((e => e.getType() == proto.jyf.Equipment.Type.ARMOR && 0 == e.getRarity())), p).getId()).setQuality(2),
            d -= 10) : e.getArmor().setId(0);
    let l = e.getAttributeEnhancementsList().map((e => e))
        , c = e.getEftEnhancementsList().map((e => e));
    for (let n of Se[e.getId()]) {
        let e = !0;
        for (let o of n.getToCharacterIdsList()) {
            let n = !1;
            for (let e of t)
                if (o == e.getId()) {
                    n = !0;
                    break
                }
            n || (e = !1)
        }
        e && (l = l.concat(n.getAttributeEnhancementsList()),
            c = c.concat(n.getEftEnhancementsList()))
    }
    d >= 100 && e.setAdditionalEfts(Math.floor(d / 100));
    for (let t of j()) {
        if (!je(o, t, !0))
            continue;
        let n = t.getLevel();
        e.getPreferredEftId() > 0 && (e.getPreferredEftId() == t.getId() && (n += 5),
        m(e.getPreferredEftId()).getType() == t.getType() && (n += 1));
        for (let o of e.getOtherPreferredEftsList())
            o.getId() == t.getId() && (n += o.getAddLevel());
        for (let o of t.getAttributeEnhancementsList())
            o.getRequiredLevel() > 10 || e.getPreferredEftId() > 0 && o.getMultiplyByEftId() == e.getPreferredEftId() && (n += 2);
        for (let o of t.getEftEnhancementsList())
            o.getRequiredLevel() > 10 || e.getPreferredEftId() > 0 && o.getId() == e.getPreferredEftId() && (n += 2);
        for (let e of l)
            e.getMultiplyByEftId() == t.getId() && (n += 2);
        for (let e of c)
            e.getId() == t.getId() && (n += 1,
            5 == e.getAddMaxLevel() && (n += 1)),
            e.getType() != proto.jyf.Eft.Type.UNKNOWN && e.getType() == t.getType() && (n += 1);
        let d = t.getType();
        t.getAiEftType() != proto.jyf.Eft.Type.UNKNOWN && (d = t.getAiEftType()),
            d == proto.jyf.Eft.Type.LIGHT ? r.push({
                eftProto: t,
                score: 1e4 * n + i.b5(0, 9999, p)
            }) : d == proto.jyf.Eft.Type.INTERNAL || d == proto.jyf.Eft.Type.UNKNOWN ? a.push({
                eftProto: t,
                score: 1e4 * n + i.b5(0, 9999, p)
            }) : s.push({
                eftProto: t,
                score: 1e4 * n + i.b5(0, 9999, p)
            })
    }
    r = i.XV(r, ((e, t) => e.score - t.score)),
        a = i.XV(a, ((e, t) => e.score - t.score)),
        s = i.XV(s, ((e, t) => e.score - t.score));
    for (let t = 0; t < 10 + e.getAdditionalEfts() && !(d <= 0); ++t) {
        let n;
        if (n = 0 == t || 2 == t || 5 == t || 7 == t || t >= 10 && t % 2 == 1 ? r.concat(a).concat(s) : 1 == t || 3 == t || 6 == t || 8 == t || t >= 10 && t % 2 == 0 ? r.concat(s).concat(a) : a.concat(s).concat(r),
            t < 5 ? d < 6 ? n = n.filter((e => e.eftProto.getLevel() < 1)) : d < 10 && (n = n.filter((e => e.eftProto.getLevel() < 2))) : d < 3 ? n = n.filter((e => e.eftProto.getLevel() < 1)) : d < 8 && (n = n.filter((e => e.eftProto.getLevel() < 2))),
        0 == n.length)
            continue;
        let o = n[n.length - 1].eftProto;
        r = r.filter((e => e.eftProto != o)),
            a = a.filter((e => e.eftProto != o)),
            s = s.filter((e => e.eftProto != o)),
            e.addEfts().setId(o.getId()).setLevel(10),
            0 == o.getLevel() ? d -= 1 : 1 == o.getLevel() ? d -= 3 : d -= 8
    }
    for (let t = 20; !(d < 40 || d < t); t *= n.additionalPracticeCost) {
        d -= t;
        let n = i.b5(0, Math.min(9, e.getEftsList().length), p)
            , o = e.getEftsList()[n];
        o.setPracticeCount(o.getPracticeCount() + 2)
    }
    !function (e) {
        for (; ;) {
            let t = X(e)
                , n = !1;
            for (let o of e.getEftsList()) {
                let e = 10
                    , a = Y(t, o.getId());
                a.hasEftEnhancement() && (e += a.getEftEnhancement().getAddMaxLevel()),
                o.getLevel() < e && (o.setLevel(e),
                    n = !0)
            }
            if (!n)
                break
        }
    }(e)
}

function me(e, t) {
    for (let n of e.getEftEnhancementsList())
        if (n.getIgnoreBenevolenceRequirement() && Q(n, t))
            return !0;
    return !1
}

function he(e, t, n) {
    let o = 100;
    for (let t of e.getAttributeEnhancementsList())
        o *= (100 - t.getAddReducePracticeCost()) / 100;
    let a = e => {
            Q(e, t) && (o *= (100 - e.getAddReducePracticeCost()) / 100)
        }
    ;
    for (let t of e.getEftEnhancementsList())
        a(t);
    for (let t of e.getEftsList()) {
        let e = m(t.getId());
        for (let n of e.getEftEnhancementsList())
            n.getRequiredLevel() > t.getLevel() || a(n)
    }
    let r = Math.round(n * o / 100);
    return r <= 0 && (r = 1),
        r
}

function Re(e, t) {
    e.setExp(e.getExp() + t.getPracticeCost())
}

function je(e, t, n, o) {
    if (t.getRequiredGender() != proto.jyf.Gender.GENDER_UNKNOWN && e.getGender() != t.getRequiredGender()) {
        if (!o)
            return !1;
        if (e.getGender() != proto.jyf.Gender.GENDER_SHEMALE || t.getRequiredGender() != proto.jyf.Gender.GENDER_MALE)
            return !1
    }
    if (!ce(e, t)) {
        if (e.getIq() < t.getRequiredIq())
            return !1;
        if (t.getRequiredMaximumIq() > 0 && e.getIq() > t.getRequiredMaximumIq())
            return !1
    }
    return !(n && !me(e, t) && e.getBenevolence() >= 0 && t.getRequiredNegativeBenevolence()) && (!(t.getRequiredFist() >= 30 && e.getFist() < 30) && (!(t.getRequiredSword() >= 30 && e.getSword() < 30) && (!(t.getRequiredKnife() >= 30 && e.getKnife() < 30) && (!(t.getRequiredUnusual() >= 30 && e.getUnusual() < 30) && !(t.getRequiredHiddenWeapon() >= 30 && e.getHiddenWeapon() < 30)))))
}

function ve(e) {
    let t = e.getPopularity();
    for (let n of e.getAttributeEnhancementsList())
        t += n.getAddPopularity();
    return t
}

function Pe(e, t) {
    for (; ;) {
        let n = !1
            , o = ee(e);
        if (e.setEftsList(e.getEftsList().filter((a => {
                let r = m(a.getId());
                return !!je(o, r, t, !0) || (n = !0,
                    Re(e, a),
                    !1)
            }
        ))),
            !n) {
            for (let t of o.getEftsList()) {
                let o = 10;
                t.hasEftEnhancement() && (o += t.getEftEnhancement().getAddMaxLevel()),
                t.getLevel() > o && (Y(e, t.getId()).setLevel(o),
                    n = !0)
            }
            if (!n)
                break
        }
    }
    if (e.hasStrategy()) {
        let t = e.getStrategy();
        t.getEftId() > 0 && null == Y(e, t.getEftId()) && (t.setAutoEft(proto.jyf.Strategy.Target.TARGET_UNSPECIFIED),
            t.setEftId(0))
    }
}

function be(e, t, n) {
    let o = !0;
    return e.getIq() < t.getRequiredIq() && (o = !1,
        n.add("requiredIq")),
    t.getRequiredMaximumIq() > 0 && e.getIq() > t.getRequiredMaximumIq() && (o = !1,
        n.add("requiredMaximumIq")),
    t.getRequiredGender() != proto.jyf.Gender.GENDER_UNKNOWN && e.getGender() != t.getRequiredGender() && (o = !1,
        n.add("requiredGender")),
        o
}

function Ee(e) {
    1 != e.getId() ? (10 == e.getFinalStrength() && e.setAdditionalEfts(e.getAdditionalEfts() + 3),
    20 == e.getFinalStrength() && e.setAdditionalEfts(e.getAdditionalEfts() + 2),
    30 == e.getFinalStrength() && e.setAdditionalEfts(e.getAdditionalEfts() + 1),
    e.getFinalStrength() <= 40 && e.setAdditionalPractice(4),
    55 == e.getFinalStrength() && e.setAdditionalPractice(3),
    70 == e.getFinalStrength() && e.setAdditionalPractice(2),
    90 == e.getFinalStrength() && e.setAdditionalPractice(1)) : e.setAdditionalPractice(1)
}

function Te(e, t, n) {
    let o = !0;
    null != Y(e, t.getId()) && (o = !1,
        n.add("learned")),
    e.getEftsList().length >= 10 + e.getAdditionalEfts() && (o = !1,
        n.add("reachMaxNumEfts"));
    let a = !1;
    for (let t of e.getAttributeEnhancementsList())
        if (t.getIgnoreMiscEftRequirements()) {
            a = !0;
            break
        }
    e.getHp() < t.getRequiredHp() && !a && (o = !1,
        n.add("requiredHp")),
    e.getMp() < t.getRequiredMp() && !a && (o = !1,
        n.add("requiredMp")),
    e.getAttack() < t.getRequiredAttack() && !a && (o = !1,
        n.add("requiredAttack")),
    t.getRequiredDefense() > 0 && e.getDefense() < t.getRequiredDefense() && !a && (o = !1,
        n.add("requiredDefense")),
    t.getRequiredSpeed() > 0 && e.getSpeed() < t.getRequiredSpeed() && !a && (o = !1,
        n.add("requiredSpeed")),
    e.getFist() < t.getRequiredFist() && !a && (o = !1,
        n.add("requiredFist")),
    e.getSword() < t.getRequiredSword() && !a && (o = !1,
        n.add("requiredSword")),
    e.getKnife() < t.getRequiredKnife() && !a && (o = !1,
        n.add("requiredKnife")),
    e.getUnusual() < t.getRequiredUnusual() && !a && (o = !1,
        n.add("requiredUnusual")),
    e.getHiddenWeapon() < t.getRequiredHiddenWeapon() && !a && (o = !1,
        n.add("requiredHiddenWeapon"));
    let r = ce(e, t);
    return !r && e.getIq() < t.getRequiredIq() && (o = !1,
        n.add("requiredIq")),
    !r && t.getRequiredMaximumIq() > 0 && e.getIq() > t.getRequiredMaximumIq() && (o = !1,
        n.add("requiredMaximumIq")),
    !me(e, t) && t.getRequiredNegativeBenevolence() && e.getBenevolence() >= 0 && (o = !1,
        n.add("requiredNegativeBenevolence")),
    t.getRequiredGender() != proto.jyf.Gender.GENDER_UNKNOWN && e.getGender() != t.getRequiredGender() && (e.getGender() == proto.jyf.Gender.GENDER_MALE && t.getRequiredGender() == proto.jyf.Gender.GENDER_SHEMALE || (o = !1,
        n.add("requiredGender"))),
        o
}

function we(e, t, n, o) {
    return Te(ee(e, o), t, n)
}

function Be(e) {
    e.setGender(proto.jyf.Gender.GENDER_SHEMALE);
    let t = e.addAttributeEnhancements();
    t.setDisplayName("自宫•后遗症"),
        t.setAddDamageIncrease(-20),
        t.setAddDamageReduce(-20)
}

function Ae(e) {
    let t = e.getAttributeEnhancementsList().filter((e => "自宫•后遗症" != e.getDisplayName()));
    t.length != e.getAttributeEnhancementsList().length && (e.setAttributeEnhancementsList(t),
        Be(e))
}

function Ce(e, t, n) {
    if (!we(e, t, new Set, n))
        return !1;
    let o = e.addEfts();
    o.setId(t.getId()),
        o.setLevel(1),
    t.getRequiredGender() == proto.jyf.Gender.GENDER_SHEMALE && e.getGender() != proto.jyf.Gender.GENDER_SHEMALE && Be(e)
}

function Me(e) {
    for (let t of e.getAttributeEnhancementsList())
        if (t.getCustomTpp().length > 0)
            return t.getCustomTpp();
    return e.getGender() == proto.jyf.Gender.GENDER_MALE ? "他" : e.getGender() == proto.jyf.Gender.GENDER_FEMALE ? "她" : "“他”"
}

function Ie(e) {
    let t = 0;
    for (let n of e.getEftsList())
        t += n.getPracticeCount();
    return t
}

function _e(e) {
    let t = Ie(e);
    return e.getAdditionalPractice() - t
}

function Fe(e) {
    let t = Ie(e)
        , n = 3 + e.getAdditionalPractice();
    return 1 == e.getId() && (n += Math.floor(e.getIq() / 30) + 1),
    n < 1 && (n = 1),
    n - t
}

function Le(e, t) {
    return 0 != e.getId() && (t.getId() == e.getId() && t.getQuality() == e.getQuality())
}

let Se = [];
for (let e = 0; e <= g().length; ++e)
    Se.push([]);
for (let e of d.getRelationsList())
    if (e.getDisplayName())
        for (let t of e.getFromCharacterIdsList())
            Se[t].push(e);

function Ge(e, t) {
    let n = 0;
    for (let o of t.getToCharacterIdsList())
        for (let t of e)
            if (o == t.getId()) {
                ++n;
                break
            }
    return t.getMinimumCount() > 0 ? n >= t.getMinimumCount() : n >= t.getToCharacterIdsList().length
}

function qe(e, t) {
    return Se[e.getId()].map((e => {
            let n = e.toObject();
            n.inactive = !t || !Ge(t, e);
            for (let e of n.eftEnhancementsList)
                e.requiredAnyDead && (e.requiredAnyDead = n);
            for (let e of n.attributeEnhancementsList)
                e.requiredAnyDead && (e.requiredAnyDead = n);
            return n
        }
    ))
}

const De = [
    {
        text: "无比简单",
        value: -4
    }, {
        text: "非常简单",
        value: -3
    }, {
        text: "简单",
        value: -2
    }, {
        text: "有点简单",
        value: -1
    }, {
        text: "正常",
        value: 0
    }, {
        text: "有点困难",
        value: 1
    }, {
        text: "困难",
        value: 2
    }, {
        text: "非常困难",
        value: 3
    }, {
        text: "无比困难",
        value: 4
    }];

function xe(e) {
    for (let t of De)
        if (t.value == e)
            return t.text;
    return "？？？"
}

function Ue(e) {
    return 0 == e ? "默认难度，敌我双方无任何加成" : e < 0 ? "敌方最终伤害减少" + -10 * e + "%，我方最终伤害增加" + -10 * e + "%" : "敌方最终伤害增加" + 10 * e + "%，我方最终伤害减少" + 10 * e + "%"
}

function Ne() {
    let e = new proto.jyf.Equipment;
    return e.setComment("真正的高手是不需要武器的。"),
        e.addAttributeEnhancements().setAddSpeed(10),
        e.addEftEnhancements().setType(proto.jyf.Eft.Type.FIST).setAddPower(100),
        e
}

function We() {
    let e = new proto.jyf.Equipment;
    return e.setComment("真正的高手是不需要防具的。"),
        e.addAttributeEnhancements().setAddSpeed(5),
        e
}

// endregion

export {
    co, _proto as proto,
    S, G, q, D, x, U,
    N, W,
    Se, k, z,
    J as calcMul, Ge as isRelationAct,
};

console.log("!---------- calcOrigin loaded ----------!");

