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

	private pingPlayer: EventListener = () => {
		message("server", {
			type: "ping-player",
			characterUid: this.dataset.characterUid,
		});
	};

	connectedCallback() {
		const removeButton = this.querySelector(".js-remove");
		const pingButton = this.querySelector(".js-ping");

		if (removeButton) {
			removeButton.addEventListener("click", this.removeEntity);
		}

		if (pingButton) {
			pingButton.addEventListener("click", this.pingPlayer);
		}
	}
}
