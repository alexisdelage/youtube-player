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


app.get("/getHistoryList", async (req, res) => {
    const historyList = await History.find();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(historyList));
});


app.get("/getBookmarksList", async (req, res) => {
  const bookmarksList = await Bookmark.find();
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(bookmarksList));
});


app.post("/addHistory", async (req, res) => {
  const videoUrl = req.body.url;
  // we check if there is already the video in the database
  const sameVideos = await History.find({url: videoUrl});
  if (sameVideos.length == 0) {
    // if video is not in database, then add it
    const video = new History({
      url: videoUrl,
      date: Date.now()
    });
    await video.save();
  } else {
    // if video is already in database, then update its date to now
    const video = sameVideos[0];
    video.date = Date.now();
    await video.save();
  }
});


app.post("/addBookmark", async (req, res) => {
  const videoUrl = req.body.url;
  // check if bookmark already registered
  const sameBookmarks = await Bookmark.find({url: videoUrl});
  if (sameBookmarks.length == 0) {
    const video = new Bookmark({
      url: videoUrl
    })
    await video.save();
  }
})