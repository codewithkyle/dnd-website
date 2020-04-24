import { message } from "djinnjs/broadcaster";

export class EntityComponent extends HTMLElement {
	public nameInput: HTMLInputElement;
	public initiationInput: HTMLInputElement;

	constructor() {
		super();
		this.nameInput = this.querySelector(".js-name");
		this.initiationInput = this.querySelector(".js-initiation");
	}

	private removeEntity: EventListener = () => {
		this.remove();
	};

	private ping: EventListener = () => {
		message("server", {
			type: "combat-order-update",
			uid: this.dataset.uid,
		});
	};

	connectedCallback() {
		const removeButton = this.querySelector(".js-remove");
		const pingButton = this.querySelector(".js-ping");

		if (removeButton) {
			removeButton.addEventListener("click", this.removeEntity);
		}

		if (pingButton) {
			pingButton.addEventListener("click", this.ping);
		}
	}
}
