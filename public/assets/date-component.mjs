import flatpickr from "./flatpickr.mjs";
class DateComponent extends HTMLElement {
    constructor() {
        super();
        this.handleInputEvent = this.validate.bind(this);
        this.input = this.querySelector("input");
    }
    validate() {
        if (this.input.value !== "") {
            this.classList.add("has-value");
        }
        else {
            this.classList.remove("has-value");
        }
        if (this.input.validity.valid) {
            this.classList.remove("is-invalid");
        }
        else {
            this.classList.add("is-invalid");
        }
    }
    connectedCallback() {
        flatpickr(this.input);
        this.input.addEventListener("change", this.handleInputEvent);
        this.input.addEventListener("blur", this.handleInputEvent);
    }
}
customElements.define("date-component", DateComponent);
