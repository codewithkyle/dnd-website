import { env } from "djinnjs/env";
import { snackbar } from "@codewithkyle/notifyjs";

class DeleteNPCButton extends HTMLElement {
	private isDeleting: boolean;
	constructor() {
		super();
		this.isDeleting = false;
	}
	private delete: EventListener = async () => {
		if (this.isDeleting) {
			return;
		}
		const ticket = env.startLoading();
		this.isDeleting = true;
		const data = {
			CRAFT_CSRF_TOKEN: document.documentElement.dataset.csrf,
			entryId: this.dataset.entryId,
		};
		const request = await fetch(`${location.origin}/actions/entries/delete-entry`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: new Headers({
				Accept: "application/json",
				"Content-Type": "application/json",
			}),
			credentials: "include",
		});
		if (request.ok) {
			const response = await request.json();
			if (!response.success) {
				const error = response?.error || response?.errors?.[0] || null;
				if (error) {
					snackbar({
						message: error,
						closeable: true,
						force: true,
						duration: 3,
					});
				}
				this.isDeleting = false;
				env.stopLoading(ticket);
			} else {
				location.href = `${location.origin}/campaign/${this.dataset.campaignUid}`;
			}
		} else {
			const error = await request.text();
			console.error(error);
			snackbar({
				message: "Failed to delete NPC, try again later.",
				closeable: true,
				force: true,
				duration: 3,
			});
			this.isDeleting = false;
			env.stopLoading(ticket);
		}
	};
	connectedCallback() {
		this.addEventListener("click", this.delete);
	}
}
customElements.define("delete-npc-button", DeleteNPCButton);
