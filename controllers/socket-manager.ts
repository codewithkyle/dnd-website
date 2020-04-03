import { hookup, reply } from "djinnjs/broadcaster";
// @ts-ignore
import io from "socket";
import { DiceRoller } from "rpg-dice-roller";

class SocketManager {
	private socket: any;
	private isConnected: boolean;
	private inRoom: boolean;
	private dice: any;
	private rollReplyId: string;

	constructor() {
		hookup("server", this.inbox.bind(this));
		this.inRoom = false;
		this.rollReplyId = null;
		this.dice = new DiceRoller();

		this.socket = io(`http://${document.documentElement.dataset.server}:5876`);
		this.socket.on("connect", () => {
			this.isConnected = true;
		});
		this.socket.on("disconnect", () => {
			this.isConnected = false;
		});
		this.socket.on("roll", (result) => {
			reply(this.rollReplyId, {
				type: "roll-results",
				results: result,
			});
		});
	}

	private inbox(data) {
		switch (data.type) {
			case "leave":
				this.socket.emit("leave");
				this.inRoom = false;
				break;
			case "join":
				this.socket.emit("join", {
					name: data.name,
					roomUid: data.campaign,
				});
				this.inRoom = true;
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
}
new SocketManager();
