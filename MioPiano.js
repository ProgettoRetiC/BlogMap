const { prendiDB } = require("./database");
require('dotenv').config();

function Piano(req,res){
    //prendiamo i piani dal database tramite una promise in formato json
    var id=req.session.id_client; 
    prendiDB(id).then(
        function(resp){
            //var posti=[["",0,0,0,"","","","",0,0,0],["",0,0,0,"","","","",0,0,0],["",0,0,0,"","","","",0,0,0],["",0,0,0,"","","","",0,0,0],["",0,0,0,"","","","",0,0,0]];
            var posti=[["",0,0,0,"","","","",0,0,0,0,0,0,0,0],["",0,0,0,"","","","",0,0,0,0,0,0,0,0],["",0,0,0,"","","","",0,0,0,0,0,0,0,0],["",0,0,0,"","","","",0,0,0,0,0,0,0,0],["",0,0,0,"","","","",0,0,0,0,0,0,0,0]];
            console.log(resp.length);
            //creo array partendo da json
            for(k=0;k<resp.length;k++){
                if(typeof resp[k]=='undefined')break;
                posti[k][0]=resp[k].luogo;
                posti[k][1]=resp[k].rating;
                posti[k][2]=resp[k].lat;
                posti[k][3]=resp[k].lon;
                posti[k][4]=resp[k].via;
                posti[k][5]=resp[k].photoreference;
                var Foto;
                if(posti[k][5]==''){
                    Foto=0;
                }
                else{
                    Foto='https://maps.googleapis.com/maps/api/place/photo?maxwidth=10000&photoreference='+posti[k][5]+'&key=AIzaSyBfiOgcZFZ5xZJvM5TKBpSpbvby3-Ud2Rs';
                }
                posti[k][6]=Foto;
                posti[k][7]=resp[k].telefono;
                posti[k][8]=resp[k].sito;
                posti[k][9]=(resp[k].data).substring(0,10);
                data=posti[k][9].split('-');
                posti[k][9]='';
                for(i=2;i>=0;i--){
                    posti[k][9]=posti[k][9]+data[i]+'-';
                }
                posti[k][9]= (posti[k][9]).substring(0,10);
                posti[k][10]=(resp[k].data).substring(11,16);
                posti[k][11]=posti[k][9].split('-')[0];
                posti[k][12]=posti[k][9].split('-')[1];
                posti[k][13]=posti[k][9].split('-')[2];
                posti[k][14]=posti[k][10].split(':')[0];
                posti[k][15]=posti[k][10].split(':')[1];
            }
             var posti2 = posti.sort(function(a, b) {
                if (a[13] == b[13] && a[12] == b[12] && a[14] == b[14] && a[11] == b[11] ) {
                return a[15] - b[15];
                }
                else if(a[13] == b[13] && a[12] == b[12] && a[11] == b[11]){
                    return a[14] - b[14];
                }
                else if( a[12] == b[12] && a[11] == b[11]){
                    return a[13] - b[13];
                }
                else if(a[11] == b[11]){
                    return a[12] - b[12];
                }
                else{
                    return a[11] - b[11];
                }
            });
            var tot=0;
            while(posti[tot][0]==''){
                posti2.splice(5,0,["",0,0,0,"","","","",0,0,0,0,0,0,0,0]);
                tot++;
            }
            for(i=0; i<tot; i++){
                posti2.splice(0,1);
            }
            console.log(posti2);
            res.render('MioPiano.ejs',{posti:posti2, NomeProfilo:  req.session.nome, Cognome: req.session.cognome, FotoProfilo: req.session.foto_profilo});
        }).catch(
            function(err){
                console.log("Si è verificato un errore nella chiamata alla pagina miopiano ");
                console.log(err);
                res.send("errore nella chiamata alla pagina miopiano");
            }

        )
}

module.exports.Piano = Piano;