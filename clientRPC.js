#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

function gestisciPianificazione(mappa){
    return new Promise((resolve,reject) => {
        amqp.connect('amqp://localhost', function(error0, connection) {
            if (error0) {
                reject(error0);
            }
            connection.createChannel(function(error1, channel) {
                if (error1) {
                    reject(error1);
                }
                channel.assertQueue('', {
                    exclusive: true
                }, function(error2, q) {
                    if (error2) {
                        reject(error2);
                    }
                    var correlationId = generateUuid();

                    console.log('Richiedo la recensione');

                    channel.consume(q.queue, function(msg) {
                        //controlliamo se effettivamente il messaggio sia diretto a noi
                        if (msg.properties.correlationId === correlationId) {
                            //console.log('Messaggio: %s', msg.content.toString());
                            resolve(msg.content.toString());
                            setTimeout(function() {
                                connection.close();
                            }, 500);
                        }
                    }, {
                        noAck: true
                    });

                    channel.sendToQueue('rpc_queue',
                        Buffer.from(JSON.stringify(mappa)), {
                            correlationId: correlationId,
                            replyTo: q.queue
                        });
                });
            });
        });   
    });

}

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}
  
module.exports.gestisciPianificazione = gestisciPianificazione;