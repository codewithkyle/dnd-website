import { message } from "./broadcaster.mjs";
class TipsButton extends HTMLElement {
    constructor() {
        super(...arguments);
        this.toggleTipsDrawer = () => {
            message("tips-drawer", {
                type: "toggle",
            });
        };
    }
    connectedCallback() {
        this.addEventListener("click", this.toggleTipsDrawer);
    }
}
customElements.define("tips-button", TipsButton);
