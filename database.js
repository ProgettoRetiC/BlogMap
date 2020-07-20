require('dotenv').config();
var request = require('request');
var TEST=process.env.TEST;

function aggiornaDB(req,piano){
    return new Promise((resolve,reject) => {
        //vedo se l'utente ha un proprio database
        request({
            url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+req.session.id_client,
            methond: 'HEAD'
        }, function(error,response,body){
                if(response.statusCode==404){
                //database non esistente --> lo creo 
                request({
                    url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+req.session.id_client,
                    method: 'PUT',
                },function(error,response,body){
                    if(response.statusCode!=200){
                        console.log("Errore nella creazione database");
                    } else{
                        req.session.database=req.session.id_client;
                        console.log("Creato il database dell'utente");}
                        //vedo se il mio documento è presente nel db
                        request({
                            url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+req.session.id_client+"/"+piano.luogo,
                            methond: 'GET',
                            json: true,
                        }, function(error,response,body){
                            if(response.statusCode==404){
                                //doc non esistente --> lo creo
                                request({
                                    url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+req.session.id_client+"/"+piano.luogo,
                                    method: 'PUT',
                                    body: {piano: piano},
                                    json: true,
                                },function(error,response,body){
                                    if(response.statusCode!=200){
                                        console.log(error);
                                    } else{
                                        console.log("Documento aggiunto al database");
                                        return "Success";
                                    }
                                });
                            } 
                            else{
                                console.log("doc esistente");
                                //aggiorno il doc esistente
                                request({
                                    url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+req.session.id_client+"/"+piano.luogo,
                                    method: 'PUT',
                                    body: {_rev:body._rev, piano:piano},
                                    json: true,
                                },function(error,response,body){
                                    if(response.statusCode!=200){
                                        console.log(error);
                                    } else{
                                        console.log("Aggiornato documento");
                                        req.session.caricato=true;
                                        return "Success";
                                    }
                                }); 
                            }
                        });
                });
                return "Success";
                }else{
                    console.log("database esistente");
                    //vedo se il mio documento è presente nel db
                    request({
                        url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+req.session.id_client+"/"+piano.luogo,
                        methond: 'GET',
                        json: true
                    }, function(error,response,body){
                        if(response.statusCode==404){
                            //documento non esistente --> lo creo
                            request({
                                url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+req.session.id_client+"/"+piano.luogo,
                                method: 'PUT',
                                body: {piano: piano},
                                json: true,
                            },function(error,response,body){
                                if(response.statusCode!=200){
                                    console.log(error);
                                } else{
                                    console.log("Aggiunto al database");
                                    return "Success";
                                }
                            });
                        } 
                        else{
                            console.log("doc esistente");
                            //aggiorno il doc esistente
                            request({
                                url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+req.session.id_client+"/"+piano.luogo,
                                method: 'PUT',
                                body: {_rev:body._rev, piano:piano},
                                json: true,
                            },function(error,response,body){
                                if(response.statusCode!=200){
                                    console.log(error);
                                } else{
                                    console.log("Aggiornato database");
                                    return "Success";
                                }
                            }); 
                        }
                    });
                    }
            });
        });
}

function prendiDB(req){
    return new Promise((resolve,reject) => {
        //vedo se l'utente ha un proprio database
        if(TEST) console.log("Verifico se esiste database di:");
        request({
            url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+req.session.id_client,
            methond: 'HEAD',
        }, function(error,response,body){
            if(response.statusCode==404){
                //database non esistente esco
                if(TEST) console.log("Database non esistente");
                reject(error);
            }else{
            var piani=[];
            if(TEST) console.log("Prendo documenti dell utente");
                request({
                    url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+req.session.id_client+"/_all_docs",
                    methond: 'GET',
                    json: true
                }, function(error,response,body){
                    if(response.statusCode!=200){
                        //doc non esistente 
                        if(TEST) console.log("Documenti non trovati");
                        reject(error);
                    }else{
                        var rows=body.rows;
                        for(i=0;i<body.total_rows;i++){//itero per tutti i documenti presenti nel proprio database
                            request({
                                url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+req.session.id_client+"/"+rows[i].id,
                                method: 'GET',
                                json: true,
                            },function(error,response,body){
                                if(response.statusCode!=200){
                                    if(TEST) console.log("impossibile prendere documenti");
                                    reject(error);
                                } else{
                                    if(TEST) console.log("Documenti presi");
                                    console.log("Documento preso dal database");
                                    piani.push(body.piano);
                                }
                            });
                        }
                        setTimeout(function() {
                            resolve(piani);
                        }, 500);
                    }
                });
            }
        });
    });
}

function prendiDBApi(req){
    return new Promise((resolve,reject) => {
        //vedo se l'utente ha un proprio database
        request({
            url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+req.params.clientId,
            methond: 'HEAD',
        }, function(error,response,body){
            if(response.statusCode==404){
                //database non esistente esco
                reject(error);
            }else{
            var piani=[];
                request({
                    url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+req.params.clientId+"/_all_docs",
                    methond: 'GET',
                    json: true
                }, function(error,response,body){
                    if(response.statusCode!=200){
                        //doc non esistente 
                        reject(error);
                    }else{
                        var rows=body.rows;
                        for(i=0;i<body.total_rows;i++){//itero per tutti i documenti presenti nel proprio database
                            request({
                                url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+req.params.clientId+"/"+rows[i].id,
                                method: 'GET',
                                json: true,
                            },function(error,response,body){
                                if(response.statusCode!=200){
                                    reject(error);
                                } else{
                                    console.log("Documento preso dal database");
                                    piani.push(body.piano);
                                }
                            });
                        }
                        setTimeout(function() {
                            resolve(piani);
                        }, 500);
                    }
                });
            }
        });
    });
}

module.exports.aggiornaDB = aggiornaDB;
module.exports.prendiDB = prendiDB;
module.exports.prendiDBApi = prendiDBApi;