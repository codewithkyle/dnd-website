import { message } from "./broadcaster.mjs";
class CampaignComponent extends HTMLElement {
    connectedCallback() {
        message("server", {
            type: "join",
            name: "Game Master",
            campaign: this.dataset.campaignUid,
        });
    }
}
customElements.define("campaign-component", CampaignComponent);
