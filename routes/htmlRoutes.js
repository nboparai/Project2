require("dotenv").config();
let request = require("request");
var db = require("../models");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    // db.Example.findAll({}).then(function(dbExamples) {
    res.render("index", {
      msg: "Welcome!",
      // examples: dbExamples
    });
  });

  app.get("/signin", function (req, res) {
    res.render("signin");
  });

  app.get("/signup", function (req, res) {
    res.render("signup");
  });
  // });

 /* app.get("/home/:id/:firstName", function(req, res) {
      // console.log(req, "this should be the user");
    
    res.render("home",{id: req.params.id, firstName:req.params.firstName});*/

  app.get("/home/:id/:firstName", function (req, res) {
    let id = req.params.id;
    db.User.findOne({ where: { id: id } }).then(function (user) {
      res.render("home", {
        user: user
      });
    });
  });

  app.get("/location/:id/:name/:address", function (req, res) {
    regexStep1 = req.params.name.replace(/'/g, '%27');
    regexStep2 = regexStep1.replace(/#/g, '%23');
    regexStep3 = regexStep2.replace(/&/g, '%26');
    regexStep4 = regexStep3.replace(/ /g, '%20');
    let name = regexStep4;
    let address = req.params.address;
    let id = req.params.id;
    console.log(name);
    console.log(address);
    request(`https://data.cityofchicago.org/resource/cwig-ma7x.json?dba_name=${name}&address=${address}%20&$order=inspection_date DESC&$$app_token=${process.env.chicagoAPI}`, function (err, response, body) {
      if (!err && response.statusCode === 200) {
        locationInfo = JSON.parse(body);
        console.log(locationInfo);
        db.User.findOne({ where: { id: id } }).then(function (user) {
          res.render("location", {
            locations: locationInfo,
            user: user
          });
        });
      }
      else {
        console.log(err);
      }
    }); 

  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function (req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function (dbExample) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  app.get("/favorites/:id/:firstName", function (req, res) {
    let  id = req.params.id;
    db.Favorite.findAll({ where: { userNum: req.params.id } }).then(function (favs) {
      db.User.findOne({ where: { id: id } }).then(function (user) {
        res.render("favorites", {
          favorites: favs,
          user: user
        });
      });
    });
  });


  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });


};
