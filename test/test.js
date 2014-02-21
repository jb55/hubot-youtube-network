
var yt = require('..');
var should = require('should');
var assert = require('assert');

describe('youtube channel', function(){
  it('gets valid video data', function(done){
    yt.videoId('monstercatmedia', function(err, id){
      should.not.exist(err);
      should.exist(id);
      id.should.be.a.String;
      done();
    });
  });

  it('network matches', function(done){
    yt.getNetwork('tastynetwork', function(err, network){
      should.exist(network);
      network.should.equal("FullScreen");
      done();
    });
  });

  it('doesnt crash on networkless channel', function(done){
    yt.getNetwork('jackbox55', function(err, network){
      should.not.exist(err);
      done();
    });
  });

  it('video matches', function(done){
    yt.getNetwork('http://www.youtube.com/watch?v=NVlowrl_VYM', function(err, network){
      should.exist(network);
      network.should.equal("FullScreen");
      done();
    });
  });
});
