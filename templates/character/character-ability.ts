import { calculateModifier } from "../_utils/character";
import { message } from "djinnjs/broadcaster";

class CharacterAbility extends HTMLElement {
	private input: HTMLInputElement;
	private modifier: HTMLInputElement;

	constructor() {
		super();
		this.input = this.querySelector(".ability");
		this.modifier = this.querySelector(".modifier");
	}

	private handleAbilityInput: EventListener = () => {
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

	connectedCallback() {
		this.input.addEventListener("input", this.handleAbilityInput);
	}
}
customElements.define("character-ability", CharacterAbility);
