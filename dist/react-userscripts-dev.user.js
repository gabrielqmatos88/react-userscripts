// ==UserScript==
// @name         Xmo Tool - Reactjs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://**
// @match        https://**
// @match        http://192.168.0.1/**
// @match        http://192.168.1.1/**
// @match        https://192.168.0.1/**
// @match        https://192.168.1.1/**
// @match        *://*/*
// @require      https://cdn.jsdelivr.net/npm/jsondiffpatch/dist/jsondiffpatch.umd.min.js
// @grant        none
// ==/UserScript==

"use strict";

function createEmptyDiv(id) {
  var newDiv = document.createElement('div');
  newDiv.id = id;
  document.body.append(newDiv);
};
createEmptyDiv('xmo-tools');
createEmptyDiv('snackbar');

function log(...args) {
    console.log("Userscript:", ...args);
}

log("Dev mode started");

async function main() {
  const resp = await fetch("http://localhost:3000/static/js/main.js")
  const script = await resp.text();
  log("Got Dev script")
  eval(script)
  alert('oi');
  log("Dev script evaled");
}

// Make sure we run once at the start
main.bind({})().catch(e => {
    log("ERROR", e);
});
