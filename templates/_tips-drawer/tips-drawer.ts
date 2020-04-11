import { hookup } from "djinnjs/broadcaster";

class TipsDrawer extends HTMLElement {
	private isOpen: boolean;

	constructor() {
		super();
		hookup("tips-drawer", this.inbox.bind(this));
	}
	private inbox(data) {
		switch (data.type) {
			case "toggle":
				this.isOpen = this.isOpen ? false : true;
				this.update();
				break;
			default:
				break;
		}
	}

	private update() {
		if (this.isOpen) {
			this.classList.add("is-open");
		} else {
			this.classList.remove("is-open");
		}
	}

	private closeDrawer: EventListener = () => {
		this.isOpen = false;
		this.update();
	};

	private handleKey: EventListener = (e: KeyboardEvent) => {
		if (e instanceof KeyboardEvent) {
			if (e.key.toLowerCase() === "escape") {
				this.isOpen = false;
				this.update();
			}
		}
	};

	connectedCallback() {
		this.querySelector("close-button").addEventListener("click", this.closeDrawer);
		document.body.addEventListener("keyup", this.handleKey);
	}
}
customElements.define("tips-drawer", TipsDrawer);
