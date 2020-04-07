import { hookup, disconnect } from "djinnjs/broadcaster";

class SavingThrows extends HTMLElement {
	private inboxUid: string;
	constructor() {
		super();
		this.inboxUid = hookup("character-update", this.inbox.bind(this));
	}

	private inbox(data) {
		let input = null;
		switch (data.type) {
			case "strength":
				input = this.querySelector('input[name="fields[strengthSavingThrow]"]');
				break;
			case "dexterity":
				input = this.querySelector('input[name="fields[dexteritySavingThrow]"]');
				break;
			case "constitution":
				input = this.querySelector('input[name="fields[constitutionSavingThrow]"]');
				break;
			case "intelligence":
				input = this.querySelector('input[name="fields[intelligenceSavingThrow]"]');
				break;
			case "wisdom":
				input = this.querySelector('input[name="fields[wisdomSavingThrow]"]');
				break;
			case "charisma":
				input = this.querySelector('input[name="fields[charismaSavingThrow]"]');
				break;
			default:
				break;
		}
		if (input) {
			this.update(input, data.difference);
		}
	}

	private update(input: HTMLInputElement, difference: number) {
		input.value = `${parseInt(input.value) + difference}`;
	}

	disconnectedCallback() {
		disconnect(this.inboxUid);
	}
}
customElements.define("saving-throws", SavingThrows);
