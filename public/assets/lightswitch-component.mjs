class LightswitchComponent extends HTMLElement {
    constructor() {
        super();
        this.handleKeyboardEvent = (e) => {
            if (e.key.toLowerCase() === "enter" || e.code.toLowerCase() === "space") {
                e.preventDefault();
                this.input.checked = this.input.checked ? false : true;
                this.validate();
            }
        };
        this.handleChangeEvent = () => {
            this.validate();
        };
        this.input = this.querySelector("input");
    }
    validate() {
        if (this.input.required && !this.input.checked) {
            this.classList.add("is-invalid");
        }
        else {
            this.classList.remove("is-invalid");
        }
    }
    connectedCallback() {
        this.addEventListener("keypress", this.handleKeyboardEvent);
        this.input.addEventListener("change", this.handleChangeEvent);
    }
}
customElements.define("lightswitch-component", LightswitchComponent);
