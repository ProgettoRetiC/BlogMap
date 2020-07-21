var rpc=require('./clientRPC');
require('dotenv').config();
var request=require('request');

var api_key='AIzaSyATA6YIj6i7pZD-9hdx1vI5CQYEvvobYwo';

function prendiMappa(req,res){
    var citta=req.body.citta;
    var type=req.body.type;
    var indirizzo=req.body.indirizzo;
    indirizzo=indirizzo.split(" ");
    var resp;var resp2;
    var ind="";
    for(var i=0;i<indirizzo.length;i++){
        ind=ind+indirizzo[i]+"%20";
    }
    request({
        url:"http://open.mapquestapi.com/geocoding/v1/address?key=QbSlbZcOPJn8uiAvJqWKOTDieGmiLotE&location="+ind+","+citta,
        method: 'GET',
    }, function(error, response, body){
        if(error) {
            console.log("ERRORE: Fallita get sull api coordinate "+errore);
        } else {
            resp_json=body;
            resp = JSON.parse(resp_json);
            var lat=resp.results[0].locations[0].latLng.lat;
            var lon=resp.results[0].locations[0].latLng.lng;

            if(lat==39.78373 && lon==-100.445882){
                res.render('Home.ejs',{notfound:'', Nome:  req.session.nome, Cognome: req.session.cognome, Foto: req.session.foto_profilo});
            }
            request({
                url:"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+lon+"&radius=1500&type="+type+"&key="+api_key,
                method: 'GET',
            }, function(error, response, body){
                if(error) {
                    console.log("ERRORE: Fallita get sull api "+errore);
                } else {
                    resp_json2=body;
                    resp2 = JSON.parse(resp_json2);
                    var mappa={
                        sorting:req.body.sorting,
                        resp2:resp2,
                        lat:lat,
                        lon:lon
                    }
                    rpc.gestisciRisultati(mappa).then(
                        function(resp){
                            console.log("Funzione eseguita con Successo!");
                            posti=resp.split('---');
                            for(i=0; i<5; i++){
                                posti[i]=posti[i].split('&&&');
                            }
                            res.render('Mappa.ejs',{posti:posti,lat:lat,lon:lon,NomeProfilo:  req.session.nome, Cognome: req.session.cognome, FotoProfilo: req.session.foto_profilo});
                        }).catch(
                        function(err){
                            console.log("Si è verificato un errore nell'ottenimento delle recensioni!");
                            console.log(err);
                            res.send("errore");
                        }
                    );

                }
            });
        }
    });
}

function prendiMappaApi(req,res){
    return new Promise((resolve,reject) => {
        var citta=req.params.citta;
        var type=req.params.type;
        var indirizzo=req.params.indirizzo;
        indirizzo=indirizzo.split(" ");
        var resp;var resp2;
        var ind="";
        for(var i=0;i<indirizzo.length;i++){
            ind=ind+indirizzo[i]+"%20";
        }
        request({
            url:"http://open.mapquestapi.com/geocoding/v1/address?key=QbSlbZcOPJn8uiAvJqWKOTDieGmiLotE&location="+ind+","+citta,
            method: 'GET',
        }, function(error, response, body){
            if(error) {
                reject(error);
            } else {
                resp_json=body;
                resp = JSON.parse(resp_json);
                var lat=resp.results[0].locations[0].latLng.lat;
                var lon=resp.results[0].locations[0].latLng.lng;

                if(lat==39.78373 && lon==-100.445882){
                    reject(error);
                }
                request({
                    url:"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+lon+"&radius=1500&type="+type+"&key="+api_key,
                    method: 'GET',
                }, function(error, response, body){
                    if(error) {
                       reject(error);
                    } else {
                        resp_json2=body;
                        resp2 = JSON.parse(resp_json2);
                        var mappa={
                            sorting:req.params.sorting,
                            resp2:resp2,
                            lat:lat,
                            lon:lon
                        }
                        rpc.gestisciPianificazione(mappa).then(
                            function(resp){
                                console.log("Funzione eseguita con Successo!");
                                posti=resp.split('---');
                                for(i=0; i<5; i++){
                                    posti[i]=posti[i].split('&&&');
                                }
                                setTimeout(function() {
                                    resolve(JSON.stringify(posti));
                                }, 500);
                            }).catch(
                            function(err){
                                console.log("Si è verificato un errore nell'ottenimento delle recensioni!");
                                reject(err);
                            }
                        );

                    }
                });
            }
        });
    });
}

module.exports.prendiMappa = prendiMappa;
module.exports.prendiMappaApi = prendiMappaApi;