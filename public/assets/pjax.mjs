import { hookup, message } from "./broadcaster.mjs";
import { debug, env, uuid } from "./env.mjs";
import { sendPageView, setupGoogleAnalytics } from "./gtags.mjs";
import { transitionManager } from "./transition-manager.mjs";
import { djinnjsOutDir, gaId, disablePrefetching, disableServiceWorker, followRedirects } from "./config.mjs";
import { notify } from "./notifications.mjs";
import { fetchCSS } from "./fetch.mjs";
class Pjax {
    constructor() {
        this.windowPopstateEvent = this.hijackPopstate.bind(this);
        this.handleLinkClick = this.hijackRequest.bind(this);
        this.handleIntersection = this.prefetchLink.bind(this);
        this.state = {
            activeRequestUid: null,
        };
        this.worker = null;
        this.serviceWorker = null;
        this.navigationRequestQueue = [];
        this.io = new IntersectionObserver(this.handleIntersection);
        this.init();
    }
    /**
     * Initializes the Pjax class.
     */
    init() {
        /** Prepare our reload prompt tracking for the session */
        if (!sessionStorage.getItem("prompts")) {
            sessionStorage.setItem("prompts", "0");
        }
        if (!localStorage.getItem("contentCache")) {
            localStorage.setItem("contentCache", `${Date.now()}`);
        }
        /** Hookup Pjax's inbox */
        hookup("pjax", this.inbox.bind(this));
        /** Prepare Google Analytics */
        setupGoogleAnalytics(gaId);
        /** Prepare the Pjax Web Worker */
        this.worker = new Worker(`${window.location.origin}/${djinnjsOutDir}/pjax-worker.mjs`);
        this.worker.onmessage = this.handleWorkerMessage.bind(this);
        /** Attempt to register a service worker */
        if ("serviceWorker" in navigator && !disableServiceWorker) {
            navigator.serviceWorker
                .register(`${window.location.origin}/service-worker.js`, { scope: "/" })
                .then(() => {
                /** Verify the service worker was registered correctly */
                if (navigator.serviceWorker.controller) {
                    this.serviceWorker = navigator.serviceWorker.controller;
                    navigator.serviceWorker.onmessage = this.handleServiceWorkerMessage.bind(this);
                    /** Tell the service worker to get the latest cachebust data */
                    this.serviceWorker.postMessage({
                        type: "cachebust",
                        url: window.location.href,
                    });
                    /** Tell Pjax to check if the current page is stale */
                    message("pjax", { type: "revision-check" });
                }
            })
                .catch(error => {
                if (debug) {
                    console.error("Registration failed with " + error);
                }
            });
        }
        /** Add event listeners */
        window.addEventListener("popstate", this.windowPopstateEvent);
        /** Update the history state with the required `state.url` value */
        window.history.replaceState({ url: window.location.href }, document.title, window.location.href);
        fetchCSS("pjax-notification");
    }
    /**
     * The public inbox for the Pjax class. All incoming messages sent through the `Broadcaster` will be received here.
     * @param data - the `MessageData` passed into the inbox by the `Broadcaster` class
     */
    inbox(data) {
        const { type } = data;
        switch (type) {
            case "revision-check":
                this.checkPageRevision();
                break;
            case "hijack-links":
                this.collectLinks();
                break;
            case "load":
                this.navigate(data.url, data === null || data === void 0 ? void 0 : data.transition, data === null || data === void 0 ? void 0 : data.transitionData, data === null || data === void 0 ? void 0 : data.history, data === null || data === void 0 ? void 0 : data.selector, data === null || data === void 0 ? void 0 : data.navRequestId);
                break;
            case "finalize-pjax":
                this.updateHistory(data.title, data.url, data.history);
                if (new RegExp("#").test(data.url)) {
                    this.scrollToHash(data.url);
                }
                this.collectLinks();
                this.checkPageRevision();
                sendPageView(window.location.pathname, gaId);
                if (!disablePrefetching) {
                    this.prefetchLinks();
                }
                message("pjax", {
                    type: "completed",
                });
                break;
            case "css-ready":
                this.swapPjaxContent(data.requestUid);
                break;
            case "prefetch":
                if (!disablePrefetching) {
                    this.prefetchLinks();
                }
                break;
            case "init":
                /** Tell Pjax to hijack all viable links */
                message("pjax", { type: "hijack-links" });
                /** Tell Pjax to prefetch links */
                message("pjax", {
                    type: "prefetch",
                });
                break;
            default:
                return;
        }
    }
    /**
     * Handles messages from the Service Worker.
     * @param e - the `MessageEvent` object
     */
    handleServiceWorkerMessage(e) {
        const { type } = e.data;
        switch (type) {
            case "page-refresh":
                let promptCount = parseInt(sessionStorage.getItem("prompts"));
                promptCount = promptCount + 1;
                sessionStorage.setItem("prompts", `${promptCount}`);
                notify({
                    message: "A new version of this page is available.",
                    closeable: true,
                    force: true,
                    duration: Infinity,
                    buttons: [
                        {
                            label: "Reload",
                            callback: () => {
                                window.location.reload();
                            },
                        },
                    ],
                });
                break;
            case "cachebust":
                sessionStorage.setItem("maxPrompts", `${e.data.max}`);
                const currentPromptCount = sessionStorage.getItem("prompts");
                if (parseInt(currentPromptCount) >= e.data.max) {
                    sessionStorage.setItem("prompts", "0");
                    this.serviceWorker.postMessage({
                        type: "clear-content-cache",
                    });
                }
                const contentCacheTimestap = parseInt(localStorage.getItem("contentCache"));
                const difference = Date.now() - contentCacheTimestap;
                const neededDifference = e.data.contentCacheExpires * 24 * 60 * 60 * 1000;
                if (difference >= neededDifference) {
                    localStorage.setItem("contentCache", `${Date.now()}`);
                    this.serviceWorker.postMessage({
                        type: "clear-content-cache",
                    });
                }
                break;
            default:
                if (debug) {
                    console.error(`Undefined Service Worker response message type: ${type}`);
                }
                break;
        }
    }
    /**
     * Handles messages from the Pjax Web Worker.
     * @param e - the `MessageEvent` object
     */
    handleWorkerMessage(e) {
        var _a, _b;
        const { type } = e.data;
        switch (type) {
            case "revision-check":
                if (e.data.status === "stale") {
                    this.serviceWorker.postMessage({
                        type: "page-refresh",
                        url: e.data.url,
                        network: env.connection,
                    });
                }
                break;
            case "pjax":
                this.handlePjaxResponse(e.data.requestId, e.data.status, e.data.url, (_a = e.data) === null || _a === void 0 ? void 0 : _a.body, (_b = e.data) === null || _b === void 0 ? void 0 : _b.error);
                break;
            default:
                if (debug) {
                    console.error(`Undefined Pjax Worker response message type: ${type}`);
                }
                break;
        }
    }
    scrollToHash(url) {
        const hash = url.match(/\#.*/)[0];
        const element = document.body.querySelector(hash);
        if (element) {
            element.scrollIntoView();
            return;
        }
    }
    /**
     * Creates and sends a navigation request to the Pjax web worker and queues navigation request.
     * @param url - the URL of the requested page
     * @param transition - the name of the desired transition effect
     * @param transitionData - optional data that could modify the transition
     * @param history - how Pjax should handle the windows history manipulation
     * @param selector - the `pjax-id` attribute value
     */
    navigate(url, transition = null, transitionData = null, history = "push", selector = null, navRequestId = null) {
        env.startPageTransition();
        const requestUid = navRequestId || uuid();
        this.state.activeRequestUid = requestUid;
        const navigationRequest = {
            url: url,
            history: history,
            requestUid: requestUid,
            transition: transition,
            transitionData: transitionData,
            target: document.body.querySelector(`[navigation-request-id="${requestUid}"]`) || null,
            targetSelector: selector,
        };
        this.navigationRequestQueue.push(navigationRequest);
        this.worker.postMessage({
            type: "pjax",
            requestId: requestUid,
            url: url,
            currentUrl: location.href,
            followRedirects: followRedirects,
        });
    }
    /**
     * Handles the windows `popstate` event.
     * @param e - the `PopStateEvent` object
     */
    hijackPopstate(e) {
        var _a;
        /** Only hijack the event when the `history.state` object contains a URL */
        if ((_a = e.state) === null || _a === void 0 ? void 0 : _a.url) {
            /** Tells the Pjax class to load the URL stored in this windows history.
             * In order to preserve the timeline navigation the history will use `replace` instead of `push`.
             */
            message("pjax", {
                type: "load",
                url: e.state.url,
                history: "replace",
            });
        }
    }
    /**
     * Handles history manipulation by replacing or pushing the new state into the windows history timeline.
     * @param title - the new document title
     * @param url - the new pages URL
     * @param history - how the window history should be manipulated
     */
    updateHistory(title, url, history) {
        if (history === "replace") {
            window.history.replaceState({
                url: url,
            }, title, url);
        }
        else {
            window.history.pushState({
                url: url,
            }, title, url);
        }
    }
    /**
     * Called when the `click` event fires on a Pjax tracked anchor element.
     * @param e - click `Event`
     */
    hijackRequest(e) {
        e.preventDefault();
        const target = e.currentTarget;
        const navigationUid = uuid();
        target.setAttribute("navigation-request-id", navigationUid);
        /** Tell Pjax to load the clicked elements page */
        message("pjax", {
            type: "load",
            url: target.href,
            transition: target.getAttribute("pjax-transition"),
            transitionData: target.getAttribute("pjax-transition-data"),
            selector: target.getAttribute("pjax-view-id"),
            navRequestId: navigationUid,
        });
    }
    /**
     * Collect all anchor elements with a `href` attribute and add a click event listener.
     * Ignored links are:
     * - any link with a `no-pjax` attribute
     * - any link with a `no-pjax` class
     * - any link with a `target` attribute
     */
    collectLinks() {
        const unregisteredLinks = Array.from(document.body.querySelectorAll("a[href]:not([pjax-tracked]):not([no-pjax]):not([target]):not(.no-pjax)"));
        if (unregisteredLinks.length) {
            unregisteredLinks.map((link) => {
                link.setAttribute("pjax-tracked", "true");
                link.addEventListener("click", this.handleLinkClick);
            });
        }
    }
    /**
     * Handles the Pjax response from the web worker.
     * This method will update the `NavigationRequest` object and continue with the transition or will remove the stale request or will fallback to traditional (native) page navigaiton when an error occurs.
     * @param requestId - the navigation request's unique ID
     * @param status - the response status of the request
     * @param url - the requested URL
     * @param body - the body text of the requested page
     * @param error - the error message of the failed request
     */
    handlePjaxResponse(requestId, status, url, body, error) {
        const request = this.getNavigaitonRequest(requestId);
        if (requestId === this.state.activeRequestUid) {
            if (status === "external") {
                window.location.href = url;
            }
            else if (status === "hash-change") {
                location.hash = url.match(/\#.*/g)[0].replace("#", "");
            }
            else if (status === "ok") {
                const tempDocument = document.implementation.createHTMLDocument("pjax-temp-document");
                tempDocument.documentElement.innerHTML = body;
                let selector;
                let currentMain;
                if (request.targetSelector !== null) {
                    selector = `[pjax-id="${request.targetSelector}"]`;
                    currentMain = document.body.querySelector(selector);
                }
                else {
                    selector = "main";
                    currentMain = document.body.querySelector(selector);
                    const mainId = currentMain.getAttribute("pjax-id");
                    if (mainId) {
                        selector = `[pjax-id="${mainId}"]`;
                    }
                }
                const incomingMain = tempDocument.querySelector(selector);
                if (incomingMain && currentMain) {
                    /** Tells the runtime class to parse the incoming HTML for any new CSS files */
                    message("runtime", {
                        type: "parse",
                        body: incomingMain.innerHTML,
                        requestUid: requestId,
                    });
                    request.body = incomingMain.innerHTML;
                    request.title = tempDocument.title;
                }
                else {
                    console.error("Failed to find matching elements.");
                    window.location.href = url;
                }
            }
            else {
                console.error(`Failed to fetch page: ${url}. Server responded with: ${error}`);
                window.location.href = url;
            }
        }
        else {
            this.removeNavigationRequest(request.requestUid);
            if (status !== "ok") {
                console.error(`Failed to fetch page: ${url}. Server responded with: ${error}`);
            }
        }
    }
    /**
     * Swaps the main elements inner HTML.
     * @param requestUid - the navigation request unique id
     */
    swapPjaxContent(requestUid) {
        const request = this.getNavigaitonRequest(requestUid);
        if (request.requestUid === this.state.activeRequestUid) {
            env.endPageTransition();
            let selector;
            if (request.targetSelector !== null) {
                selector = `[pjax-id="${request.targetSelector}"]`;
            }
            else {
                selector = "main";
            }
            transitionManager(selector, request.body, request.transition, request.target).then(() => {
                document.title = request.title;
                message("pjax", {
                    type: "finalize-pjax",
                    url: request.url,
                    title: request.title,
                    history: request.history,
                });
                message("runtime", {
                    type: "mount-components",
                });
                message("runtime", {
                    type: "mount-inline-scripts",
                    selector: selector,
                });
            });
        }
        this.removeNavigationRequest(request.requestUid);
    }
    /**
     * Removes the `NavigationRequest` object from the queue.
     * @param requestId - the unique ID of the `NavigationRequest` object
     */
    removeNavigationRequest(requestId) {
        for (let i = 0; i < this.navigationRequestQueue.length; i++) {
            if (this.navigationRequestQueue[i].requestUid === requestId) {
                this.navigationRequestQueue.splice(i, 1);
                break;
            }
        }
    }
    /**
     * Gets the `NavigationRequest` object from the queue.
     * @param requestId - the unique ID of the `NavigationRequest` object
     */
    getNavigaitonRequest(requestId) {
        for (let i = 0; i < this.navigationRequestQueue.length; i++) {
            if (this.navigationRequestQueue[i].requestUid === requestId) {
                return this.navigationRequestQueue[i];
            }
        }
        return null;
    }
    /**
     * Sends a `revision-check` message to the Pjax web worker.
     */
    checkPageRevision() {
        this.worker.postMessage({
            type: "revision-check",
            url: window.location.href,
        });
    }
    /** Collect primary navigation links and tell the Pjax web worker to prefetch the pages. */
    prefetchLinks() {
        /** Require a service worker & at least a 3g connection & respect the users data saver setting */
        if (env.connection === "2g" || env.connection === "slow-2g" || !("serviceWorker" in navigator) || env.dataSaver) {
            return;
        }
        const urls = [];
        /** Header links */
        const headerLinks = Array.from(document.body.querySelectorAll("header a[href]:not([target]):not([pjax-prefetched]):not(prevent-pjax):not(no-transition)"));
        headerLinks.map((link) => {
            link.setAttribute("pjax-prefetched", "true");
            urls.push(link.href);
        });
        /** All other navigation links */
        const navLinks = Array.from(document.body.querySelectorAll("nav a[href]:not([target]):not([pjax-prefetched]):not(prevent-pjax):not(no-transition)"));
        navLinks.map((link) => {
            link.setAttribute("pjax-prefetched", "true");
            urls.push(link.href);
        });
        /** Send the requested URLs to the Pjax web worker */
        this.worker.postMessage({
            type: "prefetch",
            urls: urls,
        });
        /** Require at least a 4g connection while respecting the users data  */
        if (env.connection === "3g") {
            return;
        }
        const allLinks = Array.from(document.body.querySelectorAll("a[href]:not([target]):not([pjax-prefetched]):not(prevent-pjax):not(no-transition)"));
        allLinks.map((link) => {
            link.setAttribute("pjax-prefetched", "true");
            this.io.observe(link);
        });
    }
    /**
     * Grabs the URLs from all of the observed anchor elements, unobserves the element, and sends the URLs to the Pjax web worker.
     * @param links - array of `IntersectionObserverEntry` objects
     */
    prefetchLink(links) {
        const urls = [];
        links.map(entry => {
            if (entry.isIntersecting) {
                const link = entry.target;
                this.io.unobserve(link);
                urls.push(link.href);
            }
        });
        if (urls.length) {
            /** Send the requested URLs to the Pjax web worker */
            this.worker.postMessage({
                type: "prefetch",
                urls: urls,
            });
        }
    }
}
new Pjax();
