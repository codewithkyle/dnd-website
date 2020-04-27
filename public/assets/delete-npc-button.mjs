import { env } from "./env.mjs";
import { snackbar } from "./notifyjs.mjs";
class DeleteNPCButton extends HTMLElement {
    constructor() {
        super();
        this.delete = async () => {
            var _a;
            if (this.isDeleting) {
                return;
            }
            const ticket = env.startLoading();
            this.isDeleting = true;
            const data = {
                CRAFT_CSRF_TOKEN: document.documentElement.dataset.csrf,
                entryId: this.dataset.entryId,
            };
            const request = await fetch(`${location.origin}/actions/entries/delete-entry`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: new Headers({
                    Accept: "application/json",
                    "Content-Type": "application/json",
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
                    this.isDeleting = false;
                    env.stopLoading(ticket);
                }
                else {
                    location.href = `${location.origin}/campaign/${this.dataset.campaignUid}`;
                }
            }
            else {
                const error = await request.text();
                console.error(error);
                snackbar({
                    message: "Failed to delete NPC, try again later.",
                    closeable: true,
                    force: true,
                    duration: 3,
                });
                this.isDeleting = false;
                env.stopLoading(ticket);
            }
        };
        this.isDeleting = false;
    }
    connectedCallback() {
        this.addEventListener("click", this.delete);
    }
}
customElements.define("delete-npc-button", DeleteNPCButton);
