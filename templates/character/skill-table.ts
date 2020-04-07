import { hookup, disconnect } from "djinnjs/broadcaster";

class SkillTable extends HTMLElement {
	private modifiers: Array<HTMLInputElement>;
	private checkboxes: Array<HTMLInputElement>;
	private inboxUid: string;

	constructor() {
		super();
		this.modifiers = Array.from(this.querySelectorAll('input[type="number"]'));
		this.checkboxes = Array.from(this.querySelectorAll('input[type="checkbox"]'));
		this.inboxUid = hookup("character-update", this.inbox.bind(this));
	}

	private inbox(data) {
		switch (data.type) {
			case "proficiency":
				this.updateCheckedSkills(data.difference);
				break;
			default:
				break;
		}
	}

	private updateCheckedSkills(diff) {
		for (let i = 0; i < this.checkboxes.length; i++) {
			if (this.checkboxes[i].checked) {
				for (let k = 0; k < this.modifiers.length; k++) {
					if (this.modifiers[k].dataset.skill === this.checkboxes[i].dataset.skill) {
						this.modifiers[k].value = `${parseInt(this.modifiers[k].value) + diff}`;
						break;
					}
				}
			}
		}
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
					this.modifiers[i].value = `${parseInt(this.modifiers[i].value) - parseInt(profBonus.value)}`;
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

	disconnectedCallback() {
		disconnect(this.inboxUid);
	}
}
customElements.define("skill-table", SkillTable);
