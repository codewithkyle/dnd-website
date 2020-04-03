class PurgeOldCharacters extends HTMLElement {
	private purge: EventListener = async () => {
		const request = await fetch(`${location.origin}/actions/dnd-module/default/remove-old-characters`, {
			method: "POST",
			credentials: "include",
			headers: new Headers({
				accept: "application/json",
				"content-type": "application/json",
			}),
			body: `{
                "CRAFT_CSRF_TOKEN": "${document.documentElement.dataset.csrf}"
            }`,
		});

		const response = await request.json();

		if (request.ok) {
			if (response.success) {
				location.reload();
			}
		} else {
			console.log(response);
		}
	};
	connectedCallback() {
		this.addEventListener("click", this.purge);
	}
}
customElements.define("purge-old-characters", PurgeOldCharacters);
