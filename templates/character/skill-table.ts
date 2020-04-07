class SkillTable extends HTMLElement {
	private modifiers: Array<HTMLInputElement>;
	private checkboxes: Array<HTMLInputElement>;

	constructor() {
		super();
		this.modifiers = Array.from(this.querySelectorAll('input[type="number"]'));
		this.checkboxes = Array.from(this.querySelectorAll('input[type="checkbox"]'));
	}

	private toggleProficiencyBonus: EventListener = (e: Event) => {
		const input = e.currentTarget as HTMLInputElement;
		const skill = input.dataset.skill;

		const profBonus = document.body.querySelector('input[name="fields[proficiencyBonus]"]') as HTMLInputElement;

		for (let i = 0; i < this.modifiers.length; i++) {
			if (this.modifiers[i].dataset.skill === skill) {
				if (input.checked) {
					this.modifiers[i].value = `${parseInt(this.modifiers[i].value) + parseInt(profBonus.value)}`;
				} else {
					this.modifiers[i].value = `${parseInt(this.modifiers[i].value) + parseInt(profBonus.value)}`;
				}
				break;
			}
		}
	};

	connectedCallback() {
		for (let i = 0; i < this.checkboxes.length; i++) {
			this.checkboxes[i].addEventListener("change", this.toggleProficiencyBonus);
		}
	}
}
customElements.define("skill-table", SkillTable);
