/* jslint node: true, esnext: true */
"use strict";

const service = require('kronos-service');


class MockUrlProviderService extends service.Service {

	static get name() {
		return "registry";
	}

	get type() {
		return MockUrlProviderService.name;
	}

	get autostart() {
		return true;
	}

	/**
	 * config.url = url // The URL to provide
	 */
	constructor(config, owner) {
		super(config, owner);

		Object.defineProperty(this, 'url', {
			value: config.url
		});
	}


	* serviceURLs(name) {
		console.log("#### called");
		while (true) {
			yield Promise.resolve(this.url);
		}
	}
}

module.exports = MockUrlProviderService;
