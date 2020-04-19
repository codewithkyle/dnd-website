import { message } from "djinnjs/broadcaster";

class CustomMap extends HTMLElement {
	private input: HTMLInputElement;
	private reader: FileReader;
	constructor() {
		super();
		this.reader = null;
		this.input = this.querySelector("input");
	}

	private handleClick: EventListener = () => {
		this.input.focus();
		this.input.click();
	};

	private handleFile: EventListener = (e: Event) => {
		const files = this.input.files;
		if (files.length) {
			this.reader.readAsDataURL(files[0]);
		}
	};

	private handleFileLoad: EventListener = () => {
		message("server", {
			type: "load-map",
			url: this.reader.result,
		});
	};

	connectedCallback() {
		this.addEventListener("click", this.handleClick);
		this.input.addEventListener("change", this.handleFile);
		this.reader = new FileReader();
		this.reader.addEventListener("load", this.handleFileLoad);
	}
}
customElements.define("custom-map-component", CustomMap);
