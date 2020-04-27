import { env } from "./env.mjs";
import { snackbar } from "./notifyjs.mjs";
import { DiceRoller } from "./rpg-dice-roller.mjs";
import { calculateModifier } from "./character.mjs";
class NPCCreator extends HTMLElement {
    constructor() {
        super();
        this.autofill = () => {
            this.strengthInput.value = `${this.getAbilityScore()}`;
            this.dexterityInput.value = `${this.getAbilityScore()}`;
            this.constitutionInput.value = `${this.getAbilityScore()}`;
            this.intelligenceInput.value = `${this.getAbilityScore()}`;
            this.wisdomInput.value = `${this.getAbilityScore()}`;
            this.charismaInput.value = `${this.getAbilityScore()}`;
            this.strengthInput.parentElement.classList.add("has-value");
            this.dexterityInput.parentElement.classList.add("has-value");
            this.constitutionInput.parentElement.classList.add("has-value");
            this.intelligenceInput.parentElement.classList.add("has-value");
            this.wisdomInput.parentElement.classList.add("has-value");
            this.charismaInput.parentElement.classList.add("has-value");
            const strengthModifierInput = this.querySelector('input[name="fields[strengthModifier]"]');
            const dexterityModifierInput = this.querySelector('input[name="fields[dexterityModifier]"]');
            const constitutionModifierInput = this.querySelector('input[name="fields[constitutionModifier]"]');
            const intelligenceModifierInput = this.querySelector('input[name="fields[intelligenceModifier]"]');
            const wisdomModifierInput = this.querySelector('input[name="fields[wisdomModifier]"]');
            const charismaModifierInput = this.querySelector('input[name="fields[charismaModifier]"]');
            strengthModifierInput.value = `${calculateModifier(parseInt(this.strengthInput.value))}`;
            dexterityModifierInput.value = `${calculateModifier(parseInt(this.dexterityInput.value))}`;
            constitutionModifierInput.value = `${calculateModifier(parseInt(this.constitutionInput.value))}`;
            intelligenceModifierInput.value = `${calculateModifier(parseInt(this.intelligenceInput.value))}`;
            wisdomModifierInput.value = `${calculateModifier(parseInt(this.wisdomInput.value))}`;
            charismaModifierInput.value = `${calculateModifier(parseInt(this.charismaInput.value))}`;
            this.inititativeInput.value = dexterityModifierInput.value;
            this.inititativeInput.parentElement.classList.add("has-value");
            this.acInput.value = `${10 + parseInt(dexterityModifierInput.value)}`;
            this.acInput.parentElement.classList.add("has-value");
        };
        this.saveNPC = (e) => {
            e.preventDefault();
            this.save();
        };
        this.handleAbilityInput = (e) => {
            const input = e.currentTarget;
            const name = input.name.replace(/(fields\[)|(\])/g, "");
            const modifierInput = this.querySelector(`input[name="fields[${name}Modifier]"]`);
            modifierInput.value = `${calculateModifier(parseInt(input.value))}`;
            if (name === "dexterity") {
                this.inititativeInput.value = modifierInput.value;
                this.intelligenceInput.parentElement.classList.add("has-value");
                this.acInput.value = `${10 + parseInt(modifierInput.value)}`;
                this.acInput.parentElement.classList.add("has-value");
            }
        };
        this.form = this.querySelector("form");
        this.strengthInput = this.querySelector('input[name="fields[strength]"]');
        this.dexterityInput = this.querySelector('input[name="fields[dexterity]"]');
        this.constitutionInput = this.querySelector('input[name="fields[constitution]"]');
        this.intelligenceInput = this.querySelector('input[name="fields[intelligence]"]');
        this.wisdomInput = this.querySelector('input[name="fields[wisdom]"]');
        this.charismaInput = this.querySelector('input[name="fields[charisma]"]');
        this.inititativeInput = this.querySelector('input[name="fields[initiative]"]');
        this.acInput = this.querySelector('input[name="fields[armorClass]"]');
        this.isSaving = false;
        this.dice = new DiceRoller();
    }
    diceRoller(dice) {
        const rolls = this.dice.roll(dice).toString();
        let array = rolls
            .match(/\[.*\]/g)[0]
            .replace(/(\[)|(\])/g, "")
            .split(",");
        if (!Array.isArray(array)) {
            array = [...array];
        }
        for (let i = 0; i < array.length; i++) {
            const num = parseInt(array[i]);
            array.splice(i, 1, num);
        }
        return array;
    }
    getAbilityScore() {
        const results = this.diceRoller("4d6");
        let lowestResult = 9999;
        for (let i = 0; i < results.length; i++) {
            if (results[i] < lowestResult) {
                lowestResult = results[i];
            }
        }
        for (let i = 0; i < results.length; i++) {
            if (results[i] === lowestResult) {
                results.splice(i, 1);
                break;
            }
        }
        let total = 0;
        for (let i = 0; i < results.length; i++) {
            total += results[i];
        }
        return total;
    }
    async save() {
        if (this.isSaving) {
            return;
        }
        const ticket = env.startLoading();
        this.isSaving = true;
        const data = new FormData(this.form);
        const request = await fetch(`${location.origin}/actions/entries/save-entry`, {
            method: "POST",
            body: data,
            headers: new Headers({
                Accept: "application/json",
            }),
            credentials: "include",
        });
        if (request.ok) {
            const response = await request.json();
            if (response.success) {
                window.location.href = `${location.origin}/campaign/${this.dataset.campaignUid}`;
            }
        }
        else {
            const error = await request.text();
            console.error(error);
            snackbar({
                message: "Failed to create NPC, try again later.",
                closeable: true,
                force: true,
            });
            env.stopLoading(ticket);
        }
        this.isSaving = false;
    }
    connectedCallback() {
        this.form.addEventListener("submit", this.saveNPC);
        this.querySelector("#auto-fill").addEventListener("click", this.autofill);
        this.strengthInput.addEventListener("input", this.handleAbilityInput);
        this.dexterityInput.addEventListener("input", this.handleAbilityInput);
        this.constitutionInput.addEventListener("input", this.handleAbilityInput);
        this.intelligenceInput.addEventListener("input", this.handleAbilityInput);
        this.wisdomInput.addEventListener("input", this.handleAbilityInput);
        this.charismaInput.addEventListener("input", this.handleAbilityInput);
    }
}
customElements.define("npc-creator", NPCCreator);
