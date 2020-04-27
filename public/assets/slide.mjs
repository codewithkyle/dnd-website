export function slide(selector, newHTML, target) {
    return new Promise(resolve => {
        var _a, _b, _c, _d;
        const transition = {
            scroll: "auto",
            direction: 1,
        };
        if (target) {
            const scrollBehavior = (_b = (_a = target
                .getAttribute("scroll")) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.trim();
            if (scrollBehavior === "auto" || scrollBehavior === "smooth" || scrollBehavior === "none") {
                transition.scroll = scrollBehavior;
            }
            const targetDirection = (_d = (_c = target
                .getAttribute("direction")) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === null || _d === void 0 ? void 0 : _d.trim();
            if (targetDirection === "right") {
                transition.direction = 1;
            }
            else if (targetDirection === "left") {
                transition.direction = -1;
            }
        }
        if (transition.scroll !== "none") {
            window.scroll({
                top: 0,
                left: 0,
                behavior: transition.scroll,
            });
        }
        /** Prepare for update */
        const currentMain = document.body.querySelector(selector);
        const newMain = document.createElement(selector);
        newMain.innerHTML = newHTML;
        newMain.dataset.id = currentMain.dataset.id;
        newMain.style.transform = `translateX(${100 * -transition.direction}vw)`;
        currentMain.before(newMain);
        /** Transition reset */
        currentMain.style.transform = "translateX(0)";
        currentMain.style.opacity = "1";
        currentMain.style.position = "absolute";
        currentMain.style.top = "0";
        currentMain.style.left = "0";
        currentMain.style.width = "100vw";
        setTimeout(() => {
            /** Transition */
            currentMain.style.transition = "transform 600ms ease-in-out";
            currentMain.style.transform = `translateX(${100 * transition.direction}vw)`;
            newMain.style.transition = "transform 600ms ease-in-out";
            newMain.style.transform = "translateX(0)";
            setTimeout(() => {
                currentMain.remove();
                resolve();
            }, 615);
        }, 15);
    });
}
