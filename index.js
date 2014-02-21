
var yt = require('youtube-data');
var scraper = require('scraper');
var parseqs = require('querystring').parse;
var url = require('url');

function videoId(channel, cb) {
  yt.query()
    .videos(channel)
    .results(1)
    .orderByPublished()
    .run(function(err, data){
      if (err) return cb(err);
      if (!data || !data.feed || !data.feed.entry || data.feed.entry.length === 0)
        return cb("no data");
      var id = data.feed.entry[0].id.$t.split(":");
      id = id[id.length - 1];
      return cb(null, id);
    });
}

function videoUrl(id) {
  return "http://www.youtube.com/watch?v=" + id;
}

function parseVideoId(data, cb){
  var parsed = url.parse(data);
  var qs;

  if ((qs = parsed.query) && (qs = parseqs(qs)) && qs.v)
    return cb(null, qs.v);
  else
    videoId(data, cb);
}

function scrape(url, cb){
  scraper(url, function(err, $){
    if (err != null) return cb(err);
    var str = $("meta[name='attribution']").attr("content");
    str = str.substring(0, str.length - 1);
    cb(null, str);
  });
}

function getNetwork(data, cb) {
  parseVideoId(data, function(err, id){
    if (err) return cb(err);
    scrape(videoUrl(id), cb);
  });
}

module.exports = function(robot) {
  robot.respond(/(youtube )?network( me)? (.*)/, function(msg){
    msg.send("I'll try my best...");
    var data = msg.match[3];
    getNetwork(data, function(err, network){
      if (err != null)
        return msg.send("I couldn't find the network. I have failed you...");
      msg.send("Looks like the network is '" + network + "'");
    });
  });
};

module.exports.videoId = videoId;
module.exports.videoUrl = videoUrl;
module.exports.parseVideoId = parseVideoId;
module.exports.scrape = scrape;
module.exports.getNetwork = getNetwork;
