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
		this.entities = Array.from(this.querySelectorAll("entity-wrapper entity-component"));
	};

	private updateOrder: EventListener = () => {
		message("server", {
			type: "initiation-order",
		});
	};

	connectedCallback() {
		this.querySelector(".js-add-entity").addEventListener("click", this.addEntityComponent);
		this.querySelector(".js-update-initiation-order").addEventListener("click", this.updateOrder);
	}
}
customElements.define("initiation-component", InitationComponent);
customElements.define("entity-component", EntityComponent);
