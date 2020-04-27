import { hookup } from "./broadcaster.mjs";
class TipsDrawer extends HTMLElement {
    constructor() {
        super();
        this.closeDrawer = () => {
            this.isOpen = false;
            this.update();
        };
        this.handleKey = (e) => {
            if (e instanceof KeyboardEvent) {
                if (e.key.toLowerCase() === "escape") {
                    this.isOpen = false;
                    this.update();
                }
            }
        };
        hookup("tips-drawer", this.inbox.bind(this));
    }
    inbox(data) {
        switch (data.type) {
            case "toggle":
                this.isOpen = this.isOpen ? false : true;
                this.update();
                break;
            default:
                break;
        }
    }
    update() {
        if (this.isOpen) {
            this.classList.add("is-open");
        }
        else {
            this.classList.remove("is-open");
        }
    }
    connectedCallback() {
        this.querySelector("close-button").addEventListener("click", this.closeDrawer);
        document.body.addEventListener("keyup", this.handleKey);
    }
}
customElements.define("tips-drawer", TipsDrawer);
