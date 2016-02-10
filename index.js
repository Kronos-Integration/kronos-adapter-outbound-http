/* jslint node: true, esnext: true */
"use strict";

const AdapterOutboundHttpFactory = require('./lib/adapter-outbound-http');
exports.AdapterOutboundHttpFactory = AdapterOutboundHttpFactory;

exports.registerWithManager = manager => manager.registerStep(AdapterOutboundHttpFactory);
