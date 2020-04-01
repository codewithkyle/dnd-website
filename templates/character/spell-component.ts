class SpellComponent extends HTMLElement {
	private lineItemsContainer: HTMLElement;

	constructor() {
		super();
		this.lineItemsContainer = this.querySelector("line-items");
	}

	private removeRow: EventListener = (e: Event) => {
		const target = e.currentTarget as HTMLElement;
		target.parentElement.remove();
	};

	private addRow: EventListener = () => {
		const lineItem = document.createElement("div");
		lineItem.classList.add("block", "w-full", "mb-1");
		const input = document.createElement("input");
		input.type = "text";
		lineItem.appendChild(input);
		const button = document.createElement("button");
		button.type = "button";
		button.classList.add("close");
		button.innerHTML = `<svg style="width:12px;height:12px;" aria-hidden="true" focusable="false" data-prefix="far" data-icon="times" class="svg-inline--fa fa-times fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>`;
		button.addEventListener("click", this.removeRow);
		lineItem.appendChild(button);

		this.lineItemsContainer.appendChild(lineItem);
	};

	public dumpData(): string {
		const cantrips = [];
		this.querySelectorAll("input").forEach((input: HTMLInputElement) => {
			if (input.value !== "") {
				cantrips.push(input.value);
			}
		});
		return JSON.stringify(cantrips);
	}

	connectedCallback() {
		this.querySelector(".add-spell").addEventListener("click", this.addRow);

		this.lineItemsContainer.querySelectorAll("button").forEach((button) => {
			button.addEventListener("click", this.removeRow);
		});
	}
}
customElements.define("spell-component", SpellComponent);
