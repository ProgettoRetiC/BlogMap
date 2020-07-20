require('dotenv').config();
var request=require('request');

var api_key='AIzaSyATA6YIj6i7pZD-9hdx1vI5CQYEvvobYwo';
var api_foto="AIzaSyATA6YIj6i7pZD-9hdx1vI5CQYEvvobYwo";

 function prendiLuogo(req,res){  
    var telefono;
    var sito;

    id_place=req.query.place_id;

    var recensioni;

    request({
        url: 'https://maps.googleapis.com/maps/api/place/details/json?place_id='+id_place+'&fields=reviews,name,formatted_phone_number,website&language=it&key='+api_key,
        method: 'GET',
    }, function(error, response, body){
        if(error) {
            console.log("ERRORE: Fallita get sull'api delle recensioni "+errore);
        } else {
            resp_json=body;
            resp = JSON.parse(resp_json);

            telefono=resp.result.formatted_phone_number;
            sito=resp.result.website;
            recensioni=[['','','',0,0],['','','',0,0],['','','',0,0],['','','',0,0],['','','',0,0]];

            if(resp.result.reviews!='undefined'){
                for(var i=0; i<resp.result.reviews.length; i++){
                    for(var k=0;k<5;k++){
                        if(resp.result.reviews[i].time>recensioni[k][4]){
                            recensioni.splice(k,0,["","","",0]);
                            recensioni.pop();
                            recensioni[k][0]=resp.result.reviews[i].author_name;
                            recensioni[k][1]=resp.result.reviews[i].relative_time_description;
                            recensioni[k][2]=resp.result.reviews[i].text;
                            recensioni[k][3]=resp.result.reviews[i].rating;
                            recensioni[k][4]=resp.result.reviews[i].time;
                            break;
                        }
                    }
                }
            }

            /* Utilizzo l'Api per prendere la foto del posto */
            var Foto;
            if(req.query.foto==''){
                Foto=0;
            }
            else{
                Foto='https://maps.googleapis.com/maps/api/place/photo?maxwidth=10000&photoreference='+req.query.foto+'&key='+api_foto;
            }
                    
            res.render('Luogo.ejs',{Nome: req.query.nome, Via: req.query.via, Rating: req.query.rating, Aperto: req.query.aperto, lat: req.query.lat, lon: req.query.lon,ApiFoto:req.query.apifoto,PhotoReference:req.query.foto, Foto: Foto, Telefono: telefono, Sito: sito, Recensioni: recensioni,NomeProfilo:req.session.nome,Cognome:req.session.cognome,FotoProfilo:req.session.foto_profilo});
        }
    });
}

module.exports.prendiLuogo = prendiLuogo;