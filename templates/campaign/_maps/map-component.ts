import { message } from "djinnjs/broadcaster";

class MapComponent extends HTMLElement {
	private handleClick: EventListener = () => {
		message("server", {
			type: "load-map",
			url: this.dataset.url,
		});
	};

	connectedCallback() {
		this.addEventListener("click", this.handleClick);
	}
}
customElements.define("map-component", MapComponent);
