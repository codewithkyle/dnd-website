class FieldsetComponent extends HTMLElement {
    constructor() {
        super();
        this.handleChangeEvent = this.validate.bind(this);
        this.inputs = this.querySelectorAll("input");
    }
    validate(e) {
        const input = e.currentTarget;
        if (input.checked) {
            this.classList.remove("is-invalid");
            this.inputs.forEach(inputEl => {
                inputEl.parentElement.classList.remove("is-invalid");
            });
        }
        else {
            let foundOnceCheck = false;
            this.inputs.forEach(inputEl => {
                if (inputEl.checked) {
                    foundOnceCheck = true;
                }
            });
            if (foundOnceCheck) {
                this.classList.remove("is-invalid");
                this.inputs.forEach(inputEl => {
                    inputEl.parentElement.classList.remove("is-invalid");
                });
            }
            else {
                this.classList.add("is-invalid");
                this.inputs.forEach(inputEl => {
                    inputEl.parentElement.classList.add("is-invalid");
                });
            }
        }
    }
    connectedCallback() {
        this.inputs.forEach(input => {
            input.addEventListener("change", this.handleChangeEvent);
        });
    }
}
customElements.define("fieldset-component", FieldsetComponent);
