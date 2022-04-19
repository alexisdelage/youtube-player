const mongoose = require('mongoose');
const express = require('express');

// connect to database
mongoose.connect('mongodb+srv://admin:admin@cluster0.erfky.mongodb.net/youtubePlayer');
// define schemas
const historySchema = new mongoose.Schema({
  url: String,
  date: Date
});
const bookmarkSchema = new mongoose.Schema({
  url: String
});
// define models
const History = mongoose.model('History', historySchema);
const Bookmark = mongoose.model('Bookmark', bookmarkSchema);


const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.listen(8000, () => console.log("Server started!"));

/**
 * GET history
 * Returns the list of all History objects
 */
app.get("/api/history", async (req, res) => {
    const historyList = await History.find().sort({ date: -1 });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(historyList));
});

/**
 * GET bookmarks
 * Returns the list of all bookmarks
 */
app.get("/api/bookmark", async (req, res) => {
  const bookmarksList = await Bookmark.find();
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(bookmarksList));
});


/**
 * Return a boolean which indicates if an url is already registered
 * as a bookmark or not
 */
app.post("/api/bookmark/check", async (req, res) => {
  const videoUrl = req.body.url;
  const bookmarks = await Bookmark.find({url: videoUrl});
  const bookmarkExists = bookmarks.length == 0 ? false : true;
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(bookmarkExists));
});


/**
 * POST history
 * From a url given in POST details, save it as a History object in database
 */
app.post("/api/history", async (req, res) => {
  const videoUrl = req.body.url;
  const now = Date.now();
  let success;
  // we check if there is already the video in the database
  const sameVideos = await History.find({url: videoUrl});
  if (sameVideos.length == 0) {
    // if video is not in database, then add it
    const video = new History({
      url: videoUrl,
      date: now
    });
    success = await video.save()
      .then(() => true)
      .catch(() => false);
  } else {
    // if video is already in database, then update its date to now
    success = await History.updateOne(
      { url: videoUrl },
      { date: now },
      (err, res) => {if (err) console.log(err)}
    ).clone()
      .then(() => true)
      .catch(() => false);
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(success));
});


/**
 * POST bookmark
 * From a url given in POST details, save it as a Bookmark object in database
 */
app.post("/api/bookmark", async (req, res) => {
  const videoUrl = req.body.url;
  let success;
  // check if bookmark already registered
  const sameBookmarks = await Bookmark.find({url: videoUrl});
  if (sameBookmarks.length == 0) {
    const video = new Bookmark({
      url: videoUrl
    })
    success = await video.save()
      .then(() => true)
      .catch(() => false);
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(success));
})

/**
 * DELETE bookmarks
 * From a url given in POST details, delete the corresponding object in database
 */
app.delete("/api/bookmark", async (req, res) => {
  const videoUrl = req.body.url;
  let success = await Bookmark.deleteOne(
    { url: videoUrl },
    (err) => {if (err) console.log(err)}
  ).clone()
    .then(() => true)
    .catch(() => false);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(success));
})


