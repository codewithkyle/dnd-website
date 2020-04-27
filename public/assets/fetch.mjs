import { env } from "./env.mjs";
import { djinnjsOutDir, usePercentage } from "./config.mjs";
/**
 * Appends JavaScript resources to the documents head if it hasn't already been loaded.
 * @param filenames - a filename `sting` or an array of `string` JS filenames or a URL -- exclude the extension
 */
export function fetchJS(filenames) {
    return new Promise(resolve => {
        const ticket = env.startLoading();
        const resourceList = filenames instanceof Array ? filenames : [filenames];
        if (resourceList.length === 0) {
            env.stopLoading(ticket);
            resolve();
        }
        let loaded = 0;
        for (let i = 0; i < resourceList.length; i++) {
            const filename = resourceList[i];
            const isUrl = new RegExp(/^(http)/i).test(resourceList[i]);
            let el = document.head.querySelector(`script[src="${resourceList[i]}"]`) || document.head.querySelector(`script[file="${filename}"]`) || null;
            if (!el) {
                el = document.createElement("script");
                if (!isUrl) {
                    el.setAttribute("file", `${filename}`);
                }
                el.type = "module";
                if (!isUrl) {
                    if (filename.match(/(\..*)$/gi)) {
                        el.src = `${window.location.origin}/${djinnjsOutDir}/${filename}`;
                    }
                    else {
                        el.src = `${window.location.origin}/${djinnjsOutDir}/${filename}.mjs`;
                    }
                }
                else {
                    el.src = resourceList[i];
                }
                el.addEventListener("load", () => {
                    loaded++;
                    if (loaded === resourceList.length) {
                        env.stopLoading(ticket);
                        resolve();
                    }
                });
                el.addEventListener("error", () => {
                    loaded++;
                    if (loaded === resourceList.length) {
                        env.stopLoading(ticket);
                        resolve();
                    }
                });
                document.head.append(el);
            }
            else {
                loaded++;
                if (loaded === resourceList.length) {
                    env.stopLoading(ticket);
                    resolve();
                }
            }
        }
    });
}
/**
 * Appends resources to the documents head if it hasn't already been loaded.
 * @param filenames - a filename `sting` or an array of `string` CSS filenames or a URL -- exclude the extension
 */
export function fetchCSS(filenames) {
    return new Promise(resolve => {
        const ticket = env.startLoading();
        const resourceList = filenames instanceof Array ? filenames : [filenames];
        if (resourceList.length === 0) {
            env.stopLoading(ticket);
            resolve();
        }
        const loadingMessage = document.body.querySelector("djinnjs-file-loading-value") || null;
        let loaded = 0;
        for (let i = 0; i < resourceList.length; i++) {
            const filename = resourceList[i].replace(/(\.css)$/gi, "");
            const isUrl = new RegExp(/^(http)/gi).test(filename);
            let el = document.head.querySelector(`link[file="${filename}.css"]`) || document.head.querySelector(`link[href="${filename}"]`) || null;
            if (!el) {
                el = document.createElement("link");
                if (!isUrl) {
                    el.setAttribute("file", `${filename}.css`);
                }
                el.rel = "stylesheet";
                if (!isUrl) {
                    el.href = `${window.location.origin}/${djinnjsOutDir}/${filename}.css`;
                }
                else {
                    el.href = `${filename}.css`;
                }
                el.addEventListener("load", () => {
                    loaded++;
                    if (env.domState === "hard-loading" && loadingMessage) {
                        if (usePercentage) {
                            loadingMessage.innerHTML = `${Math.round((loaded / resourceList.length) * 100)}%`;
                        }
                        else {
                            loadingMessage.innerHTML = `${loaded}/${resourceList.length}`;
                        }
                    }
                    if (loaded === resourceList.length) {
                        env.stopLoading(ticket);
                        resolve();
                    }
                });
                el.addEventListener("error", () => {
                    loaded++;
                    if (env.domState === "hard-loading" && loadingMessage) {
                        if (usePercentage) {
                            loadingMessage.innerHTML = `${Math.round((loaded / resourceList.length) * 100)}%`;
                        }
                        else {
                            loadingMessage.innerHTML = `${loaded}/${resourceList.length}`;
                        }
                    }
                    if (loaded === resourceList.length) {
                        env.stopLoading(ticket);
                        resolve();
                    }
                });
                document.head.append(el);
            }
            else {
                loaded++;
                if (env.domState === "hard-loading" && loadingMessage) {
                    if (usePercentage) {
                        loadingMessage.innerHTML = `${Math.round((loaded / resourceList.length) * 100)}%`;
                    }
                    else {
                        loadingMessage.innerHTML = `${loaded}/${resourceList.length}`;
                    }
                }
                if (loaded === resourceList.length) {
                    env.stopLoading(ticket);
                    resolve();
                }
            }
        }
    });
}
