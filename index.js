/* jslint node: true, esnext: true */
"use strict";

const LoadBalancerFactory = require('./lib/load-balancer');
exports.LoadBalancerFactory = LoadBalancerFactory;
exports.registerWithManager = manager => manager.registerStep(LoadBalancerFactory);
