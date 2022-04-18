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
 * GET bookamrks
 * Returns the list of all bookmarks
 */
app.get("/api/bookmark", async (req, res) => {
  const bookmarksList = await Bookmark.find();
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(bookmarksList));
});

/**
 * POST history
 * From a url given in POST details, save it as a History object in database
 */
app.post("/api/history", async (req, res) => {
  const videoUrl = req.body.url;
  const now = Date.now();
  // we check if there is already the video in the database
  const sameVideos = await History.find({url: videoUrl});
  if (sameVideos.length == 0) {
    // if video is not in database, then add it
    const video = new History({
      url: videoUrl,
      date: now
    });
    await video.save();
  } else {
    // if video is already in database, then update its date to now
    console.log(videoUrl, now);
    await History.updateOne(
      { url: videoUrl },
      { date: now },
      (err, res) => {if (err) console.log(err)}
    ).clone();
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({url: videoUrl, date: now}));
});

/**
 * POST bookmark
 * From a url given in POST details, save it as a Bookmark object in database
 */
app.post("/api/bookmark", async (req, res) => {
  const videoUrl = req.body.url;
  // check if bookmark already registered
  const sameBookmarks = await Bookmark.find({url: videoUrl});
  if (sameBookmarks.length == 0) {
    const video = new Bookmark({
      url: videoUrl
    })
    await video.save();
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({url: videoUrl}));
})

/**
 * DELETE bookmarks
 * From a url given in POST details, delete the corresponding object in database
 */
app.delete("/api/bookmark", async (req, res) => {
  const videoUrl = req.body.url;
  await Bookmark.deleteOne(
    { url: videoUrl },
    (err) => console.log(err)
  );
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({url: videoUrl}));
})
