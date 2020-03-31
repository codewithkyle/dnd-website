import { env } from "djinnjs/env";

class CharacterCreator extends HTMLElement {
	private form: HTMLFormElement;
	private buttons: Array<HTMLButtonElement>;
	private page: number;
	private pages: Array<HTMLElement>;
	constructor() {
		super();
		this.page = 0;
		this.form = this.querySelector("form");
		this.buttons = Array.from(this.querySelectorAll(`button[type="button"`));
		this.pages = Array.from(this.querySelectorAll("form-page"));
	}

	private handleSubmit: EventListener = async (e: Event) => {
		e.preventDefault();
		const ticket = env.startLoading();
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
		this.page += dir;
		this.update();
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

	connectedCallback() {
		this.form.addEventListener("submit", this.handleSubmit);
		for (let i = 0; i < this.buttons.length; i++) {
			this.buttons[i].addEventListener("click", this.handleButtonClick);
		}
	}
}
customElements.define("character-creator", CharacterCreator);
