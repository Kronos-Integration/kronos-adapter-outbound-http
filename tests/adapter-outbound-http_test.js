/* global describe, it, xit, before */
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
  nock = require('nock'),
  ksm = require('kronos-service-manager'),
  kronosEndpoint = require('kronos-endpoint'),

  MockUrlProviderService = require('./mockUrlProviderService'),
  adapterOutboundHttpFactory = require('../index');

const managerPromise = ksm.manager().then(manager =>
  Promise.all([

    // Register the mock Service factory
    manager.registerServiceFactory(MockUrlProviderService).then(sf =>
      manager.declareService({
        'type': sf.name,
        'name': 'registry',
        'url': 'http://localhost:6666/file/tar'
      })),

    // ---------------------------
    // register all the steps
    // ---------------------------
    adapterOutboundHttpFactory.registerWithManager(manager),

  ]).then(() =>
    Promise.resolve(manager)
  ));



describe('Outbound HTTP test', function () {

  let manager;

  before(done => {
    managerPromise.then(m => {
      manager = m;
      done();
    });
  });

  it('Send message', function (done) {


    let adpaterOutboundHttpStep = manager.createStepInstanceFromConfig({
      "type": "kronos-adapter-outbound-http",
      "method": "post",
      "serviceName": "gumboUrlService"
    }, manager);

    // This endpoint is the OUT endpoint of the previous step.
    // It will be connected with the OUT endpoint of the Adpater
    let sendEndpoint = new kronosEndpoint.SendEndpoint("testEndpointOut");
    let inEndPoint = adpaterOutboundHttpStep.endpoints.in;
    sendEndpoint.connected = inEndPoint;


    let sendMessage = {
      "hops": [{
        "hop": 1
      }, {
        "hop": 2
      }, {
        "hop": 3
      }],
      "info": {
        "name": "gumbo",
        "any field": "other value"
      },
      "payload": {
        "pay_val": " large Value"
      }
    };

    adpaterOutboundHttpStep.start().then(() => {
      const serverMock = nock('http://localhost')
        .post('/tar/file')
        .reply(200, {
          _id: '123ABC',
          _rev: '946B7D1C',
          username: 'pgte',
          email: 'pedro.teixeira@gmail.com'
        });

      sendEndpoint.receive(sendMessage).then(res => {
        console.log(res);
        done();
      });

    });



  });


});

// describe('Post JSON Interceptor test', function () {
//
//   it('Send message', function () {
//     const endpoint = {
//       "owner": stepMock,
//       "name": "gumboIn"
//     };
//
//     const postJson = new PostJsonInterceptor(undefined, endpoint);
//
//     const req = new MockHttp.Request({
//       url: '/test',
//       method: 'POST',
//       buffer: new Buffer(JSON.stringify({
//         "first-name": "nanu",
//         "last-name": "nana"
//       }))
//     });
//
//     const sendMessage = {
//       "info": {
//         "request": {
//           "header": {
//             "content-type": "application/json"
//           }
//         }
//       },
//       "payload": req
//     };
//
//     const mockReceive = new MockReceiveInterceptor(function (request, oldRequest) {
//
//       assert.ok(request);
//
//       assert.deepEqual(request, {
//         "hops": undefined,
//         "info": {
//           "request": {
//             "header": {
//               "content-type": "application/json"
//             }
//           }
//         },
//         "payload": {
//           "first-name": "nanu",
//           "last-name": "nana"
//         }
//       });
//       //  return Promise.resolve();
//
//     });
//
//     postJson.connected = mockReceive;
//
//     return postJson.receive(sendMessage, sendMessage);
//
//   });
//
//
//
// });
