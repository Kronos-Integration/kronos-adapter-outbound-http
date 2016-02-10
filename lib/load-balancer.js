/* jslint node: true, esnext: true */
"use strict";

const fetch = require('node-fetch');
const FormData = require('form-data');
const stream = require('stream');

const BaseStep = require('kronos-step').Step;

const LoadBalancer = {
	"name": "kronos-adapter-outbound-loadbalancer",
	"description": "xx",
	"endpoints": {
		"in": {
			"in": true
		}
	},

	initialize(manager, name, stepConfiguration, props) {
		// default timeout 5 seconds
		const timeout = stepConfiguration.timeout ? stepConfiguration.timeout : 5;

		// default compress the data
		const compress = stepConfiguration.compress ? stepConfiguration.compress : true;

		props.timeout = {
			value: timeout
		};
		props.compress = {
			value: compress
		};

	},



	finalize(manager, stepConfiguration) {
		this.endpoints.in.receive = this.receiveRequest;
	},

	/**
	 * returns the next recipient for a message to send
	 */
	getNextRecipientUrl() {
		return "http://localhost:9898/file/tar";
	},


	/**
	 * Receives the request from the endpoint and sends it to an
	 * receiver over http
	 */
	receiveRequest(message) {
		//const recipientUrl = this.getNextRecipientUrl();
		const recipientUrl = "http://192.168.188.46:9898/file/tar";

		// let payLoad;
		// if (message.payload === 'string') {
		// 	payLoad = message.payload;
		// } else if (message.payload instanceof stream.Stream) {
		// 	payLoad = message.payload;
		// } else {
		// 	// expect that it is JSON
		// 	payLoad = JSON.stringify(message.payload);
		// }
		//
		// // make the message a form
		// const formData = new FormData();
		// formData.append('info', JSON.stringify(message.info));
		// formData.append('hops', JSON.stringify(message.hops));
		// formData.append('payload', payLoad);
		//
		// return fetch(recipientUrl, {
		// 	method: "post",
		// 	body: formData
		// }).then((res) => {
		// 	console.log("Got result");
		// 	return Promise.resolve("OK");
		// });

		return fetch(recipientUrl, {
			method: "post",
			body: message.payload
		}).then((res) => {
			console.log("Got result");
			//console.log(res);
			return Promise.resolve(res);
		});

	}



};


const LoadBalancerFactory = Object.assign({}, BaseStep, LoadBalancer);
module.exports = LoadBalancerFactory;
