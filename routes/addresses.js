var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var addresses = db.get('addresses');

router.post('/', function(req, res, next) {
  console.log(req.body);
  addresses.insert(req.body, function (err, doc) {
    if (err) throw err;
    res.redirect('/people/' + req.body.personId);
  });
});

// router.get('/:id/edit', function (req, res, next) {
//   people.findOne({_id: req.params.id}, function (err, doc) {
//     if (err) throw err;
//     res.render('people/edit.hbs', {person: doc})
//   });
// });

// router.post('/:id/update', function (req, res, next) {
//   people.findOne({_id: req.params.id}, function (err, doc) {
//     if (err) throw err;
//     people.update(doc, req.body, function (err, doc) {
//       if (err) throw err;
//       res.redirect('/people/' + req.params.id);
//     })
//   })
// })

router.post('/:id/delete', function (req, res, next) {
  addresses.remove({_id: req.params.id}, function (err, docs) {
    if (err) throw err;
    res.redirect('/people/' + req.body.personId);
  });
});

module.exports = router;
