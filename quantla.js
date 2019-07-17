var inquirer = require('inquirer');
var fs = require('fs');
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
var Fundamentals = require("./checkFundamentals");
var Prices = require("./checkPrices");
var News = require("./checkNews");

require('./tools.js')();

apikey = grabmykey();
console.log('\033[2J');

var admin = require("firebase-admin");

var serviceAccount = require("./quantla-firebase-adminsdk-o0jvh-e71456c4b6.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://quantla.firebaseio.com"
});

let db = admin.firestore();



inquirer
    .prompt([
        {
            type: 'list',
            name: 'selection',
            message: 'What do you want to do?',
            choices: [
                'Check News',
                'Check Prices',
                'Check Fundamentals'
            ]
        },
        {
            when: function (response) {
                if (response.selection == 'Check Prices')
                    return true;
            },
            type: 'list',
            name: 'runPrice',
            message: 'Display trend analysis (buy and sell points)?',
            choices: [
                'No',
                'Yes'
            ]
        },
        {
            when: function (response) {
                if (response.selection == 'Check Fundamentals')
                    return true;
            },
            type: 'list',
            name: 'runPrice',
            message: 'What key market fundamentals do you want to check?',
            choices: [
                'US Sector Performance (realtime)',
                'Blockchain data',
                'Mining data',
                'Pool data - who owns bitcoin!'
            ]
        }
    ])
    .then(answers => {


        fs.appendFile("log.txt", "What do you want to do?: {" + answers.selection + "}\n", function (err) {
            if (err) throw err;
        })


        switch (answers.selection) {
            case 'Check News':
                var news = new News();

                news.checkNews.then(function (result) {
                    // "Stuff worked!", now process each article obj
                    result.forEach(function (newsData) {
                        db.collection('news').doc(newsData.date).set(newsData);
                        console.log(newsData)
                    }
                    );
                }, function (err) {
                    console.log(err); // Error: "It broke"

                });

                break;

            case 'Check Prices':
                var prices = new Prices();
                prices.checkPrices(answers.company, answers.runPrice);
                break;

            case 'Check Fundamentals':
                var fundamentals = new Fundamentals();
                fundamentals.checkFundamentals(answers.runPrice);
                break;

            default:
                text = "I don't even know how you got here! That is definetly a bug...";
        }
    });
//
