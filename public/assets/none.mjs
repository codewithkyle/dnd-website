export function none(selector, newHTML, target) {
    return new Promise(resolve => {
        var _a, _b;
        let behavior = "auto";
        if (target) {
            const desiredBehavior = (_b = (_a = target
                .getAttribute("scroll")) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.trim();
            if (desiredBehavior === "auto" || desiredBehavior === "smooth" || desiredBehavior === "none") {
                behavior = desiredBehavior;
            }
        }
        if (behavior !== "none") {
            window.scroll({
                top: 0,
                left: 0,
                behavior: behavior,
            });
        }
        const view = document.body.querySelector(selector);
        view.innerHTML = newHTML;
        resolve();
    });
}
