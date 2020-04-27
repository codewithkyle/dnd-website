class SelectComponent extends HTMLElement {
    constructor() {
        super();
        this.handleBlurEvent = this.validate.bind(this);
        this.handleKeyboardEvent = this.clearCustomError.bind(this);
        this.input = this.querySelector("select");
    }
    validate() {
        if (this.input.value === "") {
            this.classList.remove("has-value");
        }
        else {
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
    clearCustomError() {
        if (this.classList.contains("is-invalid")) {
            this.input.setCustomValidity("");
            this.input.reportValidity();
            this.classList.remove("is-invalid");
        }
    }
    connectedCallback() {
        this.input.addEventListener("blur", this.handleBlurEvent);
        this.input.addEventListener("keypress", this.handleKeyboardEvent);
    }
}
customElements.define("select-component", SelectComponent);
