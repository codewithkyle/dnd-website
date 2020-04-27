import { env } from "./env.mjs";
import { snackbar } from "./notifyjs.mjs";
import { message } from "./broadcaster.mjs";
class NPCSheet extends HTMLElement {
    constructor() {
        super();
        this.handleSave = (e) => {
            e.preventDefault();
            this.save();
        };
        this.handleKeypress = (e) => {
            if (e instanceof KeyboardEvent) {
                if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    this.save();
                }
            }
        };
        this.form = this.querySelector("form");
        this.isSaving = false;
    }
    async save() {
        var _a;
        if (this.isSaving) {
            return;
        }
        const ticket = env.startLoading();
        this.isSaving = true;
        const data = new FormData(this.form);
        const request = await fetch(`${location.origin}/actions/entries/save-entry`, {
            method: "POST",
            body: data,
            headers: new Headers({
                Accept: "application/json",
            }),
            credentials: "include",
        });
        if (request.ok) {
            const response = await request.json();
            if (!response.success) {
                const error = (response === null || response === void 0 ? void 0 : response.error) || ((_a = response === null || response === void 0 ? void 0 : response.errors) === null || _a === void 0 ? void 0 : _a[0]) || null;
                if (error) {
                    snackbar({
                        message: error,
                        closeable: true,
                        force: true,
                        duration: 3,
                    });
                }
            }
            else {
                snackbar({
                    message: "NPC successfully saved.",
                    closeable: true,
                    force: true,
                    duration: 3,
                });
            }
        }
        else {
            const error = await request.text();
            console.error(error);
            snackbar({
                message: "Failed to save NPC, try again later.",
                closeable: true,
                force: true,
                duration: 3,
            });
        }
        this.isSaving = false;
        env.stopLoading(ticket);
    }
    connectedCallback() {
        this.form.addEventListener("submit", this.handleSave);
        document.addEventListener("keydown", this.handleKeypress);
        document.body.querySelector("#save-button").addEventListener("click", this.handleSave);
        message("server", {
            type: "join",
            name: "Game Master",
            campaign: this.dataset.campaignUid,
        });
    }
}
customElements.define("npc-sheet", NPCSheet);
