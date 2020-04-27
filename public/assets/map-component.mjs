import { message } from "./broadcaster.mjs";
class MapComponent extends HTMLElement {
    constructor() {
        super(...arguments);
        this.handleClick = () => {
            message("server", {
                type: "load-map",
                url: this.dataset.url,
            });
        };
    }
    connectedCallback() {
        this.addEventListener("click", this.handleClick);
    }
}
customElements.define("map-component", MapComponent);
