import { message } from "djinnjs/broadcaster";

class TipsButton extends HTMLElement {
	private toggleTipsDrawer: EventListener = () => {
		message("tips-drawer", {
			type: "toggle",
		});
	};
	connectedCallback() {
		this.addEventListener("click", this.toggleTipsDrawer);
	}
}
customElements.define("tips-button", TipsButton);
