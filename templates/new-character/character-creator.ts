import { env } from "djinnjs/env";

class CharacterCreator extends HTMLElement {
	private form: HTMLFormElement;
	private buttons: Array<HTMLButtonElement>;
	private page: number;
	private pages: Array<HTMLElement>;
	private classInput: HTMLInputElement;
	private modifiers: {
		strength: number;
		dexterity: number;
		constitution: number;
		intelligence: number;
		wisdom: number;
		charisma: number;
	};

	constructor() {
		super();
		this.page = 0;
		this.form = this.querySelector("form");
		this.buttons = Array.from(this.querySelectorAll(`button[type="button"`));
		this.pages = Array.from(this.querySelectorAll("form-page"));
		this.classInput = this.querySelector('select[name="fields[class]"]');
		this.modifiers = {
			strength: 0,
			dexterity: 0,
			constitution: 0,
			intelligence: 0,
			wisdom: 0,
			charisma: 0,
		};
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
		}
	}

	private handleSubmit: EventListener = async (e: Event) => {
		e.preventDefault();
		const ticket = env.startLoading();
		const data = new FormData(this.form);

		for (const [key, value] of Object.entries(this.modifiers)) {
			data.append(`fields[${key}Modifier]`, `${value}`);
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
			// @ts-ignore
			location.href = `${location.origin}/character/${response.slug}`;
		} else {
			const error = await request.text();
			console.error(error);
		}
		env.stopLoading(ticket);
	};

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
		this.modifiers[key] = modifier;
	};

	connectedCallback() {
		this.form.addEventListener("submit", this.handleSubmit);
		for (let i = 0; i < this.buttons.length; i++) {
			this.buttons[i].addEventListener("click", this.handleButtonClick);
		}

		this.querySelectorAll("#abilities input").forEach((input) => {
			input.addEventListener("input", this.handleAbilityInput);
		});
	}
}
customElements.define("character-creator", CharacterCreator);
