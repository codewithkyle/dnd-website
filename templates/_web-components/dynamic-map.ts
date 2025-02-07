import { hookup, disconnect, message } from "djinnjs/broadcaster";

type IMouse = {
	x: number;
	y: number;
	prevX: number;
	prevY: number;
	active: boolean;
};

class DynamicMap extends HTMLElement {
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;
	private mouse: IMouse;
	private xyLast: {
		x: number;
		y: number;
	};
	private inboxUid: string;
	private map: string;

	constructor() {
		super();
		this.mouse = { x: 0, y: 0, prevX: 0, prevY: 0, active: false };
		this.xyLast = {
			x: null,
			y: null,
		};
		this.inboxUid = hookup("dynamic-map", this.inbox.bind(this));
		this.map = null;
		window.addEventListener("resize", () => {
			window.location.reload();
		});
	}

	private inbox(data) {
		switch (data.type) {
			case "render":
				const currentDrawing = new Image();
				currentDrawing.src = data.drawing;
				currentDrawing.onload = () => {
					this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
					this.context.drawImage(currentDrawing, 0, 0, currentDrawing.width, currentDrawing.height);
				};
				break;
			case "clear":
				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				break;
			case "init":
				this.init(data.map, data.drawing);
				break;
			default:
				console.warn(`Dynamic Map recieved an undefined message type: ${data.type}`);
				break;
		}
	}

	private handleMouseDown: EventListener = (e: MouseEvent) => {
		this.mouse.active = true;
		const xy = this.getCords(e);
		this.context.beginPath();
		this.context.moveTo(xy.x, xy.y);
		this.xyLast = xy;
	};

	private handleMouseUp: EventListener = (e: MouseEvent) => {
		this.context.stroke();
		this.mouse.active = false;
		message("server", {
			type: "render-drawing",
			drawing: this.canvas.toDataURL(),
		});
	};

	private handleMouseMove: EventListener = (e: MouseEvent) => {
		if (!this.mouse.active) {
			return;
		}
		e.preventDefault();
		e.stopImmediatePropagation();

		const xy = this.getCords(e);
		const xyAdd = {
			x: (this.xyLast.x + xy.x) / 2,
			y: (this.xyLast.y + xy.y) / 2,
		};

		this.context.quadraticCurveTo(this.xyLast.x, this.xyLast.y, xyAdd.x, xyAdd.y);
		this.context.stroke();
		this.context.beginPath();
		this.context.moveTo(xyAdd.x, xyAdd.y);
		this.xyLast = xy;
	};

	private getCords(e) {
		let x, y;

		if (e.changedTouches && e.changedTouches[0]) {
			const offsety = this.canvas.offsetTop;
			const offsetx = this.canvas.offsetTop;

			x = e.changedTouches[0].pageX - offsetx;
			y = e.changedTouches[0].pageY - offsety;
		} else if (e.layerX || 0 == e.layerX) {
			x = e.layerX;
			y = e.layerY;
		} else if (e.offsetX || 0 == e.offsetX) {
			x = e.offsetX;
			y = e.offsetY;
		}

		return {
			x: x,
			y: y,
		};
	}

	disconnectCallback() {
		disconnect(this.inboxUid);
	}

	private init(map, drawing) {
		if (!this.map || this.map !== map) {
			this.canvas = this.querySelector("canvas");
			const bounds = this.getBoundingClientRect();
			this.canvas.width = bounds.width;
			this.canvas.height = bounds.height;
			this.context = this.canvas.getContext("2d");
			this.context.lineWidth = 2;
			this.context.lineCap = "round";
			this.context.strokeStyle = "#ed1313";
			this.canvas.addEventListener("mousedown", this.handleMouseDown);
			this.canvas.addEventListener("mouseup", this.handleMouseUp);
			this.canvas.addEventListener("mousemove", this.handleMouseMove);
			this.map = map;
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			if (drawing) {
				const currentDrawing = new Image();
				currentDrawing.src = drawing;
				currentDrawing.onload = () => {
					this.context.drawImage(currentDrawing, 0, 0, currentDrawing.width, currentDrawing.height);
				};
			}
		}
	}
}
customElements.define("dynamic-map", DynamicMap);
