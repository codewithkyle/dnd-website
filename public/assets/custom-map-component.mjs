import { message } from "./broadcaster.mjs";
class CustomMap extends HTMLElement {
    constructor() {
        super();
        this.handleClick = () => {
            this.input.focus();
            this.input.click();
        };
        this.handleFile = (e) => {
            const files = this.input.files;
            if (files.length) {
                this.reader.readAsDataURL(files[0]);
            }
        };
        this.handleFileLoad = () => {
            message("server", {
                type: "load-map",
                url: this.reader.result,
            });
        };
        this.reader = null;
        this.input = this.querySelector("input");
    }
    connectedCallback() {
        this.addEventListener("click", this.handleClick);
        this.input.addEventListener("change", this.handleFile);
        this.reader = new FileReader();
        this.reader.addEventListener("load", this.handleFileLoad);
    }
}
customElements.define("custom-map-component", CustomMap);
