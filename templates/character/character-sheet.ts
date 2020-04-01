import { env } from "djinnjs/env";

class CharacterSheet extends HTMLElement {
	private pages: Array<HTMLElement>;
	private form: HTMLFormElement;
	private isSaving: boolean;
	private countdown: number;
	private time: number;

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
		if (this.isSaving) {
			return;
		}
		this.isSaving = true;
		const data = new FormData(this.form);

		const attackComponent = this.querySelector("attack-component") as AttackComponent;
		data.append(`fields[attacksAndSpells]`, attackComponent.dumpAttacks());

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
		if (document.hasFocus() && !this.isSaving) {
			this.countdown -= deltaTime;
			if (this.countdown <= 0) {
				this.saveCharacter();
			}
		}
		window.requestAnimationFrame(this.autoSave.bind(this));
	}

	connectedCallback() {
		this.querySelectorAll("nav input").forEach((input) => {
			input.addEventListener("change", this.switchView);
		});
		this.form.addEventListener("submit", this.handleCharacterSave);
		this.querySelector("#save-button").addEventListener("click", this.handleCharacterSave);
		document.addEventListener("keydown", this.handleKeypress);

		this.time = performance.now();
		this.autoSave();
	}
}
customElements.define("character-sheet", CharacterSheet);
