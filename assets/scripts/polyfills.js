"use strict";

if(typeof window.Promise === "undefined") {
    require("promise/lib/rejection-tracking").enable();
    window.Promise = require("promise/lib/es6-extensions");
}

require("whatwg-fetch");

Object.assign = require("object-assign");