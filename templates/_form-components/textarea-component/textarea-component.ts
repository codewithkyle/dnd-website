class TextareaComponent extends HTMLElement {
	private input: HTMLTextAreaElement;

	constructor() {
		super();
		this.input = this.querySelector("textarea");
	}

	private validate(): void {
		if (this.input.value === "") {
			this.classList.remove("has-value");
		} else {
			this.classList.add("has-value");
		}

		if (this.classList.contains("is-invalid")) {
			return;
		}

		if (!this.input.validity.valid) {
			this.classList.add("is-invalid");
			this.input.reportValidity();
			return;
		}

		this.classList.remove("is-invalid");
	}
	private handleBlurEvent: EventListener = this.validate.bind(this);

	private clearCustomError(): void {
		if (this.classList.contains("is-invalid")) {
			this.input.setCustomValidity("");
			this.input.reportValidity();
			this.classList.remove("is-invalid");
		}
	}
	private handleKeyboardEvent: EventListener = this.clearCustomError.bind(this);

	connectedCallback() {
		this.input.addEventListener("blur", this.handleBlurEvent);
		this.input.addEventListener("input", this.handleKeyboardEvent);
		this.input.addEventListener("keypress", this.handleKeyboardEvent);
	}
}
customElements.define("textarea-component", TextareaComponent);
