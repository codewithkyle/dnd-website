import { env } from "djinnjs/env";
import { message } from "djinnjs/broadcaster";
import { notify } from "@codewithkyle/notifyjs";

class CharacterSheet extends HTMLElement {
	private pages: Array<HTMLElement>;
	private form: HTMLFormElement;
	private isSaving: boolean;
	private countdown: number;
	private time: number;
	private isActive: boolean;

	constructor() {
		super();
		this.isSaving = false;
		this.pages = Array.from(this.querySelectorAll("form-page"));
		this.form = this.querySelector("form");
		this.countdown = 300;
	}

	private switchView: EventListener = (e: Event) => {
		const input = e.currentTarget as HTMLInputElement;
		const index = parseInt(input.value);
		for (let i = 0; i < this.pages.length; i++) {
			if (i === index) {
				this.pages[i].style.display = "grid";
			} else {
				this.pages[i].style.display = "none";
			}
		}

		window.history.replaceState(null, null, `${location.origin}/character/${this.dataset.characterId}/${input.dataset.slug}`);
	};

	private handleCharacterSave: EventListener = (e: Event) => {
		e.preventDefault();
		this.saveCharacter(true);
	};

	private async saveCharacter(doLoading = false) {
		if (this.dataset.preventSave) {
			return;
		}

		if (this.isSaving) {
			return;
		}
		this.isSaving = true;
		const data = new FormData(this.form);

		const attackComponent = this.querySelector("attack-component") as AttackComponent;
		data.append(`fields[attacksAndSpells]`, attackComponent.dumpAttacks());

		const cantripsComponent = this.querySelector("#cantrip-spellbook") as SpellComponent;
		data.append(`fields[cantrips]`, cantripsComponent.dumpData());

		const level1Spells = this.querySelector("#level-1-spellbook") as SpellComponent;
		data.append(`fields[level1Spells]`, level1Spells.dumpData());

		const level2Spells = this.querySelector("#level-2-spellbook") as SpellComponent;
		data.append(`fields[level2Spells]`, level2Spells.dumpData());

		const level3Spells = this.querySelector("#level-3-spellbook") as SpellComponent;
		data.append(`fields[level3Spells]`, level3Spells.dumpData());

		const level4Spells = this.querySelector("#level-4-spellbook") as SpellComponent;
		data.append(`fields[level4Spells]`, level4Spells.dumpData());

		const level5Spells = this.querySelector("#level-5-spellbook") as SpellComponent;
		data.append(`fields[level5Spells]`, level5Spells.dumpData());

		const level6Spells = this.querySelector("#level-6-spellbook") as SpellComponent;
		data.append(`fields[level6Spells]`, level6Spells.dumpData());

		const level7Spells = this.querySelector("#level-7-spellbook") as SpellComponent;
		data.append(`fields[level7Spells]`, level7Spells.dumpData());

		const level8Spells = this.querySelector("#level-8-spellbook") as SpellComponent;
		data.append(`fields[level8Spells]`, level8Spells.dumpData());

		const level9Spells = this.querySelector("#level-9-spellbook") as SpellComponent;
		data.append(`fields[level9Spells]`, level9Spells.dumpData());

		let ticket;
		if (doLoading) {
			ticket = env.startLoading();
		}

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
			if (!response.success) {
				console.error(response);
			}
		} else {
			const error = await request.text();
			console.error(error);
		}

		if (doLoading) {
			env.stopLoading(ticket);
			notify({
				message: "Character saved.",
				force: false,
				closeable: true,
				duration: 3,
			});
		}

		this.countdown = 300;
		this.isSaving = false;
	}

	private handleKeypress: EventListener = (e: KeyboardEvent) => {
		if (e instanceof KeyboardEvent) {
			if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				this.saveCharacter(true);
			}
		}
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

	disconnectedCallback() {
		this.isActive = false;
		this.countdown = 0;
		this.autoSave = () => {};

		message("server", {
			type: "leave",
			campaign: this.dataset.campaignUid,
		});
	}

	connectedCallback() {
		this.querySelectorAll("nav input").forEach((input) => {
			input.addEventListener("change", this.switchView);
		});
		this.form.addEventListener("submit", this.handleCharacterSave);

		if (!this.dataset.preventSave) {
			this.querySelector("#save-button").addEventListener("click", this.handleCharacterSave);
			document.addEventListener("keydown", this.handleKeypress);
			this.time = performance.now();
			this.isActive = true;
			this.autoSave();
		}
		message("server", {
			type: "join",
			name: this.dataset.characterName,
			campaign: this.dataset.campaignUid,
		});
	}
}
customElements.define("character-sheet", CharacterSheet);
