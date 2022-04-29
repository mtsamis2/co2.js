"use strict";

const log = require("debug")("tgwf:hosting");

/**
 * check if we're running inside a node environment by looking for the
 * existence of a process object, with accompanying properties
 * @return {Boolean}
 */
function isNodejs() {
  return typeof process === 'object' &&
    typeof process.versions === 'object' &&
    typeof process.versions.node !== 'undefined';
}

const hostingAPI = require("./hosting-api");
let hostingJSON

if (isNodejs()) {
  hostingJSON = require("./hosting-json");
}


function check(domain, db) {
  if (db && hostingJSON) {
    return hostingJSON.check(domain, db);
    return
  } else {
    return hostingAPI.check(domain);
  }
}

function greenDomainsFromResults(greenResults) {
  const entries = Object.entries(greenResults);
  let greenEntries = entries.filter(function ([key, val]) {
    return val.green;
  });

  return greenEntries.map(function ([key, val]) {
    return val.url;
  });
}

async function checkPage(pageXray, db) {
  const domains = Object.keys(pageXray.domains);
  return check(domains, db);
}

module.exports = {
  check,
  checkPage,
  greenDomains: greenDomainsFromResults,
  loadJSON: hostingJSON.loadJSON,
};
