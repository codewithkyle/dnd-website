class CheckboxComponent extends HTMLElement {
    constructor() {
        super();
        this.handleKeyboardEvent = (e) => {
            if (e.key.toLowerCase() === "enter" || e.code.toLowerCase() === "space") {
                e.preventDefault();
                this.input.checked = this.input.checked ? false : true;
            }
        };
        this.input = this.querySelector("input");
    }
    connectedCallback() {
        this.addEventListener("keypress", this.handleKeyboardEvent);
    }
}
customElements.define("checkbox-component", CheckboxComponent);
