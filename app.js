var express=require("express");
var request=require('request');
require('dotenv').config();
const expressSession = require('express-session');
var bodyParser = require("body-parser");
var app=express();
const swaggerUI= require('swagger-ui-express');
const swaggerDocument= require('./swagger.json');
const { Piano } = require("./MioPiano");
const { controllaEvento } = require("./Eventi");
const { prendiMappa } = require("./Mappa");
const { prendiLuogo } = require("./Luogo");

//gestione della sessione
app.use(expressSession({
    secret: 'Frafeffo',
    resave: false,
    saveUninitialized: false
}));

app.use(function(req,res,next) {
    res.locals.session = req.session;
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api-docs',swaggerUI.serve ,swaggerUI.setup(swaggerDocument));

var apiController = require('./apiService');
app.use('/api', apiController);

//permette di usare file statici come css e javascript 
app.use(express.static('static'));
app.set('views', __dirname + '/views');

var port = process.env.PORT;

//variabili per facebook
var FBappId = process.env.APPIDFB;
var FBlogin = "https://www.facebook.com/v7.0/dialog/oauth?client_id="+FBappId+"&auth_type=rerequest&scope=user_photos,pages_manage_posts,pages_read_engagement&redirect_uri=http://localhost:4000/token";
var FBsecretKey = process.env.SECRETKEYFB;

//variabili per google
var GGappId= process.env.APPIDGG;
var GGsecretKey = process.env.SECRETKEYGG;
var scopeCal='https://www.googleapis.com/auth/calendar';
var scopeCal2="https://www.googleapis.com/auth/calendar.events";
var GGlogin="https://accounts.google.com/o/oauth2/v2/auth?client_id="+GGappId+"&scope="+scopeCal+" "+scopeCal2+"&response_type=code&redirect_uri=http://localhost:4000/tokenGG";

app.get('/', function(req, res) {
    res.render('Accedi.ejs',{accessoFb: "Entra con Facebook", accessoGG: "Entra con Google",errore:""});
});
app.get('/Home', function(req, res) {
    request({
        url: "https://graph.facebook.com/me?fields=id,first_name,last_name,picture&access_token="+req.session.FBtoken,
        method: 'GET',
    }, function(error,response,body){
        if(error){
            console.log(error);
        } else{
            var info=JSON.parse(body);
            req.session.nome=info.first_name;
            req.session.cognome=info.last_name;
            req.session.foto_profilo=info.picture.data.url;
            req.session.id_client=info.id;
            console.log("Ottenuti dati utente!");
            console.log("L'id dell'utente è: "+req.session.id_client);
            res.render('Home.ejs',{notfound:'', Nome:  req.session.nome, Cognome: req.session.cognome, Foto: req.session.foto_profilo});
        }
    })
});
app.get('/Contattaci', function(req, res) {
    res.render('Contattaci.ejs',{ NomeProfilo:  req.session.nome, Cognome: req.session.cognome, FotoProfilo: req.session.foto_profilo});
});
app.get('/post',function(req,res){
    res.render('post.ejs',{appId:process.env.APPIDFB});
})
app.get('/Chi_siamo', function(req, res) {
    var names = 'franco';
    res.render('Chi_siamo.ejs', { Nome:  req.session.nome, Cognome: req.session.cognome, Foto: req.session.foto_profilo});
});
app.get('/FAQ', function(req, res) {
    res.render('FAQ.ejs',{Nome:  req.session.nome, Cognome: req.session.cognome, Foto: req.session.foto_profilo});
});

//gestion login google
app.get("/loginGG", function(req, res){
    if(req.session.GGtoken==null)
        res.redirect(GGlogin);
    else
    {
        if(req.session.FBtoken!=null)
            res.redirect('/Home');
        res.render('Accedi.ejs',{accessoFb: "Entra con Facebook",accessoGG: "Accesso Effettuato", errore:"",});
    }
});
//èrendiamo token google
app.get("/tokenGG", function(req, res){
    //andato a buon fine
    if (req.query.code){
        var autcode=req.query.code;
        request({
            url: "https://oauth2.googleapis.com/token?client_id="+GGappId+"&client_secret="+GGsecretKey+"&code="+autcode+"&redirect_uri=http://localhost:4000/tokenGG&grant_type=authorization_code",
            method: 'POST',
        },function(error, response, body){
            if(error) {
                console.log("ERRORE: Fallita la richiesta del token google: "+errore);
            }
            else{
                var info=JSON.parse(body);
                if(info.scope.length<1)
                {
                    //non ha garantito tutti i permessi
                    console.log('Per accedere al servizio è necessario autorizzare tutti i permessi richiesti!');
                    req.session.GGtoken=null; 
                    if(req.session.FBtoken==null)
                        res.render('Accedi.ejs',{accessoFb: "Entra con Facebook", accessoGG: "Entra con Google", errore:"ERRORE: sono necessari tutti i permessi richiesti"});
                    else
                        res.render('Accedi.ejs',{accessoFb: "Accesso Effettuato", accessoGG: "Entra con Google", errore:"ERRORE: sono necessari tutti i permessi richiesti"});
                }
                else{
                    req.session.GGtoken = info.access_token;
                    console.log("Permessi garantiti");
                    if(req.session.FBtoken!=null)
                        res.redirect('/Home');
                    else
                        res.render('Accedi.ejs',{accessoFb: "Entra con Facebook", accessoGG: "Accesso Effettuato",errore:""});
                }
            }
        });            
    }
    else{
        req.session.GGtoken=null;
        console.log("Annullato o Errore\n");
        if(req.session.FBtoken==null)
            res.render('Accedi.ejs',{accessoFb: "Entra con Facebook", accessoGG: "Entra con Google", errore:""});
        else
            res.render('Accedi.ejs',{accessoFb: "Accesso Effettuato", accessoGG: "Entra con Google", errore:""});
    }
});

//gestione login facebook
app.get("/loginFB", function(req, res){
    if(req.session.FBtoken==null)
        res.redirect(FBlogin);
    else
    {
        if(req.session.GGtoken!=null)
            res.redirect('/Home');
        res.render('Accedi.ejs',{accessoFb: "Accesso Effettuato", accessoGG: "Entra con Google",errore:""});
    }
});
//ottengo token da facebook
app.get("/token", function(req, res){
    // Ottengo il codice (OAUTH FB) dalla querystring
    if (req.query.code)  //!=null se clicco OK
	{
        request({
            url: "https://graph.facebook.com/v7.0/oauth/access_token?client_id="+FBappId+"&redirect_uri=http://localhost:4000/token&client_secret="+FBsecretKey+"&code="+req.query.code, //URL to hit
            method: 'GET',
        }, function(error, response, body){
            if(error) {
                console.log("ERRORE: Fallita la richiesta del token facebook: "+errore);
            } else {
                req.session.FBtoken = JSON.parse(body).access_token;
                console.log(req.session.FBtoken);
                console.log("Ottenuto il token per il cliente\n");

                //Verifico che mi ha garantito tutti i permessi
                request({
                    url: "https://graph.facebook.com/me/permissions?access_token="+req.session.FBtoken,
                    method: 'GET',
                }, function(error, response, body) {
                    if(error)
                        console.log("Errore: non sono riuscito a verificare i permessi");
                    else 
                    {   
                        var data = JSON.parse(body).data;//numero di permessi che ho dato
                        var count=0;
                        if(data!=undefined){
                            for(i=0;i<data.length;i++){
                                if(data[i].status!="declined"){
                                    count++;
                                } 
                            }
                        }
                        console.log(count);
                        if(data!=undefined && count<4){//se permessi insufficenti bisogna rifare l autorizzazione
                            console.log('Per accedere al servizio è necessario autorizzare tutti i permessi richiesti!');
                            req.session.FBtoken=null;
                            if(req.session.GGtoken==null)
                                res.render('Accedi.ejs',{accessoFb: "Entra con Facebook", accessoGG: "Entra con Google", errore:"ERRORE: sono necessari tutti i permessi richiesti"});
                            else
                                res.render('Accedi.ejs',{accessoFb: "Entra con Facebook", accessoGG: "Accesso Effettuato", errore:"ERRORE: sono necessari tutti i permessi richiesti"});
                        }
                        else{
                            console.log("Permessi garantiti");//andato a buon fine
                            if(req.session.GGtoken!=null)
                                res.redirect('/Home');
                            else
                                res.render('Accedi.ejs',{accessoFb: "Accesso Effettuato", accessoGG: "Entra con Google",errore:""});
                        }    
                    }
                });
            }
        });
	}
	else
	{
        req.session.FBtoken=null;
        console.log("Annullato o Errore\n");
        if(req.session.GGtoken==null)
            res.render('Accedi.ejs',{accessoFb: "Entra con Facebook", accessoGG: "Entra con Google", errore:""});
        else
            res.render('Accedi.ejs',{accessoFb: "Entra con Facebook", accessoGG: "Accesso Effettuato", errore:""});
	}
});

//condividi creando un post recensendo il luogo
app.get('/postFB',function(req,res){
    request({
        url: "https://graph.facebook.com/{page-id}/feed??message=Hello Fans!&access_token="+req.session.FBtoken,
        method: 'POST',
    }, function(error, response, body){
        if(error) {
            console.log("ERRORE: Fallita prova di creazione post "+errore);
        } else {
            console.log("Creato post FB\n");
        }
    });
});

//gestione delle pagine mappa e luogo
app.post('/Mappa',function(req,res){
    prendiMappa(req,res);
});

app.get('/Luogo',function(req,res){
    prendiLuogo(req,res);
});

//aggiungiamo l evento su google calendar e nel database dell utente
app.post('/AggiungiEvento',function(req,res){
    controllaEvento(res,req,req.session.GGtoken,req.query.luogo,req.query.Aperto,req.query.Sito,req.query.PhotoReference,req.query.Rating,req.query.Telefono,req.query.Via,req.body.giorno+'T'+req.body.orario+':00+'+'02:00','Europe/Rome',req.query.ApiFoto,req.query.lat,req.query.lon);
});

//prendiamo i piani dal database 
app.get("/miopiano",function(req,res){
    Piano(req,res);
});


//resetta tutte variabili di sessioni ed esce
app.get('/logout',function(req,res){
    req.session.id_client=null;
    req.session.GGtoken=null;
    req.session.FBtoken=null;
    req.session.nome=null; 
    req.session.cognome=null, 
    req.session.foto_profilo=null;
    res.render('Accedi.ejs',{accessoFb: "Entra con Facebook", accessoGG: "Entra con Google", errore:""});
});


//server in ascolto sulla porta 4000
app.listen(port, function() {
    console.log("Server in ascolto sulla porta: %s", port);
});