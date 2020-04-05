import { env } from "djinnjs/env";
import { notify } from "@codewithkyle/notifyjs";
import { DiceRoller } from "rpg-dice-roller";

class NPCCreator extends HTMLElement {
	private form: HTMLFormElement;
	private strengthInput: HTMLInputElement;
	private dexterityInput: HTMLInputElement;
	private constitutionInput: HTMLInputElement;
	private intelligenceInput: HTMLInputElement;
	private wisdomInput: HTMLInputElement;
	private charismaInput: HTMLInputElement;
	private isSaving: boolean;
	private dice: any;
	private inititativeInput: HTMLInputElement;
	private acInput: HTMLInputElement;

	constructor() {
		super();
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

	private calcualteModifier(score: number): number {
		let modifier = 0;
		if (score === 1) {
			modifier = -5;
		} else if (score === 2 || score === 3) {
			modifier = -4;
		} else if (score === 4 || score === 5) {
			modifier = -3;
		} else if (score === 6 || score === 7) {
			modifier = -2;
		} else if (score === 8 || score === 9) {
			modifier = -1;
		} else if (score === 10 || score === 11) {
			modifier = 0;
		} else if (score === 12 || score === 13) {
			modifier = 1;
		} else if (score === 14 || score === 15) {
			modifier = 2;
		} else if (score === 16 || score === 17) {
			modifier = 3;
		} else if (score === 18 || score === 19) {
			modifier = 4;
		} else if (score === 20 || score === 21) {
			modifier = 5;
		} else if (score === 22 || score === 23) {
			modifier = 6;
		} else if (score === 24 || score === 25) {
			modifier = 7;
		} else if (score === 26 || score === 27) {
			modifier = 8;
		} else if (score === 28 || score === 28) {
			modifier = 9;
		} else if (score === 29 || score === 30) {
			modifier = 10;
		}
		return modifier;
	}

	private diceRoller(dice): Array<number> {
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

	private getAbilityScore(): number {
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

	private autofill: EventListener = () => {
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

		const strengthModifierInput = this.querySelector('input[name="fields[strengthModifier]"]') as HTMLInputElement;
		const dexterityModifierInput = this.querySelector('input[name="fields[dexterityModifier]"]') as HTMLInputElement;
		const constitutionModifierInput = this.querySelector('input[name="fields[constitutionModifier]"]') as HTMLInputElement;
		const intelligenceModifierInput = this.querySelector('input[name="fields[intelligenceModifier]"]') as HTMLInputElement;
		const wisdomModifierInput = this.querySelector('input[name="fields[wisdomModifier]"]') as HTMLInputElement;
		const charismaModifierInput = this.querySelector('input[name="fields[charismaModifier]"]') as HTMLInputElement;

		strengthModifierInput.value = `${this.calcualteModifier(parseInt(this.strengthInput.value))}`;
		dexterityModifierInput.value = `${this.calcualteModifier(parseInt(this.dexterityInput.value))}`;
		constitutionModifierInput.value = `${this.calcualteModifier(parseInt(this.constitutionInput.value))}`;
		intelligenceModifierInput.value = `${this.calcualteModifier(parseInt(this.intelligenceInput.value))}`;
		wisdomModifierInput.value = `${this.calcualteModifier(parseInt(this.wisdomInput.value))}`;
		charismaModifierInput.value = `${this.calcualteModifier(parseInt(this.charismaInput.value))}`;

		this.inititativeInput.value = dexterityModifierInput.value;
		this.inititativeInput.parentElement.classList.add("has-value");

		this.acInput.value = `${10 + parseInt(dexterityModifierInput.value)}`;
		this.acInput.parentElement.classList.add("has-value");
	};

	private saveNPC: EventListener = (e: Event) => {
		e.preventDefault();
		this.save();
	};

	private async save() {
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
		} else {
			const error = await request.text();
			console.error(error);
			notify({
				message: "Failed to create NPC, try again later.",
				closeable: true,
				force: true,
			});
			env.stopLoading(ticket);
		}
		this.isSaving = false;
	}

	private handleAbilityInput: EventListener = (e: Event) => {
		const input = e.currentTarget as HTMLInputElement;
		const name = input.name.replace(/(fields\[)|(\])/g, "");
		const modifierInput = this.querySelector(`input[name="fields[${name}Modifier]"]`) as HTMLInputElement;
		modifierInput.value = `${this.calcualteModifier(parseInt(input.value))}`;

		if (name === "dexterity") {
			this.inititativeInput.value = modifierInput.value;
			this.intelligenceInput.parentElement.classList.add("has-value");
			this.acInput.value = `${10 + parseInt(modifierInput.value)}`;
			this.acInput.parentElement.classList.add("has-value");
		}
	};

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
