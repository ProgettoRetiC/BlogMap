#!/usr/bin/env node
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    //creo il canale e dichiaro la coda
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'rpc_queue';

        channel.assertQueue(queue, {
            durable: false
        });
        channel.prefetch(1);
        console.log('Aspetto richiesta RPC');
        channel.consume(queue, function reply(msg) {
            var mappa=JSON.parse(msg.content.toString());

            console.log("Ricevuta richiesta del piano con id: ");

            var r=scaricaPianificazione(mappa);

            channel.sendToQueue(msg.properties.replyTo,
                Buffer.from(r.toString()), {
                    correlationId: msg.properties.correlationId
                });

            channel.ack(msg);
        });
    });
});

var api_foto="AIzaSyATA6YIj6i7pZD-9hdx1vI5CQYEvvobYwo";
function scaricaPianificazione(mappa){
    resp2=mappa.resp2;
    lat=mappa.lat;
    lon=mappa.lon;

    /* Array contentente le informazioni dei 5 posti migliori */
    var posti=[["",0,0,0,"","","","",0,1.5,0],["",0,0,0,"","","","",0,1.5,0],["",0,0,0,"","","","",0,1.5,0],["",0,0,0,"","","","",0,1.5,0],["",0,0,0,"","","","",0,1.5,0]];

    /* Ordina i migliori posti */
    if(mappa.sorting=='Posti migliori'){
        /* Scorre tutti i posti trovati dall'API e li inserisce nell'array se sono tra i 5 migliori */
        for (var i = 0; i <resp2.results.length; i++){
            /* Controllo se il posto attuale è tra i migliori 5 */
            for(var k=0;k<5;k++){
                if(typeof resp2.results[i].rating!='undefined' ){
                        lat2=resp2.results[i].geometry.location.lat;
                        lon2=resp2.results[i].geometry.location.lng;
                        var distanza=Math.round(((3958*3.1415926*Math.sqrt((lat2-lat)*(lat2-lat) + Math.cos(lat2/57.29578)*Math.cos(lat/57.29578)*(lon2-lon)*(lon2-lon))/180)*1.60934)*1000)/1000;
                    if((resp2.results[i].rating>posti[k][1]) || (resp2.results[i].rating==posti[k][1] && resp2.results[i].user_ratings_total>posti[k][8])){

                        /* Inserisco il nuovo posto nei migliori 5 e ne rimuovo uno */
                        posti.splice(k,0,["",0,0,0,"","","","",0,1.5,0]);
                        posti.pop();
                        /* Salvo le informazioni dei posti nell'array */
                        posti[k][0]=resp2.results[i].name.replace(['"'," "]);
                        posti[k][0]=posti[k][0].replace(["'"," "]);
                        posti[k][1]=resp2.results[i].rating;
                        posti[k][2]=resp2.results[i].geometry.location.lat;
                        posti[k][3]=resp2.results[i].geometry.location.lng;
                        posti[k][4]=resp2.results[i].vicinity;
                        if(typeof resp2.results[i].opening_hours!='undefined' ){
                            posti[k][5]='Si';
                        }
                        else{
                            posti[k][5]='No';
                        }
                        if(typeof(resp2.results[i].photos)!='undefined' ){
                            posti[k][7]=resp2.results[i].photos[0].photo_reference;
                            posti[k][6]="https://maps.googleapis.com/maps/api/place/photo?maxwidth=10000&photoreference="+posti[k][7]+"&key="+api_foto;
                        }
                        else{
                            posti[k][6]=null;
                            posti[k][7]=null;
                        }
                        posti[k][8]=resp2.results[i].user_ratings_total;
                        posti[k][9]=distanza;
                        posti[k][10]=resp2.results[i].place_id;
                        break;
                    }
                }
            }
        }
        for(i=0;i<5;i++){
            posti[i]=posti[i].join('&&&');
        }
        posti=posti.join('---');
        return posti;
    }

    /* Ordina i posti più vicini */
    else{
        /* Scorre tutti i posti trovati dall'API e li inserisce nell'array se sono tra i 5 più vicini */
        for(var i=0;i<resp2.results.length;i++){
            /* Controllo se il posto attuale è tra i più vicini */
            for(k=0;k<5;k++){
                lat2=resp2.results[i].geometry.location.lat;
                lon2=resp2.results[i].geometry.location.lng;
                var distanza=Math.round(((3958*3.1415926*Math.sqrt((lat2-lat)*(lat2-lat) + Math.cos(lat2/57.29578)*Math.cos(lat/57.29578)*(lon2-lon)*(lon2-lon))/180)*1.60934)*1000)/1000;
                if((distanza<posti[k][9])){

                    /* Inserisco il nuovo posto nei migliori 5 e ne rimuovo uno */
                    posti.splice(k,0,["",0,0,0,"","","","",0,1.5]);
                    posti.pop();

                    /* Salvo le informazioni dei posti nell'array */
                    posti[k][0]=resp2.results[i].name.replace(['"'," "]);
                    posti[k][0]=posti[k][0].replace( ["'"," "]);
                    if(typeof resp2.results[i].rating!='undefined' ){
                        posti[k][1]=resp2.results[i].rating;
                    }
                    else{
                        posti[k][1]='N/D';
                    }
                    posti[k][2]=resp2.results[i].geometry.location.lat;
                    posti[k][3]=resp2.results[i].geometry.location.lng;
                    posti[k][4]=resp2.results[i].vicinity;
                    if(typeof resp2.results[i].opening_hours!='undefined'){
                        posti[k][5]='Si';
                    }
                    else{
                        posti[k][5]='No';
                    }
                    if(typeof resp2.results[i].photos!='undefined'){
                        posti[k][7]=resp2.results[i].photos[0].photo_reference;
                        posti[k][6]="https://maps.googleapis.com/maps/api/place/photo?maxwidth=10000&photoreference="+posti[k][7]+"&key="+api_foto;
                    }else{
                        posti[k][6]=null;
                        posti[k][7]=null;
                    }
                    if(typeof resp2.results[i].user_ratings_total!='undefined'){
                        posti[k][8]=resp2.results[i].user_ratings_total;
                    }
                    else{
                        posti[k][8]='N/D';
                    }
                    posti[k][9]=distanza;
                    posti[k][10]=resp2.results[i].place_id;
                    break;
                }
            }
        }
        for(i=0;i<5;i++){
            posti[i]=posti[i].join('&&&');
        }
        posti=posti.join('---');
        return posti;
        }
}
