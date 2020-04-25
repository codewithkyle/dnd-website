import { EntityComponent } from "./entity-component";
import { message, hookup } from "djinnjs/broadcaster";
import { snackbar } from "@codewithkyle/notifyjs";
import { uid } from "../../uid";

class InitationComponent extends HTMLElement {
	private entityComponentTemplate: HTMLTemplateElement;
	private entities: Array<HTMLElement>;
	private entityWrapper: HTMLElement;
	private inboxUid: string;
	private needReset: boolean;

	constructor() {
		super();
		this.entities = Array.from(this.querySelectorAll("entity-wrapper entity-component"));
		this.entityComponentTemplate = this.querySelector('template[tag="entity-component"]');
		this.entityWrapper = this.querySelector("entity-wrapper");
		this.inboxUid = hookup("initiation-order", this.inbox.bind(this));
		this.needReset = true;
	}

	private inbox(data) {
		switch (data.type) {
			case "set-order":
				this.initOrder(data.order);
				break;
			default:
				break;
		}
	}

	private initOrder(order) {
		if (!this.needReset) {
			return;
		}
		this.entityWrapper.innerHTML = "";
		for (let i = 0; i < order.length; i++) {
			const node = document.importNode(this.entityComponentTemplate.content, true);
			const component = node.querySelector("entity-component") as HTMLElement;
			component.style.order = `${i}`;
			component.dataset.uid = order[i].uid;
			const name = component.querySelector(".js-name") as HTMLInputElement;
			name.value = order[i].name;
			const number = component.querySelector(".js-initiation") as HTMLInputElement;
			number.value = `${order.length - i}`;
			this.entityWrapper.appendChild(node);
		}
		this.entities = Array.from(this.querySelectorAll("entity-wrapper entity-component"));
	}

	private addEntityComponent: EventListener = () => {
		const node = document.importNode(this.entityComponentTemplate.content, true);
		const component = node.querySelector("entity-component") as HTMLElement;
		component.style.order = `${this.entities.length}`;
		component.dataset.uid = uid();
		this.entityWrapper.appendChild(node);
		this.entities = Array.from(this.querySelectorAll("entity-wrapper entity-component"));
	};

	private updateOrder: EventListener = () => {
		this.needReset = false;
		this.entities = Array.from(this.querySelectorAll("entity-wrapper entity-component"));
		const orderedEntities = [];
		let invalidParams = false;
		let invalidReason = 0;
		let matchedValue;
		let name1;
		let name2;
		for (let i = 0; i < this.entities.length; i++) {
			// @ts-ignore
			const value = this.entities[i].querySelector(".js-initiation").value;
			if (value === "") {
				invalidParams = true;
				invalidReason = 1;
				break;
			}
			const entity = {
				el: this.entities[i],
				value: parseInt(value),
			};
			if (i === 0) {
				orderedEntities.push(entity);
			} else {
				let injectAt = null;
				for (let k = 0; k < orderedEntities.length; k++) {
					if (entity.value > orderedEntities[k].value) {
						injectAt = k;
						break;
					} else if (entity.value === orderedEntities[k].value) {
						invalidParams = true;
						// @ts-ignore
						name1 = entity.el.querySelector(".js-name").value;
						// @ts-ignore
						name2 = orderedEntities[k].el.querySelector(".js-name").value;
						matchedValue = entity.value;
						invalidReason = 2;
						break;
					}
				}
				if (invalidParams) {
					break;
				}
				if (injectAt === null) {
					orderedEntities.push(entity);
				} else {
					orderedEntities.splice(injectAt, 0, entity);
				}
			}
		}

		if (invalidParams && invalidReason === 1) {
			snackbar({
				message: `Initiation order values cannot be blank.`,
				closeable: true,
				force: true,
			});
			return;
		} else if (invalidParams && invalidReason === 2) {
			snackbar({
				message: `Invalid initation order. ${name1} and ${name2} both rolled a ${matchedValue}`,
				closeable: true,
				force: true,
			});
			return;
		}

		const serverData = [];
		for (let i = 0; i < orderedEntities.length; i++) {
			orderedEntities[i].el.style.order = i;
			serverData.push({
				name: orderedEntities[i].el.querySelector(".js-name").value,
				uid: orderedEntities[i].el.dataset.uid,
			});
		}

		message("server", {
			type: "initiation-order",
			entities: serverData,
		});
	};

	private clearOrder: EventListener = () => {
		message("server", {
			type: "clear-order",
		});
		for (let i = 0; i < this.entities.length; i++) {
			this.entities[i].style.order = "";
			// @ts-ignore
			this.entities[i].querySelector(".js-initiation").value = "";
		}
	};

	connectedCallback() {
		this.querySelector(".js-add-entity").addEventListener("click", this.addEntityComponent);
		this.querySelector(".js-update-initiation-order").addEventListener("click", this.updateOrder);
		this.querySelector(".js-clear-order").addEventListener("click", this.clearOrder);
		message("server", {
			type: "init-combat-order",
		});
	}
}
customElements.define("initiation-component", InitationComponent);
customElements.define("entity-component", EntityComponent);
