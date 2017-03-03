#!/usr/bin/env node

var amqp = require('amqplib');
var basename = require('path').basename;
var Promise = require('bluebird');
var uuid = require('node-uuid');

// I've departed from the form of the original RPC tutorial, which
// needlessly introduces a class definition, and doesn't even
// parameterise the request.

var n = {};

n.name = process.argv[2];
n.email = process.argv[3];

amqp.connect('amqp://localhost').then(function(conn) {
  return conn.createChannel().then(function(ch) {
    return new Promise(function(resolve) {
      var corrId = uuid();
      function maybeAnswer(msg) {
        if (msg.properties.correlationId === corrId) {
          resolve(msg.content.toString());
        }
      }

      var ok = ch.assertQueue('', {exclusive: true})
        .then(function(qok) { return qok.queue; });

      ok = ok.then(function(queue) {
        return ch.consume(queue, maybeAnswer, {noAck: true})
          .then(function() { return queue; });
      });

      ok = ok.then(function(queue) {
        console.log(' [x] Requesting fib(%s)', n);
        ch.sendToQueue('rpc_queue', new Buffer(JSON.stringify(n)), {
          correlationId: corrId, replyTo: queue
        });
      });
    });
  })
  .then(function(fibN) {
    console.log(' [.] Got %s', fibN);
  })
  .finally(function() { conn.close(); 
  });
}).catch(console.warn);
