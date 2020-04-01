class SpellbookComponent extends HTMLElement {
	private tabButtons: Array<HTMLButtonElement>;
	private pages: Array<HTMLElement>;

	constructor() {
		super();
		this.tabButtons = Array.from(this.querySelectorAll("spellbook-tabs button"));
		this.pages = Array.from(this.querySelectorAll("spellbook-page"));
	}

	private handleTabSwitch: EventListener = (e: Event) => {
		const button = e.currentTarget as HTMLButtonElement;
		const index = parseInt(button.dataset.index);
		for (let i = 0; i < this.tabButtons.length; i++) {
			if (i !== index) {
				this.tabButtons[i].classList.remove("is-active");
			} else {
				this.tabButtons[i].classList.add("is-active");
			}
		}
		for (let i = 0; i < this.pages.length; i++) {
			if (i !== index) {
				this.pages[i].style.display = "none";
			} else {
				this.pages[i].style.display = "block";
			}
		}
	};

	connectedCallback() {
		this.tabButtons.forEach((button) => {
			button.addEventListener("click", this.handleTabSwitch);
		});
	}
}
customElements.define("spellbook-component", SpellbookComponent);
