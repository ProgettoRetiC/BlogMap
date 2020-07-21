require('dotenv').config();
var request = require('request');
const { aggiornaDB } = require("./database");

function controllaEvento(res,req, token,luogo,aperto,sito,photoreference,rating,telefono,via, data,timezone,apifoto,lat,lon){
    //lista dove mettiamo orario e timezone di tutti gli eventi 
    var lista2=new Array();
	var options={
	url:'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=9999&singleEvents=true',
	headers: {
	    'Authorization': 'Bearer '+token,
	    }
    };
    request(options, function(error, response, body){
    	if (!error && response.statusCode == 200){
        var info = JSON.parse(body);
        //contiene tutti gli eventi
        var lista=info.items; 
        if(lista!=null){
            for(var i=0; i<lista.length; i++){
                if(lista[i].start == undefined) continue;
                lista2.push(lista[i].start.dateTime);
                lista2.push(lista[i].start.timeZone);
        	}
			if(lista2.includes(data)){
		      	console.log("Evento già aggiunto!!");
		    }else{
                  aggiungiEvento(res,req,token,luogo,aperto,sito,photoreference,rating,telefono,via, data,timezone,apifoto,lat,lon);
            }
		    }
        }
    });
}

function aggiungiEvento(res,req,token,luogo,aperto,sito,photoreference,rating,telefono,via,data,timezone,apifoto,lat,lon){
    var url= 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    var headers= {
        'Authorization': 'Bearer '+token,
        'Content-Type': 'application/json'
    };
    var body1={
        'description' : 'prenotazione posto:'+luogo,
        'summary' : 'evento da ricordare',
        'location': luogo,
        'end': {
        'dateTime' : data,
        'timeZone': timezone,
        },
        'start':{
        'dateTime': data,
        'timeZone': timezone,
        },
        'visibility': 'public'
    };
    request({headers:headers, url:url, method:'POST', body:JSON.stringify(body1)}, function(error,response,body){
        if(error){
            console.log('errore nella chiamata');
        }else{
            var piano={
                luogo:luogo,
                rating:rating,
                lat:lat,
                lon:lon,
                via:via,
                photoreference:photoreference,
                telefono:telefono,
                sito:sito,
                data:data,
            }
            var id=req.session.id_client;
            aggiornaDB(id,piano).then(() => {
                console.log('Aggiunta prenotazione a '+luogo);
                res.render('Home.ejs',{notfound:'', Nome:  req.session.nome, Cognome: req.session.cognome, Foto: req.session.foto_profilo});
            }).catch(
                function(err){
                    console.log("Si è verificato un errore nella chiamata alla funzione aggiornaDB");
                    console.log(err);
                    res.send("Si è verificato un errore nella chiamata alla funzione aggiornaDB");
                }
            )
        }
    });
}
module.exports.controllaEvento= controllaEvento;
module.exports.aggiungiEvento= aggiungiEvento;