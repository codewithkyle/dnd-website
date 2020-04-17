class NotificationManager {
    constructor() {
        this.handleCloseClickEvent = this.removeNotification.bind(this);
        this.handleActionButtonClick = this.activateButton.bind(this);
        this.snackbar = this.notify;
        this.handleToastClose = (e) => {
            const target = e.currentTarget;
            const notificationId = target.parentElement.dataset.id;
            let index = null;
            for (let i = 0; i < this.toaster.length; i++) {
                if (this.toaster[i].element.dataset.id === notificationId) {
                    index = i;
                    break;
                }
            }
            if (index) {
                this.removeToasterNotification(index);
            }
        };
        this._queue = [];
        this._callback = () => { };
        this._time = 0;
        this.toaster = [];
        this.startCallback();
    }
    activateButton(e) {
        const buttonEl = e.currentTarget;
        const button = this._queue[0].buttons[parseInt(buttonEl.dataset.index)];
        button.callback();
        this.removeNotification();
    }
    createNotification(notification) {
        var _a, _b, _c;
        const el = document.createElement("snackbar-component");
        el.setAttribute("position", notification.position);
        for (let i = 0; i < ((_a = notification === null || notification === void 0 ? void 0 : notification.classes) === null || _a === void 0 ? void 0 : _a.length); i++) {
            el.classList.add(notification.classes[i]);
        }
        const message = document.createElement("p");
        message.innerText = notification === null || notification === void 0 ? void 0 : notification.message;
        el.appendChild(message);
        if ((notification === null || notification === void 0 ? void 0 : notification.closeable) || ((_b = notification === null || notification === void 0 ? void 0 : notification.buttons) === null || _b === void 0 ? void 0 : _b.length)) {
            const actionsWrapper = document.createElement("snackbar-actions");
            if ((_c = notification === null || notification === void 0 ? void 0 : notification.buttons) === null || _c === void 0 ? void 0 : _c.length) {
                for (let i = 0; i < notification.buttons.length; i++) {
                    const button = document.createElement("button");
                    button.innerText = notification.buttons[i].label;
                    button.dataset.index = `${i}`;
                    for (let k = 0; k < notification.buttons[i].classes.length; k++) {
                        button.classList.add(notification.buttons[i].classes[k]);
                    }
                    if (notification.buttons[i].ariaLabel) {
                        button.setAttribute("aria-label", notification.buttons[i].ariaLabel);
                    }
                    button.addEventListener("click", this.handleActionButtonClick);
                    actionsWrapper.appendChild(button);
                }
            }
            if (notification === null || notification === void 0 ? void 0 : notification.closeable) {
                const closeButton = document.createElement("close-button");
                closeButton.setAttribute("aria-label", "close notification");
                closeButton.setAttribute("aria-pressed", "false");
                closeButton.setAttribute("role", "button");
                closeButton.innerHTML =
                    '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="times" class="svg-inline--fa fa-times fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>';
                closeButton.addEventListener("click", this.handleCloseClickEvent);
                actionsWrapper.appendChild(closeButton);
            }
            el.appendChild(actionsWrapper);
        }
        document.body.appendChild(el);
        notification.element = el;
    }
    removeNotification() {
        this._queue[0].element.remove();
        this._queue.splice(0, 1);
        if (this._queue.length !== 0) {
            this.createNotification(this._queue[0]);
        }
    }
    startCallback() {
        this._callback = this.animationFrameCallback.bind(this);
        this._time = performance.now();
        this._callback();
        if (this._queue.length) {
            this.createNotification(this._queue[0]);
        }
    }
    animationFrameCallback() {
        const newTime = performance.now();
        const deltaTime = (newTime - this._time) / 1000;
        this._time = newTime;
        if (document.hasFocus()) {
            if (this._queue.length) {
                if (this._queue[0].duration !== Infinity) {
                    this._queue[0].duration -= deltaTime;
                    if (this._queue[0].duration <= 0) {
                        this.removeNotification();
                    }
                }
            }
            if (this.toaster.length) {
                for (let i = 0; i < this.toaster.length; i++) {
                    this.toaster[i].duration -= deltaTime;
                    if (this.toaster[i].duration <= 0) {
                        this.removeToasterNotification(i);
                    }
                }
            }
        }
        window.requestAnimationFrame(() => {
            this._callback();
        });
    }
    validateNotification(notification) {
        return new Promise((resolve, reject) => {
            const newNotification = {};
            let warnings = [];
            if (notification.element) {
                reject("Notifications create their own HTMLElement, do not provide one.");
            }
            if (!notification.message) {
                reject("Notifications require a message.");
            }
            else {
                newNotification.message = notification.message;
            }
            if (notification.closeable) {
                newNotification.closeable = notification.closeable;
            }
            else {
                newNotification.closeable = false;
            }
            if (notification.duration) {
                newNotification.duration = notification.duration;
                if (notification.duration === Infinity && newNotification.closeable) {
                    newNotification.duration = Infinity;
                }
            }
            else {
                newNotification.duration = 10;
            }
            if (notification.position) {
                warnings.push("The position property is deprecated");
                if (notification.position.match("top")) {
                    newNotification.position = "top";
                }
                else if (notification.position.match("bottom")) {
                    newNotification.position = "bottom";
                }
                else {
                    newNotification.position = "bottom";
                }
                if (notification.position.match("left")) {
                    newNotification.position += " left";
                }
                else if (notification.position.match("right")) {
                    newNotification.position += " right";
                }
                else if (notification.position.match("center")) {
                    newNotification.position += " center";
                }
                else {
                    newNotification.position += " center";
                }
            }
            else {
                newNotification.position = "bottom center";
            }
            if (notification.position) {
                warnings.push("The position property is deprecated");
                if (notification.position.match("top")) {
                    newNotification.position = "top";
                }
                else if (notification.position.match("bottom")) {
                    newNotification.position = "bottom";
                }
                else {
                    newNotification.position = "bottom";
                }
                if (notification.position.match("left")) {
                    newNotification.position += " left";
                }
                else if (notification.position.match("right")) {
                    newNotification.position += " right";
                }
                else if (notification.position.match("center")) {
                    newNotification.position += " center";
                }
                else {
                    newNotification.position += " center";
                }
            }
            else {
                newNotification.position = "bottom center";
            }
            if (notification.buttons) {
                const buttons = [];
                for (let i = 0; i < notification.buttons.length; i++) {
                    const button = {};
                    const newWarnings = [];
                    if (notification.buttons[i].label) {
                        button.label = notification.buttons[i].label;
                    }
                    else {
                        newWarnings.push("Buttons require a label.");
                    }
                    if (notification.buttons[i].callback) {
                        if (typeof notification.buttons[i].callback === "function") {
                            button.callback = notification.buttons[i].callback;
                        }
                        else {
                            newWarnings.push("Buttons callbacks must be a function.");
                        }
                    }
                    else {
                        newWarnings.push("Buttons require a callback function.");
                    }
                    if (notification.buttons[i].ariaLabel) {
                        button.ariaLabel = notification.buttons[i].ariaLabel;
                    }
                    if (notification.buttons[i].classes) {
                        if (typeof notification.buttons[i].classes === "string") {
                            button.classes = [notification.buttons[i].classes];
                        }
                        else if (Array.isArray(notification.buttons[i].classes)) {
                            button.classes = notification.buttons[i].classes;
                        }
                        else {
                            reject("Notification classes must be a string or an array of strings.");
                        }
                    }
                    else {
                        button.classes = [];
                    }
                    warnings = [...warnings, ...newWarnings];
                    if (newWarnings.length === 0) {
                        buttons.push(button);
                    }
                }
                if (buttons.length) {
                    newNotification.buttons = buttons;
                }
            }
            else {
                newNotification.buttons = [];
            }
            if (notification.force) {
                newNotification.force = notification.force;
            }
            else {
                newNotification.force = false;
            }
            if (notification === null || notification === void 0 ? void 0 : notification.classes) {
                if (typeof notification.classes === "string") {
                    newNotification.classes = [notification.classes];
                }
                else if (Array.isArray(notification.classes)) {
                    newNotification.classes = notification.classes;
                }
                else {
                    reject("Notification classes must be a string or an array of strings.");
                }
            }
            else {
                newNotification.classes = [];
            }
            resolve({ validNotification: newNotification, warnings: warnings });
        });
    }
    notify(notification) {
        this.validateNotification(notification)
            .then((response) => {
            if (this._queue.length === 0 || !response.validNotification.force) {
                this._queue.push(response.validNotification);
                if (this._queue.length === 1) {
                    this.createNotification(this._queue[0]);
                }
            }
            else if (this._queue.length > 0 && response.validNotification.force) {
                this._queue.splice(1, 0, response.validNotification);
                this.removeNotification();
            }
            if (response.warnings.length !== 0) {
                for (let i = 0; i < response.warnings.length; i++) {
                    console.warn(`NotifyJS: ${response.warnings[i]}`);
                }
            }
        })
            .catch((error) => {
            console.error(error);
        });
    }
    removeToasterNotification(index) {
        this.toaster[index].element.remove();
        this.toaster.splice(index, 1);
    }
    createToast(notification) {
        var _a;
        const el = document.createElement("toast-component");
        for (let i = 0; i < ((_a = notification === null || notification === void 0 ? void 0 : notification.classes) === null || _a === void 0 ? void 0 : _a.length); i++) {
            el.classList.add(notification.classes[i]);
        }
        if (notification === null || notification === void 0 ? void 0 : notification.icon) {
            const icon = document.createElement("i");
            icon.innerHTML = notification.icon;
            el.appendChild(icon);
        }
        const copyWrapper = document.createElement("copy-wrapper");
        const title = document.createElement("h3");
        title.innerText = notification === null || notification === void 0 ? void 0 : notification.title;
        copyWrapper.appendChild(title);
        const message = document.createElement("p");
        message.innerText = notification === null || notification === void 0 ? void 0 : notification.message;
        copyWrapper.appendChild(message);
        el.appendChild(copyWrapper);
        if (notification === null || notification === void 0 ? void 0 : notification.closeable) {
            const closeButton = document.createElement("button");
            closeButton.setAttribute("aria-label", "close notification");
            closeButton.innerHTML =
                '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="times" class="svg-inline--fa fa-times fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>';
            closeButton.addEventListener("click", this.handleToastClose);
            el.appendChild(closeButton);
        }
        return el;
    }
    toast(notification) {
        let shell = document.body.querySelector("toaster-component") || null;
        if (!shell) {
            shell = document.createElement("toaster-component");
            document.body.appendChild(shell);
        }
        const notificationEl = this.createToast(notification);
        notificationEl.dataset.id = `${performance.now()}`;
        notification.element = notificationEl;
        if ((notification === null || notification === void 0 ? void 0 : notification.duration) && !isNaN(notification.duration)) {
            notification.duration = notification.duration;
        }
        else {
            notification.duration = 4;
        }
        this.toaster.push(notification);
        shell.appendChild(notificationEl);
    }
}

const globalManager = new NotificationManager();
const notify = globalManager.notify.bind(globalManager);
const snackbar = globalManager.snackbar.bind(globalManager);
const toast = globalManager.toast.bind(globalManager);

export { NotificationManager, notify, snackbar, toast };
