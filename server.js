var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose"); 
const path = require('path');
var cheerio = require("cheerio");
var request = require('request');
var PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var exphbs = require('express-handlebars');

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var db = require("./models");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/scrape", function (req, res) {

    request("https://www.vox.com/world", function (error, response, html) {
        var $ = cheerio.load(html);
        $("h2.c-entry-box--compact__title").each(function (i, element) {

            var result = [];

            result.push({
                title: $(this).children("a").text(),
                link: $(this).children("a").attr("href"),
            });

            db.Article.create(result)
                .then(function (dbArticle) {
                })
                .catch(function (err) {
                    return res.json(err);
                });
        });        
        res.render("scraped");
        
    });


});

app.get("/saved-articles", function (req, res) {
    db.Article.find({ saved: true })
        .then(function (dbArticles) {
            console.log("my saved articles", dbArticles);
            res.render("saved-articles", {userSavedArticles: dbArticles});
        })
        .catch(function (err) {
            console.log(err)
            res.json(err);
        });
});


app.get("/all/saved-articles", function (req, res) {
    db.Article.find({ saved: true })
        .then(function (saved) {
            res.json(saved);
        }).catch(function (err) {
            console.log(err)
            res.json(err);
        })
});

app.post("/api/saved-articles", function (req, res) {

    console.log("req.body:", req.body);

    var parsedArticle = JSON.parse(req.body.articles);
    console.log("new parsed req.body: ", parsedArticle);

    for (var i = 0; i < parsedArticle.length; i++) {
        db.Article.findOneAndUpdate({ _id: parsedArticle[i].id }, { saved: true }, function (err) {

            if (err) {
                console.log("my error: ", err);
            }


            return res.status(500).send();
        }).then(function (savedArticles) {
            console.log(`Saved ids: ${savedArticles}`);

    
        })
            .catch(function (err) {
                console.log(err)
                res.json(err);
            });
    }

    res.json(req.body);
});

app.post("/saved-articles/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }, function (err) {
        if (err) {
            console.log(err);
        }
        return res.status(500).send();
    }).then(function(newtrue){
        console.log(newtrue);
    })
    return res.status(200).send();
});


app.delete("/api/saved-articles/:id", function (req, res) {

    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false }, function (err) {
        if (err) {
            console.log("my error: ", err);
        }
        return res.status(500).send();
    });
    return res.status(200).send();
});


app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});



app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});