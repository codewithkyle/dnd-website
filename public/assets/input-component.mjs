class InputComponent extends HTMLElement {
    constructor() {
        super();
        this.handleBlurEvent = this.validate.bind(this);
        this.handleKeyboardEvent = this.clearCustomError.bind(this);
        this.input = this.querySelector(`input:not([type="hidden"])`);
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
        if (this.input.type === "email" && new RegExp(/\S+@\S+\.\S+/).test(this.input.value) === false) {
            this.classList.add("is-invalid");
            this.input.setCustomValidity("Invalid email address format.");
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
        this.input.addEventListener("input", this.handleKeyboardEvent);
        this.input.addEventListener("keypress", this.handleKeyboardEvent);
    }
}
customElements.define("input-component", InputComponent);
