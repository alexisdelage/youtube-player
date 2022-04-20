const mongoose = require('mongoose');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

////////////////////////
/// MONGODB DATABASE ///
////////////////////////

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
const HistoryModel = mongoose.model('History', historySchema);
const BookmarkModel = mongoose.model('Bookmark', bookmarkSchema);


//////////////////////////
/// GRAPHQL DEFINITION ///
//////////////////////////

const schema = buildSchema(`
  type Query {
    history(filter: HistoryInput = {}, order_by: OrderRule = {}): [History!]!
    bookmark(filter: BookmarkInput = {}, order_by: OrderRule = {}): [Bookmark!]!
  }
  type Mutation {
    addHistory(url: String!): Boolean
    addBookmark(url: String!): Boolean
    removeBookmark(url: String!): Boolean
  }
  type History {
    url: String!
    date: String!
  }
  type Bookmark {
    url: String!
  }
  input HistoryInput {
    url: String
    date: String
  }
  input BookmarkInput {
    url: String
  }
  input OrderRule {
    url: OrderDirection
    date: OrderDirection
  }
  enum OrderDirection {
    asc
    desc
  }
`);

const root = {
  history: getHistory,
  bookmarks: getBookmark,
  addHistory: addHistory,
  addBookmark: addBookmark,
  removeBookmark: removeBookmark
}


/////////////////////////////
/// EXPRESS CONFIGURATION ///
/////////////////////////////

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(8000);
console.log("Running a GraphQL API server at http://localhost:8000/graphql");


/////////////////
/// FUNCTIONS ///
/////////////////

/**
 * GET history
 * Returns a list of History objects
 */
function getHistory(args) {
  // get the args
  let filter = args.filter;
  let sort = args.order_by;
  // redefine the sorting arguments in the sort dict
  for(const key in sort) {
    switch (sort[key]) {
      case "asc":
        sort[key] = 1; break;
      case "desc":
        sort[key] = -1; break;
      default:
        sort[key] = 0;
    }
  }
  // make the request
  return HistoryModel.find(filter).sort(sort);
}

/**
 * GET bookmark
 * Returns a list of Bookmark objects
 */
 function getBookmark(args) {
  // get the args
  let filter = args.filter;
  let sort = args.order_by;
  // redefine the sorting arguments in the sort dict
  for(const key in sort) {
    switch (sort[key]) {
      case "asc":
        sort[key] = 1; break;
      case "desc":
        sort[key] = -1; break;
      default:
        sort[key] = 0;
    }
  }
  // make the request
  return BookmarkModel.find(filter).sort(sort);
}


/**
 * POST history
 * From a url given in POST details, save it as a History object in database
 */
async function addHistory(args) {
  const videoUrl = args.url;
  const now = Date.now();
  let success;
  // we check if there is already the video in the database
  const sameVideos = await HistoryModel.find({url: videoUrl});
  if (sameVideos.length == 0) {
    // if video is not in database, then add it
    const video = new HistoryModel({
      url: videoUrl,
      date: now
    });
    success = await video.save()
      .then(() => true)
      .catch(() => false);
  } else {
    // if video is already in database, then update its date to now
    success = await HistoryModel.updateOne(
      { url: videoUrl },
      { date: now },
      (err, res) => {if (err) console.log(err)}
    ).clone()
      .then(() => true)
      .catch(() => false);
  }
  return success;
}


/**
 * POST bookmark
 * From a url given in POST details, save it as a Bookmark object in database
 */
async function addBookmark(args) {
  const videoUrl = args.url;
  let success = false;
  // check if bookmark already registered
  const sameBookmarks = await BookmarkModel.find({url: videoUrl});
  if (sameBookmarks.length == 0) {
    const video = new BookmarkModel({
      url: videoUrl
    })
    success = await video.save()
      .then(() => true)
      .catch(() => false);
  }
  return success;
}


/**
 * DELETE bookmarks
 * From a url given in POST details, delete the corresponding object in database
 */
async function removeBookmark(args) {
  const videoUrl = args.url;
  let success = await BookmarkModel.deleteOne(
    { url: videoUrl },
    (err) => {if (err) console.log(err)}
  ).clone()
    .then(() => true)
    .catch(() => false);
  return success;
}


