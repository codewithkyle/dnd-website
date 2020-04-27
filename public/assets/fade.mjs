export function fade(selector, newHTML, target) {
    return new Promise(resolve => {
        var _a, _b, _c;
        /** Transition reset */
        const main = document.body.querySelector(selector);
        main.style.transition = "all 0ms 0ms linear";
        main.style.opacity = "1";
        const transition = {
            scroll: "auto",
            duration: 450,
        };
        if (target) {
            const scrollBehavior = (_b = (_a = target
                .getAttribute("scroll")) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.trim();
            if (scrollBehavior === "auto" || scrollBehavior === "smooth" || scrollBehavior === "none") {
                transition.scroll = scrollBehavior;
            }
            const desiredDuration = (_c = target.getAttribute("duration")) === null || _c === void 0 ? void 0 : _c.trim();
            // @ts-ignore
            if (!isNaN(desiredDuration)) {
                transition.duration = parseInt(desiredDuration);
            }
        }
        setTimeout(() => {
            /** Transition */
            main.style.transition = `opacity ${transition.duration / 2}ms ease-out`;
            main.style.opacity = "0";
            setTimeout(() => {
                main.innerHTML = newHTML;
                if (transition.scroll !== "none") {
                    window.scroll({
                        top: 0,
                        left: 0,
                        behavior: transition.scroll,
                    });
                }
                main.style.transition = `opacity ${transition.duration / 2}ms ease-in`;
                main.style.opacity = "1";
                resolve();
            }, transition.duration / 2 + 15);
        }, 15);
    });
}
