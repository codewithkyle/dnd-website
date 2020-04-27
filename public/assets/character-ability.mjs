import { calculateModifier } from "./character.mjs";
import { message } from "./broadcaster.mjs";
class CharacterAbility extends HTMLElement {
    constructor() {
        super();
        this.handleAbilityInput = () => {
            const score = parseInt(this.input.value);
            const oldValue = parseInt(this.modifier.value);
            const newValue = calculateModifier(score);
            this.modifier.value = `${newValue}`;
            if (newValue - oldValue !== 0) {
                message("character-update", {
                    type: this.dataset.ability,
                    difference: newValue - oldValue,
                });
            }
        };
        this.input = this.querySelector(".ability");
        this.modifier = this.querySelector(".modifier");
    }
    connectedCallback() {
        this.input.addEventListener("input", this.handleAbilityInput);
    }
}
customElements.define("character-ability", CharacterAbility);
