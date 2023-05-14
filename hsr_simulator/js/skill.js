const defaultEnergyRegeneration = {
    A: 20,
    E: 30,
    Q: 5
};
class Skill {
    constructor(character, type, energyRegeneration = defaultEnergyRegeneration[type]) {
        this.character = character;
        this.type = type;
        this.energyRequest = 0;
        this.energyRegeneration = energyRegeneration;
    }
    cast(...args) {
        if (this.character.useEnergy(this.energyRequest)) {
            this.effect(...args);
            this.character.attributes.energy.base += this.energyRegeneration;
        }
    }
    effect(...args) {}
}