import { env } from "djinnjs/env";
import { uid } from "../uid";
import { calculateModifier } from "../_utils/character";

class CharacterCreator extends HTMLElement {
	private form: HTMLFormElement;
	private buttons: Array<HTMLButtonElement>;
	private page: number;
	private pages: Array<HTMLElement>;
	private classInput: HTMLInputElement;
	private isSaving: boolean;
	private countdown: number;
	private time: number;
	private isActive: boolean;
	private modifiers: {
		strength: number;
		dexterity: number;
		constitution: number;
		intelligence: number;
		wisdom: number;
		charisma: number;
	};
	private entryId: string;

	constructor() {
		super();
		this.page = 0;
		this.form = this.querySelector("form");
		this.buttons = Array.from(this.querySelectorAll(`button[type="button"][data-direction]`));
		this.pages = Array.from(this.querySelectorAll("form-page"));
		this.classInput = this.querySelector('[name="fields[class]"]');
		this.modifiers = {
			strength: 0,
			dexterity: 0,
			constitution: 0,
			intelligence: 0,
			wisdom: 0,
			charisma: 0,
		};
		this.countdown = 300;
		this.entryId = this.dataset.characterId;
	}

	private getSavingThrows() {
		const savingThrows = { ...this.modifiers };
		switch (this.classInput.value) {
			case "Wizard":
				savingThrows.intelligence += 2;
				savingThrows.wisdom += 2;
				break;
			case "Barbarian":
				savingThrows.strength += 2;
				savingThrows.constitution += 2;
				break;
			case "Bard":
				savingThrows.dexterity += 2;
				savingThrows.charisma += 2;
				break;
			case "Cleric":
				savingThrows.wisdom += 2;
				savingThrows.charisma += 2;
				break;
			case "Druid":
				savingThrows.intelligence += 2;
				savingThrows.wisdom += 2;
				break;
			case "Fighter":
				savingThrows.strength += 2;
				savingThrows.constitution += 2;
				break;
			case "Monk":
				savingThrows.strength += 2;
				savingThrows.dexterity += 2;
				break;
			case "Paladin":
				savingThrows.wisdom += 2;
				savingThrows.charisma += 2;
				break;
			case "Ranger":
				savingThrows.strength += 2;
				savingThrows.dexterity += 2;
				break;
			case "Rogue":
				savingThrows.dexterity += 2;
				savingThrows.intelligence += 2;
				break;
			case "Sorcerer":
				savingThrows.constitution += 2;
				savingThrows.charisma += 2;
				break;
			case "Warlock":
				savingThrows.wisdom += 2;
				savingThrows.charisma += 2;
				break;
		}
		return savingThrows;
	}

	private getSkills() {
		const skills = {};
		this.querySelectorAll("skill-component input").forEach((input: HTMLInputElement) => {
			skills[input.dataset.skill] = this.modifiers[input.dataset.ability];
			if (input.checked) {
				skills[input.dataset.skill] += 2;
			}
		});
		return skills;
	}

	private getProficientSkills() {
		const skills = {};
		this.querySelectorAll("skill-component input").forEach((input: HTMLInputElement) => {
			if (input.checked) {
				skills[input.dataset.skill] = 1;
			} else {
				skills[input.dataset.skill] = 0;
			}
		});
		return skills;
	}

	private getHitDice(): string {
		switch (this.classInput.value) {
			case "Wizard":
				return "d6";
			case "Barbarian":
				return "d12";
			case "Bard":
				return "d8";
			case "Cleric":
				return "d8";
			case "Druid":
				return "d8";
			case "Fighter":
				return "d10";
			case "Monk":
				return "d8";
			case "Paladin":
				return "d10";
			case "Ranger":
				return "d10";
			case "Rogue":
				return "d8";
			case "Sorcerer":
				return "d6";
			case "Warlock":
				return "d8";
			default:
				return "";
		}
	}

	private getHitPoints(): string {
		switch (this.classInput.value) {
			case "Barbarian":
				return `${12 + this.modifiers.constitution}`;
			case "Bard":
				return `${8 + this.modifiers.constitution}`;
			case "Cleric":
				return `${8 + this.modifiers.constitution}`;
			case "Druid":
				return `${8 + this.modifiers.constitution}`;
			case "Fighter":
				return `${10 + this.modifiers.constitution}`;
			case "Monk":
				return `${8 + this.modifiers.constitution}`;
			case "Paladin":
				return `${10 + this.modifiers.constitution}`;
			case "Ranger":
				return `${10 + this.modifiers.constitution}`;
			case "Rogue":
				return `${8 + this.modifiers.constitution}`;
			case "Sorcerer":
				return `${6 + this.modifiers.constitution}`;
			case "Warlock":
				return `${8 + this.modifiers.constitution}`;
			case "Wizard":
				return `${6 + this.modifiers.constitution}`;
			default:
				return "0";
		}
	}

	private handleSubmit: EventListener = (e: Event) => {
		e.preventDefault();
		this.saveCharacter(false);
	};

	private async saveCharacter(isFinal = false) {
		if (this.isSaving) {
			return;
		}
		this.isSaving = true;

		const data = new FormData(this.form);

		if (isFinal) {
			data.append("enabled", "1");
		} else {
			data.append("enabled", "0");
		}

		const nameInput = this.form.querySelector('input[name="title"]') as HTMLInputElement;
		if (nameInput.value === "") {
			data.set("title", uid());
		}

		for (const [key, value] of Object.entries(this.modifiers)) {
			data.append(`fields[${key}Modifier]`, `${value}`);
		}

		if (this.entryId) {
			data.append(`entryId`, this.entryId);
		}

		const savingThrows = this.getSavingThrows();
		for (const [key, value] of Object.entries(savingThrows)) {
			data.append(`fields[${key}SavingThrow]`, `${value}`);
		}

		const skills = this.getSkills();
		for (const [key, value] of Object.entries(skills)) {
			data.append(`fields[${key}]`, `${value}`);
		}

		const proficientSkills = this.getProficientSkills();
		for (const [key, value] of Object.entries(proficientSkills)) {
			data.append(`fields[${key}Proficiency]`, `${value}`);
		}

		data.append(`fields[passiveWisdom]`, `${skills["perception"] + 10}`);
		data.append(`fields[initiative]`, `${this.modifiers.dexterity}`);

		const hitDice = this.getHitDice();
		data.append(`fields[hitDice]`, hitDice);
		data.append(`fields[currentHitDice]`, `1`);

		const hitPoints = this.getHitPoints();
		data.append(`fields[currentHitPoints]`, hitPoints);
		data.append(`fields[maximumHitPoints]`, hitPoints);

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
				this.entryId = response.id;

				if (isFinal) {
					window.location.href = `${location.origin}`;
				}
			}
		} else {
			const error = await request.text();
			console.error(error);
		}

		this.isSaving = false;
		this.countdown = 300;
	}

	private handleButtonClick: EventListener = (e: Event) => {
		const button = e.currentTarget as HTMLButtonElement;
		const dir = parseInt(button.dataset.direction);
		const inputs = this.pages[this.page].querySelectorAll("input, textarea, select");
		let isValid = true;
		inputs.forEach((input: HTMLInputElement) => {
			if (input.required && input.value === "") {
				isValid = false;
			}
		});

		if (isValid || dir === -1) {
			this.page += dir;
			this.update();
		} else {
			this.form.reportValidity();
		}
	};

	private update(): void {
		window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
		for (let i = 0; i < this.pages.length; i++) {
			if (i !== this.page) {
				this.pages[i].style.display = "none";
			} else {
				this.pages[i].style.display = "grid";
			}
		}
	}

	private handleAbilityInput: EventListener = (e: Event) => {
		const input = e.currentTarget as HTMLInputElement;
		const key = input.name.replace(/(fields\[)|(\])/g, "");
		const score = parseInt(input.value);
		const modifier = calculateModifier(score);
		this.modifiers[key] = modifier;
	};

	private autoSave() {
		const newTime = performance.now();
		const deltaTime = (newTime - this.time) / 1000;
		this.time = newTime;
		if (!this.isSaving) {
			this.countdown -= deltaTime;
			if (this.countdown <= 0 && this.isActive) {
				this.saveCharacter();
			}
		}
		window.requestAnimationFrame(this.autoSave.bind(this));
	}

	private handleSubmitButton: EventListener = (e: Event) => {
		e.preventDefault();
		env.startLoading();
		this.saveCharacter(true);
	};

	disconnectedCallback() {
		this.isActive = false;
		this.countdown = 0;
		this.autoSave = () => {};
	}

	connectedCallback() {
		this.form.addEventListener("submit", this.handleSubmit);
		this.querySelector('button[type="submit"]').addEventListener("click", this.handleSubmitButton);
		for (let i = 0; i < this.buttons.length; i++) {
			this.buttons[i].addEventListener("click", this.handleButtonClick);
		}

		this.querySelectorAll("#abilities input").forEach((input) => {
			input.addEventListener("input", this.handleAbilityInput);
		});

		if (!this.dataset.preventSave) {
			this.isActive = true;
			this.time = performance.now();
			this.autoSave();
		}
	}
}
customElements.define("character-creator", CharacterCreator);
