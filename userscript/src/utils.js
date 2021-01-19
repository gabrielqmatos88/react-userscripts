/**
 * Wrapped console.log function.
 *
 * @export
 * @param {*} args
 */
export function log(...args) {
    console.log("Userscript (React Mode):", ...args);
}

/**
 * Wrapped version of `fetch` that logs the output as it's being fetched.
 * It also specifies the full path, because in Greasemonkey, the full path is needed.
 *
 * @param {string} arg
 * @returns {Promise} - the `fetch` promise
 */
export function logFetch(arg) {
    const url = new URL(arg, window.location);
    log("fetching", "" + url);
    return fetch("" + url, { credentials: "include" });
}

/**
 * Ensure `callback` is called every time window.location changes
 * Code derived from https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
 *
 * @export
 * @param {function} callback - function to be called when URL changes
 * @returns {MutationObserver} - MutationObserver that watches the URL
 */
export function addLocationChangeCallback(callback) {
    // Run the callback once right at the start
    window.setTimeout(callback, 0);

    // Set up a `MutationObserver` to watch for changes in the URL
    let oldHref = window.location.href;
    const body = document.querySelector("body");
    const observer = new MutationObserver(mutations => {
        if (mutations.some(() => oldHref !== document.location.href)) {
            oldHref = document.location.href;
            callback();
        }
    });

    observer.observe(body, { childList: true, subtree: true });
    return observer;
}

/**
 * Awaits for an element with the specified `selector` to be found
 * and then returns the selected dom node.
 * This is used to delay rendering a widget until its parent appears.
 *
 * @export
 * @param {string} selector
 * @returns {DOMNode}
 */
export async function awaitElement(selector) {
    const MAX_TRIES = 100;
    let tries = 0;
    return new Promise((resolve, reject) => {
        function probe() {
            tries++;
            return document.querySelector(selector);
        }

        function delayedProbe() {
            if (tries >= MAX_TRIES) {
                log("Can't find element with selector", selector);
                reject();
                return;
            }
            const elm = probe();
            if (elm) {
                resolve(elm);
                return;
            }

            window.setTimeout(delayedProbe, 250);
        }

        delayedProbe();
    });
}

export async function awaitObjPath(obj, path) {
    const MAX_TRIES = 100;
    let tries = 0;
    return new Promise((resolve, reject) => {
        function probe() {
            tries++;
            return  getProp(obj, path);
        }

        function delayedProbe() {
            if (tries >= MAX_TRIES) {
                log("Can't find obj with path", path);
                reject();
                return;
            }
            const getObj = probe();
            if (getObj) {
                resolve(getObj);
                return;
            }

            window.setTimeout(delayedProbe, 250);
        }

        delayedProbe();
    });
}

export function getProp(obj, path, defaultValue) {
    if (!path || !obj) {
        return defaultValue;
    }
    // magic to add support to arrays e.g:  getProp(obj, 'mydata.result[0].name');
    path = path.replace(/\[['"]?([a-z0-9_]+)['"]?\]/ig, '.$1').replace(/(^\.|\.$)/, '');
    var pathArr = path.split('.');
    var tmpConfig;
    for (var i = 0; i < pathArr.length; i++) {
        var tmpPath = pathArr[i];
        var isModule = false;
        //trying to load at first time
        if (!tmpConfig) {
            tmpConfig = obj[tmpPath];
            isModule = !!tmpConfig;
        }
        //check if it's empty again to validate if it has the module
        if (!tmpConfig) {
            tmpConfig = defaultValue;
            break;
        }

        if (isModule) {
            continue;
        }
        tmpConfig = tmpConfig[tmpPath];
    }
    return tmpConfig !== null && tmpConfig !== undefined ? tmpConfig : defaultValue;
};

