import { env } from "djinnjs/env";
import { notify } from "@codewithkyle/notifyjs";
import { message } from "djinnjs/broadcaster";

class NPCSheet extends HTMLElement {
	private form: HTMLFormElement;
	private isSaving: boolean;
	constructor() {
		super();
		this.form = this.querySelector("form");
		this.isSaving = false;
	}
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
			if (!response.success) {
				const error = response?.error || response?.errors?.[0] || null;
				if (error) {
					notify({
						message: error,
						closeable: true,
						force: true,
						duration: 3,
					});
				}
			} else {
				notify({
					message: "NPC successfully saved.",
					closeable: true,
					force: true,
					duration: 3,
				});
			}
		} else {
			const error = await request.text();
			console.error(error);
			notify({
				message: "Failed to save NPC, try again later.",
				closeable: true,
				force: true,
				duration: 3,
			});
		}
		this.isSaving = false;
		env.stopLoading(ticket);
	}

	private handleSave: EventListener = (e: Event) => {
		e.preventDefault();
		this.save();
	};

	private handleKeypress: EventListener = (e: KeyboardEvent) => {
		if (e instanceof KeyboardEvent) {
			if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				this.save();
			}
		}
	};

	connectedCallback() {
		this.form.addEventListener("submit", this.handleSave);
		document.addEventListener("keydown", this.handleKeypress);

		message("server", {
			type: "join",
			name: "Game Master",
			campaign: this.dataset.campaignUid,
		});
	}
}
customElements.define("npc-sheet", NPCSheet);
