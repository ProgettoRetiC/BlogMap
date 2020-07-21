# BlogMap

## Scopo del progetto
BlogMap è un applicazione web, nata come idea per semplificare la ricerca dei migliori punti d'interesse accanto a te, ed è stato progettato in modo da essere semplice ed intuitivo per permettere di compiere la scelta più efficente dei locali nelle vicinanze.

Il suo design intuitivo lo rende facilmente utilizzabile ed accessibile ad ogni fascia d'età. BlogMap, inoltre, ordina efficentemente i luoghi desiderati per rating, così permettendo una ricerca rapida volta a snellire le numerose azioni che sarebbero normalmente richeste usando altri siti.Inoltre essendo integrato con google calendar permette di aggiungere a proprio piacimento i luoghi che si vogliono visitare.

## Tecnologie utilizzate
BlogMap è diviso in due moduli: il back-end scritto in Node si occupa di gestire i dati, mentre il front-end scritto in ejs si occupa della visualizzazione.

Il back-end usa richieste HTTP secondo il paradigma REST per comunicare con Google Places da cui legge i dati relativi alle specifiche immesse dall utente.Tramite AMQP utilizzato per rendere piu efficiente la ricerca ,restituisce i risultati ottenuti gestendo le diverse richieste da piu utenti.Da qui l'utente potrà inserire su google calendar degli eventi relativamente al luogo assegnato ,questo tramite l utilizzo di un token preso nella pagina iniziale di accesso dove l utente dovrà autenticarsi sia con google che con Facebook.Inoltre sempre grazie a questa autenticazione l utente potrà condividere con i suoi amici di Facebook la relativa notizia.
Gli eventi creati dall utente inoltre saranno salvati in un database(nel nostro caso couch-db istanziato su docker) in modo da poter vedere la propria pianificazione con l'orario,il posto e altre informazioni.

Il front-end è si avvale di diversi file ejs per rendere dinamica le pagina HTML,inoltre tramite file javascript,bootsrap e stili css rendiamo la visulazzazione delle pagine confortevole e intuitiva e dinamica.Per usufruire della mappa di leaflet usiamo anche css presi da cnd server.

BlogMap utilizza : 
* NodeJS : I/O ad eventi per la gestione del back end 
* Maps : Leaflet per fornire una visualizzazione su mappa dei luoghi trovati 
* Calendar : Google Calendar per inserire o visualizzare eventi 
* Facebook : Per autenticare l utente e condividere luoghi 
* RabbitMQ : Protocollo di messaging per la gestione richieste utente 
* CouchDB : Database dove salviamo le pianificazioni degli utenti 
* Swagger : Per fornire le nostre API 

## Installazione
Per installare BlogMap è necessario clonare la repository e installare RabbitMQ e Couch-DB o usare container
```sh
$ git clone https://github.com/ProgettoRetiC/BlogMap.git 
$ npm install 
```

## Come eseguire l applicazione
Per eseguire BlogMap eseguire il comando:
```sh
$ npm start
```
Se si è su una piattaforma windows è necessario avviare separatamente il serverRPC:
```sh
$ node ./serverRPC.js
```
## Test
I test sono stati effettuati sulle funzioni di interazione con il database. Sono state testate le seguenti funzionalità:

* aggiornamento database di un utente
* prendere pianificazione di un utente

I test sono stati svolti grazie al modulo Jest

Per eseguire i test:
```sh
$ npm run test
```
## API REST
Forniamo le seguenti API:
```sh
 GET /api/pianificazione/{clientId} 
```
ritorna la pianificazione dell utente
```sh
 GET /api/mappa/{indirizzo}/{citta}/{categoria}/{type}/{sorting} 
```
ritorna i luoghi risultati dalla ricerca effettuata con le relative specifiche passate\
Per una documentazione completa e per effetuare test andare su http://localhost:4000/api-docs
