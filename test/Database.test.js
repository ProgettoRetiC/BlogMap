const db = require('../database');


test('Verifica ottenimento documenti dal database', (done) => {
  id="a1973861559414420";
  return db.prendiDB(id).then( () => {
    done();
  }).catch( (err) => { done(err) });
});

test('Verifica aggiornamento database', (done) => {
  id= "a1973861559414420";
  var piano={
    luogo:"AveBirra",
    rating: "4.7",
    lat:"41.9092777",
    lon: "12.5245977",
    via:"Via Arduino, 3, Roma",
    photoreference:"CmRaAAAAUG-lg8E8ibOmWnc6uHDbQgNULtLKPCdN1aROOH9GCx9FiHweqMEd0ToQhDfjprBim1TSpwg7VnQIDxDS8VI_En5ZxzRdgu3U2k8uQq5g-vZMK9JPkzZXPhNy6N53_DBNEhC6r7eq4E9F5FSWMPIHJcyVGhRoO7OwE0wEPebiH0qtisEHG5At2w",
    telefono:"371 155 2808",
    sito:"https://www.instagram.com/avebirra/",
    data:"2020-07-22T23:35:00+02:00"
  }
  return db.aggiornaDB(id,piano).then( (resp) => {
    expect(resp).toBe('success');
  }).catch( (err) => { done(err) });
});

