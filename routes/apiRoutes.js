var db = require("../models");
const Op = db.Sequelize.Op;
require("../controller/controller.js")();

const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require("stripe")(keySecret);
const bodyParser = require("body-parser");

module.exports = function(app) {
  // Get news articles
  app.get("/api/news", function(req, res) {
    console.log(req.body.time);
    var datetime = Math.floor(new Date() / 1000);
    var hourprevious = datetime - 3600;
    db.News.findAll({
      attributes: ["dateCreated", "btcScore", "bitcoinScore", "documentScore"],
      where: {
        dateCreated: {
          [Op.between]: [hourprevious, datetime] // BETWEEN now AND an hour ago
        }
      }
    }).then(function(resultset) {
      var newsObjs = [];
      resultset.forEach(resultSetItem => {
        var newsObj = resultSetItem.get({
          plain: true
        });
        newsObjs.push(newsObj);
      });
      res.json(newsObjs);
    });
  });

  app.get("/api/prices", function(req, res) {
    var datetime = Math.floor(new Date() / 1000);
    var hourprevious = datetime - 3600;
    db.Prices.findAll({
      attributes: [
        "dateCreated",
        "currentPriceAsks",
        "currentPriceBids",
        "previousPrice",
        "tenMinPriceVariation",
        "currentVolume"
      ],
      where: {
        dateCreated: {
          [Op.between]: [hourprevious, datetime] // BETWEEN now AND an hour ago
        }
      }
    }).then(function(resultset) {
      var priceObjs = [];
      resultset.forEach(resultSetItem => {
        var priceObj = resultSetItem.get({
          plain: true
        });
        priceObjs.push(priceObj);
      });
      //console.log("prices from db: ");
      //console.log(priceObjs);
      res.json(priceObjs);
    });
  });

  app.get("/api/fundamentals", function(req, res) {
    var datetime = Math.floor(new Date() / 1000);
    var hourprevious = datetime - 3600;
    db.Fundamentals.findAll({
      attributes: [
        "dateCreated",
        "hashRate",
        "hashrateVariation",
        "transactionFee",
        "transactionFeeVariation",
        "costPerTransaction",
        "costPerTransactionVariation"
      ],
      where: {
        dateCreated: {
          [Op.between]: [hourprevious, datetime] // BETWEEN now AND an hour ago
        }
      }
    }).then(function(resultset) {
      var fundsObjs = [];
      resultset.forEach(resultSetItem => {
        var fundsObj = resultSetItem.get({
          plain: true
        });
        fundsObjs.push(fundsObj);
      });
      res.json(fundsObjs);
    });
  });

  app.get("/api/decisions", function(req, res) {
    var datetime = Math.floor(new Date() / 1000);
    var hourprevious = datetime - 3600;
    db.Decisions.findAll({
      attributes: [
        "dateCreated",
        "buyProb",
        "holdProb",
        "sellProb",
        "currentPrice",
        "aiDecision",
        "sellIfPrice",
        "buyIfPrice"
      ],
      where: {
        dateCreated: {
          [Op.between]: [hourprevious, datetime] // BETWEEN now AND an hour ago
        }
      }
    }).then(function(resultset) {
      var decisionObjs = [];
      resultset.forEach(resultSetItem => {
        var decisionObj = resultSetItem.get({
          plain: true
        });
        decisionObjs.push(decisionObj);
      });
      //console.log("decisions from db: ");
      // console.log(decisionObjs);
      res.json(decisionObjs);
    });
  });

  // Check for invite key in the database
  app.post("/api/inviteKeys", function(req, res) {
    console.log("key from front end", req.body.inviteString);
    db.Invite.findAll({
      where: { inviteString: req.body.inviteString }
    }).then(function(dbResponse) {
      console.log(dbResponse);
      res.json(dbResponse);
    });
  });
};
