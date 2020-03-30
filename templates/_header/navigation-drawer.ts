import { hookup, message } from "djinnjs/broadcaster";

type NavigationDrawerState = {
	open: boolean;
};

class NavigationDrawer extends HTMLElement {
	private state: NavigationDrawerState;
	private closeButton: HTMLElement;
	constructor() {
		super();
		this.state = {
			open: false,
		};
		this.closeButton = this.querySelector("button");
	}

	private inbox(data): void {
		const { type } = data;
		switch (type) {
			case "toggle":
				this.state.open = data.open;
				this.update();
				break;
			default:
				console.warn(`Undefined Navigation Drawer message type: "${type}"`);
				break;
		}
	}

	private update() {
		this.setAttribute("state", `${this.state.open ? "open" : "closed"}`);
		if (this.state.open) {
			this.closeButton.focus();
		}
	}

	private handleKeypress: EventListener = (e: KeyboardEvent) => {
		if (e.key.toLowerCase() === "escape") {
			this.state.open = false;
			this.update();
		}
	};

	private closeDrawer: EventListener = (e: Event) => {
		message("navigation-drawer", {
			type: "toggle",
			open: false,
		});
	};

	connectedCallback() {
		hookup("navigation-drawer", this.inbox.bind(this));
		document.addEventListener("keyup", this.handleKeypress);
		this.closeButton.addEventListener("click", this.closeDrawer);
	}
}
customElements.define("navigation-drawer", NavigationDrawer);
