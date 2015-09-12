var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var people = db.get('people');
var addresses = db.get('addresses');

/* GET users listing. */
router.get('/', function(req, res, next) {
  people.find({}, function(err, docs) {
    if (err) throw err;
    res.render('people/index.hbs', {people: docs});
  });
});

router.post('/', function(req, res, next) {
  var errors = []
  if (!req.body.phone) {
    errors.push("You must enter a phone")
  }
  if (!req.body.address) {
    errors.push("Address can't be blank")
  }
  if (errors.length) {
    console.log(req.body);
    res.render('people/new', {
      errors: errors
    })
  } else {
    console.log(req.body);
    people.insert(req.body, function (err, doc) {
      if (err) throw err;
      res.redirect('people');
    });
  }
});

router.get('/new', function (req, res, next) {
  res.render('people/new.hbs');
});

router.get('/:id', function (req, res, next) {
  people.findOne({_id: req.params.id}, function (err, doc) {
    addresses.find({personId: req.params.id}, function (err, docs) {
      res.render('people/show.hbs', {person: doc, addresses: docs});
    });
  });
});

router.get('/:id/edit', function (req, res, next) {
  people.findOne({_id: req.params.id}, function (err, doc) {
    addresses.find({personId: req.params.id}, function (err, docs) {
      if (err) throw err;
      res.render('people/edit.hbs', {person: doc, addresses: docs});
    });
  });
});

router.post('/:id/update', function (req, res, next) {
  people.findOne({_id: req.params.id}, function (err, doc) {
    if (err) throw err;
    people.update(doc, req.body, function (err, doc) {
      if (err) throw err;
      res.redirect('/people/' + req.params.id);
    })
  })
})

router.post('/:id/delete', function (req, res, next) {
  addresses.remove({personId: req.params.id}, function (err, docs) {
    if (err) throw err;
    people.remove({_id: req.params.id}, function (err, doc) {
      if (err) throw err;
      res.redirect('/people');
    });
  });
});

module.exports = router;
