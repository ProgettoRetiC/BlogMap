const db = require("./database");
const mp = require("./Mappa");
const express = require('express');
const request = require('request');
const bodyparser = require('body-parser');
const session = require('express-session');
require('dotenv').config();
var router = express.Router();


//Ritorna la pianificazione dell utente
router.get("/pianificazione/:clientId",  (req,res) => {
    db.prendiDBApi(req).then((resp) => res.send(resp)).catch((resp) => res.send(resp))
})

//Ritorna i 5 posti migliori
router.get("/mappa/:indirizzo/:citta/:categoria/:type/:sorting", (req,res) => {
    console.log(req.params);
    mp.prendiMappaApi(req).then((resp) => res.send(resp)).catch((resp) => res.send(resp))
})


module.exports = router;