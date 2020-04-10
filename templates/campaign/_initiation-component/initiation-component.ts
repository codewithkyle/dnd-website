import { EntityComponent } from "./entity-component";
import { message } from "djinnjs/broadcaster";

class InitationComponent extends HTMLElement {
	private entityComponentTemplate: HTMLTemplateElement;
	private entities: Array<HTMLElement>;
	private entityWrapper: HTMLElement;

	constructor() {
		super();
		this.entities = Array.from(this.querySelectorAll("entity-wrapper entity-component"));
		this.entityComponentTemplate = this.querySelector('template[tag="entity-component"]');
		this.entityWrapper = this.querySelector("entity-wrapper");
	}

	private addEntityComponent: EventListener = () => {
		const newComponent = this.entityComponentTemplate.content.cloneNode(true);
		this.entityWrapper.appendChild(newComponent);
	};

	private updateOrder: EventListener = () => {
		this.entities = Array.from(this.querySelectorAll("entity-wrapper entity-component"));
		const orderedEntities = [];
		for (let i = 0; i < this.entities.length; i++) {
			const entity = {
				el: this.entities[i],
				// @ts-ignore
				value: parseInt(this.entities[i].querySelector(".js-initiation").value),
			};
			if (i === 0) {
				orderedEntities.push(entity);
			} else {
				let injectAt = null;
				for (let k = 0; k < orderedEntities.length; k++) {
					if (entity.value >= orderedEntities[k].value) {
						injectAt = k;
						break;
					}
				}
				if (injectAt === null) {
					orderedEntities.push(entity);
				} else {
					orderedEntities.splice(injectAt, 0, entity);
				}
			}
		}

		const serverData = [];
		for (let i = 0; i < orderedEntities.length; i++) {
			orderedEntities[i].el.style.order = i;
			serverData.push({
				name: orderedEntities[i].el.querySelector(".js-name").value,
				characterUid: orderedEntities[i].el.dataset.characterUid,
			});
		}

		message("server", {
			type: "initiation-order",
			entities: serverData,
		});
	};

	connectedCallback() {
		this.querySelector(".js-add-entity").addEventListener("click", this.addEntityComponent);
		this.querySelector(".js-update-initiation-order").addEventListener("click", this.updateOrder);
	}
}
customElements.define("initiation-component", InitationComponent);
customElements.define("entity-component", EntityComponent);
