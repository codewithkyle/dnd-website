import { calculateModifier } from "../_utils/character";

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
		this.modifier.value = `${calculateModifier(score)}`;
	};

	connectedCallback() {
		this.input.addEventListener("input", this.handleAbilityInput);
	}
}
customElements.define("character-ability", CharacterAbility);
