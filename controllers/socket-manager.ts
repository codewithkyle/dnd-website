import { hookup, reply, message } from "djinnjs/broadcaster";
// @ts-ignore
import io from "socket";
import { DiceRoller } from "rpg-dice-roller";
// @ts-ignore
import { toast } from "notifyjs";

class SocketManager {
	private socket: any;
	private isConnected: boolean;
	private inRoom: boolean;
	private dice: any;
	private rollReplyId: string;

	private time: number;
	private countdown: number;

	constructor() {
		hookup("server", this.inbox.bind(this));
		this.inRoom = false;
		this.rollReplyId = null;
		this.dice = new DiceRoller();

		this.socket = io(`${document.documentElement.dataset.server}:5876`, { secure: true, reconnection: true });
		this.socket.on("connect", () => {
			this.isConnected = true;
			this.time = performance.now();
			this.countdown = 15;
			this.tick();
		});
		this.socket.on("disconnect", () => {
			this.isConnected = false;
		});
		this.socket.on("roll", (results) => {
			reply(this.rollReplyId, {
				type: "roll-results",
				results: results,
			});
		});
		this.socket.on("roll-notificaiton", (data) => {
			let total = 0;
			if (data.results.length > 1) {
				for (let i = 0; i < data.results.length; i++) {
					total += parseInt(data.results[i]);
				}
			}
			toast({
				title: `${data.character} rolled ${data.dice}`,
				message: `Result${total === 0 ? "" : "s"}: ${data.results}${total === 0 ? "" : " = " + total}`,
				closeable: true,
				duration: 6,
				icon: `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="dice-six" class="svg-inline--fa fa-dice-six fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M384 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V96c0-35.35-28.65-64-64-64zM128 384c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm0-96c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm0-96c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm192 192c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm0-96c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm0-96c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"></path></svg>`,
			});
		});
		this.socket.on("ping-player", () => {
			toast({
				title: `Combat Notice`,
				message: "It's your turn for combat, make it count.",
				closeable: true,
				duration: 6,
				icon: `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="swords" class="svg-inline--fa fa-swords fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M309.37 389.38l80-80L93.33 13.33 15.22.14C6.42-1.12-1.12 6.42.14 15.22l13.2 78.11 296.03 296.05zm197.94 72.68L448 402.75l31.64-59.03c3.33-6.22 2.2-13.88-2.79-18.87l-17.54-17.53c-6.25-6.25-16.38-6.25-22.63 0L307.31 436.69c-6.25 6.25-6.25 16.38 0 22.62l17.53 17.54a16 16 0 0 0 18.87 2.79L402.75 448l59.31 59.31c6.25 6.25 16.38 6.25 22.63 0l22.62-22.62c6.25-6.25 6.25-16.38 0-22.63zm-8.64-368.73l13.2-78.11c1.26-8.8-6.29-16.34-15.08-15.08l-78.11 13.2-140.05 140.03 80 80L498.67 93.33zm-345.3 185.3L100 332l-24.69-24.69c-6.25-6.25-16.38-6.25-22.62 0l-17.54 17.53a15.998 15.998 0 0 0-2.79 18.87L64 402.75 4.69 462.06c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L109.25 448l59.03 31.64c6.22 3.33 13.88 2.2 18.87-2.79l17.53-17.54c6.25-6.25 6.25-16.38 0-22.62L180 412l53.37-53.37-80-80z"></path></svg>`,
				classes: ["-green"],
			});
		});
		this.socket.on("on-deck", () => {
			toast({
				title: `On Deck`,
				message: "You're up next in the combat order.",
				closeable: true,
				duration: 6,
			});
		});
		this.socket.on("notify", (data) => {
			toast({
				title: data.title,
				message: data.message,
				closeable: true,
				duration: 6,
			});
		});
		this.socket.on("initiation-order", (order) => {
			message("initiation-order", {
				type: "set-order",
				order: order,
			});
		});
		this.socket.on("clear-order", () => {
			message("initiation-order", {
				type: "clear-order",
			});
		});
		this.socket.on("update-initiation-index", (index) => {
			message("initiation-order", {
				type: "update-initiation-index",
				index: index,
			});
		});
	}

	private inbox(data) {
		switch (data.type) {
			case "clear-order":
				if (this.isConnected && this.inRoom) {
					this.socket.emit("clear-order");
				}
				break;
			case "ping-from-npc":
				if (this.isConnected && this.inRoom) {
					this.socket.emit("ping-from-npc", data.name);
				}
				break;
			case "initiation-order":
				if (this.isConnected && this.inRoom) {
					this.socket.emit("initiation-order", data.entities);
				}
				break;
			case "ping-player":
				if (this.isConnected && this.inRoom) {
					this.socket.emit("ping-player", data.characterUid);
				}
				break;
			case "leave":
				this.socket.emit("leave");
				this.inRoom = false;
				break;
			case "join":
				if (!this.inRoom) {
					this.socket.emit("join", {
						name: data.name,
						roomUid: data.campaign,
						characterUid: data?.characterUid ?? null,
					});
					this.inRoom = true;
				}
				break;
			case "roll-dice":
				this.rollReplyId = data.replyID;
				this.rollDice(data.dice);
				break;
			case "is-online":
				reply(data.replyID, {
					type: "is-online",
					isOnline: this.isConnected,
					inRoom: this.inRoom,
				});
				break;
			default:
				console.warn(`Socket Manager recieved an undefined message type: ${data.type}`);
				break;
		}
	}

	private rollDice(dice: string) {
		setTimeout(() => {
			if (this.isConnected && this.inRoom) {
				this.socket.emit("roll", dice);
			} else {
				// @ts-ignore
				const rolls = this.dice.roll(dice).toString();
				let array = rolls
					.match(/\[.*\]/g)[0]
					.replace(/(\[)|(\])/g, "")
					.split(",");
				if (!Array.isArray(array)) {
					array = [...array];
				}
				reply(this.rollReplyId, {
					type: "roll-results",
					results: array,
				});
			}
		}, this.getRandomInt(600, 1300));
	}

	private getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}

	private tick() {
		const newTime = performance.now();
		const deltaTime = (newTime - this.time) / 1000;
		this.time = newTime;

		this.countdown -= deltaTime;
		if (this.countdown <= 0) {
			if (this.isConnected) {
				this.socket.emit("heartbeat");
			}
			this.countdown = 15;
		}

		window.requestAnimationFrame(this.tick.bind(this));
	}
}
new SocketManager();
