/* jslint node: true, esnext: true */
'use strict';

const fetch = require('node-fetch');
const FormData = require('form-data');
const stream = require('stream');

const BaseStep = require('kronos-step').Step;

const AdapterOutboundHttp = {
	name: 'kronos-adapter-outbound-http',
	description: 'Routes http requests outbound',
	endpoints: { in : { in : true
		}
	},

	initialize(manager, name, stepConfiguration, props) {
		// The method used to send the http request
		const method = stepConfiguration.method ? stepConfiguration.method : 'post';

		const serviceName = stepConfiguration.serviceName;

		// A URL to use
		const url = stepConfiguration.url;

		props.method = {
			value: method
		};

		props.serviceName = {
			value: serviceName
		};

		props.serviceResolverName = {
			value: 'registry'
		};

		props.url = {
			value: url
		};
	},

	finalize(manager, stepConfiguration) {
		this.endpoints.in.receive = message => {

			const recipientUrl = this.getNextRecipientUrl();
			return recipientUrl.value.then(url => {
				return fetch(url, {
					method: this.method,
					body: message.payload
				}).then((res) => {
					return Promise.resolve(res);
				});
			});
		};
	},

	/**
	 * Gets the next URL to send the request to
	 * @return url (Promise) A Promise with the URL
	 */
	getNextRecipientUrl() {
		if (this.urlProvider) {
			return this.urlProvider.next();
		} else if (this.url) {
			return Promise.resolve(this.url);
		} else {
			throw new Error('No URL provider service and no URL given');
		}
	},

	_start() {
		// get  the URL provider service
		const registry = this.manager.services[this.serviceResolverName];

		if (registry) {
			this.urlProvider = registry.serviceURLs();
			return registry.start();
		} else {
			return Promise.resolve();
		}
	}
};


const AdapterOutboundHttpFactory = Object.assign({}, BaseStep, AdapterOutboundHttp);
module.exports = AdapterOutboundHttpFactory;
