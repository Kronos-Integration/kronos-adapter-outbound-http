/* global describe, it, xit */
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),

  MockHttp = require('mock-http'),

  llm = require('loglevel-mixin'),
  PostJsonInterceptor = require('../index').PostJsonInterceptor,

  MockReceiveInterceptor = require('kronos-test-interceptor').MockReceiveInterceptor,

  connectorMixin = require('kronos-interceptor').ConnectorMixin;

const stepMock = {
  "name": "dummy step name",
  "type": "dummy step type"
};
llm.defineLogLevelProperties(stepMock, llm.defaultLogLevels, llm.defaultLogLevels);


describe('Post JSON Interceptor test', function () {

  it('Send message', function () {
    const endpoint = {
      "owner": stepMock,
      "name": "gumboIn"
    };

    const postJson = new PostJsonInterceptor(undefined, endpoint);

    const req = new MockHttp.Request({
      url: '/test',
      method: 'POST',
      buffer: new Buffer(JSON.stringify({
        "first-name": "nanu",
        "last-name": "nana"
      }))
    });

    const sendMessage = {
      "info": {
        "request": {
          "header": {
            "content-type": "application/json"
          }
        }
      },
      "payload": req
    };

    const mockReceive = new MockReceiveInterceptor(function (request, oldRequest) {

      assert.ok(request);

      assert.deepEqual(request, {
        "hops": undefined,
        "info": {
          "request": {
            "header": {
              "content-type": "application/json"
            }
          }
        },
        "payload": {
          "first-name": "nanu",
          "last-name": "nana"
        }
      });
      //  return Promise.resolve();

    });

    postJson.connected = mockReceive;

    return postJson.receive(sendMessage, sendMessage);

  });



});
