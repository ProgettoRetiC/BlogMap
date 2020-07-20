const db = require('./database');


test('Verifica aggiornamento database', (done) => {
  req.session.id_client=1234567890;
  return db.aggiornaDB(req).then( () => {
    done();
  }).catch( (err) => { done(err) });
});
