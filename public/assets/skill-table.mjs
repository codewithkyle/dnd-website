import { hookup, disconnect } from "./broadcaster.mjs";
class SkillTable extends HTMLElement {
    constructor() {
        super();
        this.toggleProficiencyBonus = (e) => {
            const input = e.currentTarget;
            const skill = input.dataset.skill;
            const profBonus = document.body.querySelector('input[name="fields[proficiencyBonus]"]');
            for (let i = 0; i < this.modifiers.length; i++) {
                if (this.modifiers[i].dataset.skill === skill) {
                    if (input.checked) {
                        this.modifiers[i].value = `${parseInt(this.modifiers[i].value) + parseInt(profBonus.value)}`;
                    }
                    else {
                        this.modifiers[i].value = `${parseInt(this.modifiers[i].value) - parseInt(profBonus.value)}`;
                    }
                    break;
                }
            }
        };
        this.modifiers = Array.from(this.querySelectorAll('input[type="number"]'));
        this.checkboxes = Array.from(this.querySelectorAll('input[type="checkbox"]'));
        this.inboxUid = hookup("character-update", this.inbox.bind(this));
    }
    inbox(data) {
        switch (data.type) {
            case "proficiency":
                this.updateCheckedSkills(data.difference);
                break;
            case "strength":
                this.updateModifiers("strength", data.difference);
                break;
            case "dexterity":
                this.updateModifiers("dexterity", data.difference);
                break;
            case "constitution":
                this.updateModifiers("constitution", data.difference);
                break;
            case "intelligence":
                this.updateModifiers("intelligence", data.difference);
                break;
            case "wisdom":
                this.updateModifiers("wisdom", data.difference);
                break;
            case "charisma":
                this.updateModifiers("charisma", data.difference);
                break;
            default:
                break;
        }
    }
    updateModifiers(skill, difference) {
        this.querySelectorAll(`input[type="number"][data-ability="${skill}"]`).forEach((input) => {
            input.value = `${parseInt(input.value) + difference}`;
        });
    }
    updateCheckedSkills(diff) {
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
