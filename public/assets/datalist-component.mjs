class DatalistComponent extends HTMLElement {
    constructor() {
        super();
        this.handleBlurEvent = this.validate.bind(this);
        this.input = this.querySelector("input");
    }
    validate() {
        // @ts-ignore
        if (this.input.value) {
            this.classList.add("has-value");
        }
        else {
            this.classList.remove("has-value");
        }
    }
    connectedCallback() {
        this.input.addEventListener("blur", this.handleBlurEvent);
    }
}
customElements.define("datalist-component", DatalistComponent);
