require('dotenv').config();
var request = require('request');

function aggiornaDB(id,piano){
    return new Promise((resolve,reject) => {
        //vedo se l'utente ha un proprio database
        request({
            url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+id,
            methond: 'HEAD'
        }, function(error,response,body){
                if(response.statusCode==404){
                //database non esistente --> lo creo 
                request({
                    url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+id,
                    method: 'PUT',
                },function(error,response,body){
                    if(response.statusCode!=201 && response.statusCode!=200){
                        reject(error);
                    } else{
                        console.log("Creato il database dell'utente");}
                        //vedo se il mio documento è presente nel db
                        request({
                            url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+id+"/"+piano.luogo,
                            methond: 'GET',
                            json: true,
                        }, function(error,response,body){
                            if(response.statusCode==404){
                                //doc non esistente --> lo creo
                                request({
                                    url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+id+"/"+piano.luogo,
                                    method: 'PUT',
                                    body: {piano: piano},
                                    json: true,
                                },function(error,response,body){
                                    if(response.statusCode!=201 && response.statusCode!=200){
                                        reject(error);
                                    } else{
                                        console.log("Documento aggiunto al database");
                                        setTimeout(function() {
                                            resolve("success");
                                        }, 500);
                                    }
                                });
                            } 
                            else{
                                console.log("doc esistente");
                                //aggiorno il doc esistente
                                request({
                                    url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+id+"/"+piano.luogo,
                                    method: 'PUT',
                                    body: {_rev:body._rev, piano:piano},
                                    json: true,
                                },function(error,response,body){
                                    if(response.statusCode!=201 && response.statusCode!=200){
                                        reject(error);
                                    } else{
                                        console.log("Aggiornato documento");
                                        setTimeout(function() {
                                            resolve("success");
                                        }, 500);
                                    }
                                }); 
                            }
                        });
                });
                }else{
                    console.log("database esistente");
                    //vedo se il mio documento è presente nel db
                    request({
                        url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+id+"/"+piano.luogo,
                        methond: 'GET',
                        json: true
                    }, function(error,response,body){
                        if(response.statusCode==404){
                            //documento non esistente --> lo creo
                            request({
                                url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+id+"/"+piano.luogo,
                                method: 'PUT',
                                body: {piano: piano},
                                json: true,
                            },function(error,response,body){
                                if(response.statusCode!=201 && response.statusCode!=200){
                                    reject(error);
                                } else{
                                    console.log("Aggiunto al database");
                                    setTimeout(function() {
                                        resolve("success");
                                    }, 500);
                                }
                            });
                        } 
                        else{
                            console.log("doc esistente");
                            //aggiorno il doc esistente
                            request({
                                url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+id+"/"+piano.luogo,
                                method: 'PUT',
                                body: {_rev:body._rev, piano:piano},
                                json: true,
                            },function(error,response,body){
                                if(response.statusCode!=201 && response.statusCode!=200){
                                    console.log(response.statusCode);
                                    reject(error);
                                } else{
                                    console.log("Aggiornato database");
                                    setTimeout(function() {
                                        resolve("success");
                                    }, 500);
                                }
                            }); 
                        }
                    });
                    }
            });
        });
}

function prendiDB(id){
    return new Promise((resolve,reject) => {
        //vedo se l'utente ha un proprio database
        request({
            url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+id,
            methond: 'HEAD',
        }, function(error,response,body){
            if(response.statusCode==404){
                //database non esistente esco
                reject(error);
            }else{
            var piani=[];
                request({
                    url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+id+"/_all_docs",
                    methond: 'GET',
                    json: true
                }, function(error,response,body){
                    if(response.statusCode!=201 && response.statusCode!=200){
                        //doc non esistente 
                        reject(error);
                    }else{
                        var rows=body.rows;
                        for(i=0;i<body.total_rows;i++){//itero per tutti i documenti presenti nel proprio database
                            request({
                                url: "http://admin:"+process.env.PASSDB+"@192.168.99.100:5984/a"+id+"/"+rows[i].id,
                                method: 'GET',
                                json: true,
                            },function(error,response,body){
                                if(response.statusCode!=201 && response.statusCode!=200){
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
                    if(response.statusCode!=201 && response.statusCode!=200){
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
                                if(response.statusCode!=201 && response.statusCode!=200){
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