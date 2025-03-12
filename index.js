require('dotenv').config();
var mongoClient = require("mongodb").MongoClient;
var express = require("express");
var cors = require("cors");
var app = express();

// Configure CORS with allowed methods
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Use the DB_URI from the .env file
var mongoString = process.env.DB_URI || 'mongodb://127.0.0.1:27017';
let database;

// Connect to MongoDB using the DB_URI from the .env
mongoClient.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log("Connected to database");
        database = client.db("videodb");
    })
    .catch(err => {
        console.error("Error connecting to the database", err);
    });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use the PORT from the .env file or default to 5050
var port = process.env.PORT || 5050;

// Start the server





app.get("/get-admin", (req, res) => {


    database.collection("admin").find({}).toArray().then(document => {
        res.send(document);
        res.end();
    })


})

app.get("/get-user", (req, res) => {



    database.collection("users").find({}).toArray().then(document => {
        res.send(document);
        res.end();

    })


})
app.get("/get-categories", (req, res) => {



    database.collection("category").find({}).toArray().then(document => {
        res.send(document);
        res.end();
    })


})

app.get("/get-videos", (req, res) => {


    database.collection("videos").find({}).toArray().then(document => {
        res.send(document)
        res.end();
    })


})
app.get("/get-video/:id", (req, res) => {

    database.collection("videos").find({ VideoId: parseInt(req.params.id) }).toArray().then(document => {
        res.send(document)

        res.end();
    })


})
app.get("/get-user/:userid", (req, res) => {



    database.collection("users").find({ userid: req.params.userid }).toArray().then(document => {
        res.send(document);
        res.end()
    })


})
app.get("/get-interactions", (req, res) => {



    database.collection("interactions").find({}).toArray().then(document => {
        res.send(document);
        res.end()
    })


})
app.get("/get-videoby-title/:title", (req, res) => {



    database.collection("videos").find({ Title: req.params.title }).toArray().then(document => {
        res.send(document);
        res.end()
    })


})
app.get("/get-likedvideos/:userid", (req, res) => {




    database.collection("interactions").find({
        $and: [{ UserId: req.params.userid }, {
            Liked: true
        }]
    }).toArray().then(Likedvideos => {

        if (Likedvideos) {
            const videoIds = Likedvideos.map((video) => video.VideoId);



            if (videoIds.length === 0) {
                res.json([]); // No liked videos found
                res.end();
                return;
            }
            database.collection("videos").find({
                VideoId: { $in: videoIds }
            }).toArray().then(document => {
                res.send(document);

                res.end();
            })
        }

    })


})


app.get("/get-watchlater-videos/:userid", (req, res) => {




    database.collection("interactions").find({
        $and: [{ UserId: req.params.userid }, {
            WatchLater: true
        }]
    }).toArray().then(Likedvideos => {

        if (Likedvideos) {
            const videoIds = Likedvideos.map((video) => video.VideoId);



            if (videoIds.length === 0) {
                res.json([]); // No liked videos found
                res.end();
                return;
            }
            database.collection("videos").find({
                VideoId: { $in: videoIds }
            }).toArray().then(document => {
                res.send(document);

                res.end();
            })
        }

    })


})
app.get("/get-history/:userid", (req, res) => {




    database.collection("interactions").find({
        $and: [{ UserId: req.params.userid }, {
            Viewed: true
        }]
    }).toArray().then(Likedvideos => {

        if (Likedvideos) {
            const videoIds = Likedvideos.map((video) => video.VideoId);



            if (videoIds.length === 0) {
                res.json([]); // No liked videos found
                res.end();
                return;
            }
            database.collection("videos").find({
                VideoId: { $in: videoIds }
            }).toArray().then(document => {
                res.send(document);

                res.end();
            })
        }

    })


})
app.get("/filter-category/:categoryid", (req, res) => {
    let id = parseInt(req.params.categoryid);
    if (id == 0) {

        database.collection("videos").find({}).toArray().then(document => {

            res.send(document);
            res.end();
        })

    }
    else {

        database.collection("videos").find({ CategoryId: parseInt(req.params.categoryid) }).toArray().then(document => {

            res.send(document);
            res.end();
        })

    }



})

app.post("/register-user", (req, res) => {

    var user = {
        UserId: req.body.UserId,
        UserName: req.body.UserName,
        Password: req.body.Password,
        Email: req.body.Email,
        Mobile: req.body.Mobile
    }


    database.collection("users").insertOne(user).then(() => {

        res.end();
    })

})
app.post("/add-category", (req, res) => {

    var category = {
        CategoryId: parseInt(req.body.CategoryId),
        CategoryName: req.body.CategoryName
    }

    database.collection("category").insertOne(category).then(() => {

        res.end();
    })

})

app.post("/add-video", (req, res) => {
    var video = {

        VideoId: parseInt(req.body.VideoID),
        Title: req.body.Title,
        Url: req.body.Url,
        Description: req.body.Description,
        Likes: parseInt(req.body.Likes),
        Dislikes: parseInt(req.body.Dislikes),
        Views: parseInt(req.body.Views),
        CategoryId: parseInt(req.body.CategoryId),
        Comments: req.body.Comments
    }


    database.collection("videos").insertOne(video).then(() => {

        res.end();
    })

})
app.post("/add-interaction", (req, res) => {

    var interaction = {
        VideoId: parseInt(req.body.VideoId),
        UserId: req.body.UserId,
        Viewed: req.body.Viewed,
        Liked: req.body.Liked,
        Disliked: req.body.Disliked,
        WatchLater: req.body.WatchLater
    }
    console.log(interaction);


    database.collection("interactions").insertOne(interaction).then(() => {

    })


})
app.put("/edit-video/:videoid", (req, res) => {

    var video = {
        VideoId: parseInt(req.body.VideoId),
        Title: req.body.Title,
        Url: req.body.Url,
        Description: req.body.Description,
        Likes: parseInt(req.body.Likes),
        Dislikes: parseInt(req.body.Dislikes),
        Views: parseInt(req.body.Views),
        CategoryId: parseInt(req.body.CategoryId),
        Comments: req.body.Comments

    }


    database.collection("videos").updateOne({ VideoId: parseInt(req.params.videoid) }, { $set: video }).then(() => {

        res.end();
    })

})
app.put("/edit-interaction-view/:videoid/:userid", (req, res) => {



    database.collection("interactions").updateOne(
        { VideoId: parseInt(req.params.videoid) }, { $set: { Viewed: true } }
    ).then(() => {

        res.end();
    })

})
app.put("/edit-interaction-watchlater/:videoid/:userid/:checkwatch", (req, res) => {

    var checkwatch = req.params.checkwatch;
   
    if (checkwatch == "true") {

        database.collection("interactions").updateOne(
            { $and: [{ VideoId: parseInt(req.params.videoid) }, { UserId: req.params.userid }] }, {
            $set: { WatchLater: true }
        }
        ).then(() => {

            res.end();
        })

    } else {

        database.collection("interactions").updateOne(
            { $and: [{ VideoId: parseInt(req.params.videoid) }, { UserId: req.params.userid }] }, {
            $set: { WatchLater: false }
        }
        ).then(() => {

            res.end();
        })

    }

})
app.put("/viewed/:videoid", (req, res) => {




    database.collection("videos").updateOne(
        { VideoId: parseInt(req.params.videoid) }, { $inc: { Views: 1 } }
    ).then(() => {

        res.end();
    })

})
app.put("/liked/:videoid", (req, res) => {

    var videoid = parseInt(req.params.videoid);
   


    database.collection("videos").updateOne(
        { VideoId: videoid }, { $inc: { Likes: 1 } }
    ).then(() => {
      
        res.end();
    })

})
app.put("/disliked/:videoid", (req, res) => {




    database.collection("videos").updateOne(
        { VideoId: parseInt(req.params.videoid) }, { $inc: { Likes: -1 } }

    ).then(() => {
        
        res.end();
    })

})
app.put("/edit-interaction-like/:videoid/:userid", (req, res) => {




    database.collection("interactions").updateOne(
        {
            $and: [{ VideoId: parseInt(req.params.videoid) }, { UserId: req.params.userid }],

        }, {
        $set: { Liked: true }
    }

    ).then(() => {

        res.end();
    })

})
app.put("/edit-interaction-dislike/:videoid/:userid", (req, res) => {




    database.collection("interactions").updateOne(
        {
            $and: [{ VideoId: parseInt(req.params.videoid) }, { UserId: req.params.userid }],

        }, {
        $set: { Liked: false }
    }

    ).then(() => {

        res.end();
    })

})
app.put("/add-comment", (req, res) => {

    var data = {
        VideoId: parseInt(req.body.VideoId),
        UserId: req.body.UserId,
        Comments: req.body.Comments
    }



    database.collection("videos").updateOne(
        {
            VideoId: data.VideoId
        }
        , {
            $push: { Comments: data }
        }

    ).then(() => {

       
        res.end();
    })

})

app.delete("/delete-video/:videoid", (req, res) => {



    database.collection("videos").deleteOne({ VideoId: parseInt(req.params.videoid) }).then(() => {

        res.end();
    })

})

app.listen(port, () => {
   
});