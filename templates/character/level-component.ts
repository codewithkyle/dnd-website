class LevelComponent extends HTMLElement {
	private levelInput: HTMLInputElement;
	private expInput: HTMLInputElement;
	private profBonuesInput: HTMLInputElement;

	constructor() {
		super();
		this.levelInput = this.querySelector('input[name="fields[charLevel]"]');
		this.expInput = this.querySelector('input[name="fields[exp]"]');
		this.profBonuesInput = this.querySelector('input[name="fields[proficiencyBonus]"]');
	}

	private calculateLevel(exp: number): number {
		if (exp >= 355000) {
			return 20;
		} else if (exp >= 305000) {
			return 19;
		} else if (exp >= 265000) {
			return 18;
		} else if (exp >= 225000) {
			return 17;
		} else if (exp >= 195000) {
			return 16;
		} else if (exp >= 165000) {
			return 15;
		} else if (exp >= 140000) {
			return 14;
		} else if (exp >= 120000) {
			return 13;
		} else if (exp >= 100000) {
			return 12;
		} else if (exp >= 85000) {
			return 11;
		} else if (exp >= 64000) {
			return 10;
		} else if (exp >= 48000) {
			return 9;
		} else if (exp >= 34000) {
			return 8;
		} else if (exp >= 23000) {
			return 7;
		} else if (exp >= 14000) {
			return 6;
		} else if (exp >= 6500) {
			return 5;
		} else if (exp >= 2700) {
			return 4;
		} else if (exp >= 900) {
			return 3;
		} else if (exp >= 300) {
			return 2;
		} else {
			return 1;
		}
	}

	private calculateProficencyBonus(level: number): number {
		if (level >= 1 && level <= 4) {
			return 2;
		} else if (level >= 5 && level <= 8) {
			return 3;
		} else if (level >= 9 && level <= 12) {
			return 4;
		} else if (level >= 13 && level <= 16) {
			return 5;
		} else {
			return 6;
		}
	}

	private calculateFromExperience: EventListener = () => {
		const exp = parseInt(this.expInput.value);
		const level = this.calculateLevel(exp);
		const profBonus = this.calculateProficencyBonus(level);
		this.levelInput.value = `${level}`;
		this.profBonuesInput.value = `${profBonus}`;
	};

	connectedCallback() {
		this.expInput.addEventListener("input", this.calculateFromExperience);
	}
}
customElements.define("level-component", LevelComponent);
