var colors = require('colors');
var convert = require('xml-js');
var Promise = require("bluebird");
var request = Promise.promisifyAll(require("request"), { multiArgs: true });
var fs = require('fs');

var News = function () {
    this.checkNews = function (company, runSentiment) {
        fs.appendFile("log.txt", "What 'coin' do you need?: {" + company + "}\n", function (err) {
            if (err) throw err;
        })

        fs.appendFile("log.txt", "Run IBM Watson sentiment analysis?: {" + runSentiment + "}\n", function (err) {
            if (err) throw err;
        })

        var queryURL = 'https://news.google.com/rss/search?q=' + company + '+ news&hl=en-US&gl=US&ceid=US:en';

        request(queryURL, { json: true }, function (error, response, body) {

            fs.appendFile("log.txt", "Response: " + JSON.stringify(response).replace(grabmykey(), "*************").replace(grabmykey(), "*************").replace(grabmykey(), "*************").replace(grabmykey(), "*************") + "\n", function (err) {
                if (err) throw err;

                fs.appendFile("log.txt", "--------------------------------------------\n", function (err) {
                    if (err) throw err;
                })

            })

            var results = JSON.parse(convert.xml2json(body, { compact: true, spaces: 4 }));
            // console.log(results.rss.channel.item[0]);

            count = 0;
            found_news = 5;

            // console.log(body.items[0].link);
            console.log(colors.inverse("Here are some recent news that you may be interested:"));

            for (var i = 0; i < found_news; i++) {

                // var sentiment = new Sentiment();
                // var result = sentiment.analyze(results.rss.channel.item[0].title._text + results.rss.channel.item[0].description._text);
                // console.log(body.items[i].title);

                if (runSentiment == "Yes") {
                    var options = {
                        url: 'https://cors-anywhere.herokuapp.com/https://natural-language-understanding-demo.ng.bluemix.net/api/analyze',
                        method: 'post',
                        contentType: 'application/json',
                        body: {
                            features: { concepts: {}, entities: {}, keywords: {}, categories: {}, emotion: {}, sentiment: {}, semantic_roles: {}, syntax: { tokens: { lemma: true, part_of_speech: true }, sentences: true } },
                            url: results.rss.channel.item[i].link._text
                        },
                        headers: {
                            'origin': 'https://cors-anywhere.herokuapp.com/https://natural-language-understanding-demo.ng.bluemix.net/api/analyze',
                            'mydate': results.rss.channel.item[i].pubDate._text
                        },
                        json: true
                    }


                    request(options, function (err, res, watsondata) {


                        fs.appendFile("log.txt", "IBM Response: " + JSON.stringify(res).replace(grabmykey(), "*************").replace(grabmykey(), "*************").replace(grabmykey(), "*************").replace(grabmykey(), "*************") + "\n", function (err) {
                            if (err) throw err;

                            fs.appendFile("log.txt", "--------------------------------------------\n", function (err) {
                                if (err) throw err;
                            })

                        })

                        if (watsondata.results != undefined) {
                            if (watsondata.results.sentiment.document.label != 'negative') {
                                console.log(colors.bold("     " + count + ": ") + colors.gray(watsondata.results.retrieved_url));
                                console.log(colors.gray("        " + res.request.headers.mydate));
                                console.log(colors.green("        >> positive: " + watsondata.results.sentiment.document.score));

                            }
                            else {
                                console.log(colors.bold("     " + count + ": ") + colors.gray(watsondata.results.retrieved_url));
                                console.log(colors.gray("        " + res.request.headers.mydate));
                                console.log(colors.red("        >> negative: " + watsondata.results.sentiment.document.score));

                            }
                            count++;
                        }
                    });

                }
                else {
                    console.log(colors.bold("     " + count + ": ") + colors.gray(results.rss.channel.item[i].link._text));
                    console.log(colors.gray("        " + results.rss.channel.item[i].pubDate._text));
                    count++;

                }

                ;
            };

        });
    }
}

module.exports = News;