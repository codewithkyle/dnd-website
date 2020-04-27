class SpellbookComponent extends HTMLElement {
    constructor() {
        super();
        this.handleTabSwitch = (e) => {
            const button = e.currentTarget;
            const index = parseInt(button.dataset.index);
            for (let i = 0; i < this.tabButtons.length; i++) {
                if (i !== index) {
                    this.tabButtons[i].classList.remove("is-active");
                }
                else {
                    this.tabButtons[i].classList.add("is-active");
                }
            }
            for (let i = 0; i < this.pages.length; i++) {
                if (i !== index) {
                    this.pages[i].style.display = "none";
                }
                else {
                    this.pages[i].style.display = "block";
                }
            }
        };
        this.tabButtons = Array.from(this.querySelectorAll("spellbook-tabs button"));
        this.pages = Array.from(this.querySelectorAll("spellbook-page"));
    }
    connectedCallback() {
        this.tabButtons.forEach((button) => {
            button.addEventListener("click", this.handleTabSwitch);
        });
    }
}
customElements.define("spellbook-component", SpellbookComponent);
