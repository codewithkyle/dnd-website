type Attack = {
	name: string;
	attackBonus: string;
	damageType: string;
};
class AttackComponent extends HTMLElement {
	private state: {
		attacks: Array<Attack>;
	};
	private tBody: HTMLElement;
	constructor() {
		super();
		this.state = {
			attacks: [],
		};
		this.tBody = this.querySelector("tbody");
	}
	private addRow: EventListener = () => {
		this.state.attacks.push({
			name: "",
			attackBonus: "",
			damageType: "",
		});
		this.update();
	};

	public dumpAttacks(): string {
		const attacks = [];
		this.state.attacks.map((attack) => {
			if (attack.name !== "" && attack.damageType !== "") {
				attacks.push(attack);
			}
		});
		return JSON.stringify(attacks);
	}

	private handleChange: EventListener = (e: Event) => {
		const input = e.currentTarget as HTMLInputElement;
		const index = parseInt(input.dataset.index);
		this.state.attacks[index][input.dataset.key] = input.value;
	};

	private update() {
		this.tBody.innerHTML = "";
		this.state.attacks.map((attack, index) => {
			const row = document.createElement("tr"),
				nameCell = document.createElement("td"),
				attackCell = document.createElement("td"),
				typeCell = document.createElement("td");
			const nameInput = document.createElement("input"),
				attackInput = document.createElement("input"),
				typeInput = document.createElement("input");

			row.dataset.index = `${index}`;

			nameInput.type = "text";
			nameInput.value = attack.name;
			nameInput.dataset.index = `${index}`;
			nameInput.dataset.key = "name";
			nameInput.addEventListener("input", this.handleChange);

			attackInput.type = "text";
			attackInput.value = attack.attackBonus;
			attackInput.dataset.index = `${index}`;
			attackInput.dataset.key = "attackBonus";
			attackInput.addEventListener("input", this.handleChange);

			typeInput.type = "text";
			typeInput.value = attack.damageType;
			typeInput.dataset.index = `${index}`;
			typeInput.dataset.key = "damageType";
			typeInput.addEventListener("input", this.handleChange);

			nameCell.appendChild(nameInput);
			attackCell.appendChild(attackInput);
			typeCell.appendChild(typeInput);

			row.setAttribute("grid", "columns 3 gap-1");
			row.append(nameCell, attackCell, typeCell);
			this.tBody.appendChild(row);
		});
		if (this.state.attacks.length) {
			this.tBody.parentElement.style.display = "block";
		} else {
			this.tBody.parentElement.style.display = "none";
		}
	}
	connectedCallback() {
		this.querySelector("button").addEventListener("click", this.addRow);
	}
}
customElements.define("attack-component", AttackComponent);
