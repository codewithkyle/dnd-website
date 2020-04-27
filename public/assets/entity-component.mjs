import { message } from "./broadcaster.mjs";
export class EntityComponent extends HTMLElement {
    constructor() {
        super();
        this.removeEntity = () => {
            this.remove();
        };
        this.ping = () => {
            message("server", {
                type: "combat-order-update",
                uid: this.dataset.uid,
            });
        };
        this.nameInput = this.querySelector(".js-name");
        this.initiationInput = this.querySelector(".js-initiation");
    }
    connectedCallback() {
        const removeButton = this.querySelector(".js-remove");
        const pingButton = this.querySelector(".js-ping");
        if (removeButton) {
            removeButton.addEventListener("click", this.removeEntity);
        }
        if (pingButton) {
            pingButton.addEventListener("click", this.ping);
        }
    }
}
