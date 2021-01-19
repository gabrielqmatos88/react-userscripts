// ==UserScript==
// @name         Xmo Tool - Reactjs
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  just testing :D
// @author       gabriel.q.matos@gmail.com
// @match        http://**
// @match        https://**
// @match        http://192.168.0.1/**
// @match        http://192.168.1.1/**
// @match        https://192.168.0.1/**
// @match        https://192.168.1.1/**
// @match        *://*/*
// @require      https://cdn.jsdelivr.net/npm/jsondiffpatch/dist/jsondiffpatch.umd.min.js
// @updateURL    https://gist.github.com/gabrielqmatos88/0264be5e8696b24838d9ba31010ecab2/raw/a7496399917591b3b92e84c0e20691bc838573d7/react-userscripts.user.js
// @grant        none
// ==/UserScript==
function createEmptyDiv(id) {
    var newDiv = document.createElement('div');
    newDiv.id = id;
    document.body.append(newDiv);
};
createEmptyDiv('xmo-tools');
createEmptyDiv('snackbar');
