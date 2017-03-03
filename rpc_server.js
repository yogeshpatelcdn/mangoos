#!/usr/bin/env node

var amqp = require('amqplib');
var users = require('./models/user');

function fib(n) {
  // Do it the ridiculous, but not most ridiculous, way. For better,
  // see http://nayuki.eigenstate.org/page/fast-fibonacci-algorithms
  var a = 0, b = 1;
  for (var i=0; i < n; i++) {
    var c = a + b;
    a = b; b = c;
  }
  return a;
}

amqp.connect('amqp://localhost').then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {
    var q = 'rpc_queue';
    var ok = ch.assertQueue(q, {durable: false});
    var ok = ok.then(function() {
      ch.prefetch(1);
      return ch.consume(q, reply);
    });
    return ok.then(function() {
      console.log(' [x] Awaiting RPC requests');
    });

    function reply(msg) {
	
	var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
 
// Connection URL 
var url = 'mongodb://abc:9575913428@ds019756.mlab.com:19756/test-mlab';
// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
 console.log(msg.content.toString());
  db.collection('users').insert(JSON.parse(msg.content.toString()), function(err, data) {
    db.close();
	console.log('response fron mongo');
	      var n = JSON.stringify(data.ops[0]._id);
		  
		  //var n = parseInt(msg.content.toString());
		  console.log(' [.] fib(%s)', n);
		  ch.sendToQueue(msg.properties.replyTo,
						 new Buffer(n),
						 {correlationId: msg.properties.correlationId});
		  ch.ack(msg);
  });
});
	
	
	
    }
  });
}).catch(console.warn);
