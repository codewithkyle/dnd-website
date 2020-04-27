class DatalistComponent extends HTMLElement {
	private input: HTMLInputElement;

	constructor() {
		super();
		this.input = this.querySelector("input");
	}

	private validate(): void {
		// @ts-ignore
		if (this.input.value) {
			this.classList.add("has-value");
		} else {
			this.classList.remove("has-value");
		}
	}
	private handleBlurEvent: EventListener = this.validate.bind(this);

	connectedCallback() {
		this.input.addEventListener("blur", this.handleBlurEvent);
	}
}
customElements.define("datalist-component", DatalistComponent);
