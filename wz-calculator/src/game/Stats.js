import {STAT} from "./constants.js";

const STAT_CAPS = new Map([
    [STAT.cooldownReduction, 0.4],
    [STAT.attackSpeed, 2],
    [STAT.criticalDamage, 2.35],
    [STAT.physicalPenetrationPercent, 1],
    [STAT.magicPenetrationPercent, 1],
    [STAT.tenacity, 1],
    [STAT.damageReduction, 0.8],
    [STAT.physicalDamageReduction, 0.8],
]);

export default class Stats {
    constructor(stats = {}) {
        Object.assign(this,
            Object.fromEntries(
                Object.values(STAT).filter(v => typeof v === 'string').map(s => [s, 0])
            ),
            {[STAT.attackRange]: STAT.ATTACK_RANGE.melee},
            stats
        );
    }

    clone() {
        return new Stats(this);
    }

    add(other) {
        for (const key of Object.keys(this)) {
            if (!(key in other)) continue;
            if (key === STAT.attackRange) {
                this[key] ||= other[key];
            } else {
                this[key] += other[key];
                const cap = STAT_CAPS.get(key);
                if (cap !== undefined) this[key] = Math.min(this[key], cap);
            }
        }
        return this;
    }
}