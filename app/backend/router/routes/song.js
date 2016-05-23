'use strict';

var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var Model = mongoose.model('Song');
var multer  = require('multer');
var id3 = require('id3js');

var storage = multer.diskStorage({
  destination: './songlibrary/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({   storage: storage });

module.exports = function (isLoggedIn) {

  router.get('/', isLoggedIn, function (req, res) {
    Model.find(function (err, data) {
      if (err) {
        return res.status(500).send(err);
      }
      if (data.length === 0) {
        return res.send('0');
      }
      return res.status(200).send(data);
    });
  });

  router.post('/', isLoggedIn, function (req, res) {
    var newData = new Model();
    Model.fillDoc(newData, req.body, function (err) {
      if(err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(newData);
    });
  });

  router.get('/:id', isLoggedIn, function (req, res) {
    Model.findById(req.params.id, function (err, data) {
      if (err) {
        return res.status(500).send(err);
      }
      if (!data) {
        return res.status(404).end();
      }
      return res.status(200).send(data);
    });
  });

  router.put('/:id', isLoggedIn, function (req, res) {
    Model.findById(req.params.id, function (err, data) {
      if (err) {
        return res.status(500).send(err);
      }
      if (!data) {
        return res.status(404).end();
      }
      Model.fillDoc(data, req.body, function (err) {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).send(data);
      });
    });
  });

  router.delete('/:id', isLoggedIn, function (req, res) {
    Model.findById(req.params.id, function (err, data) {
      if (err) {
        return res.status(500).send(err);
      }
      if (!data) {
        return res.status(404).end();
      }
      data.remove(function (err) {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).end();
      });
    });
  });

  router.post('/uploadSongs', upload.array('songs'), function (req, res) { //, next
    var songs = req.files;
    var newData;
    var songData;
    var index = 0;
    var loopArray = function(songs) {
      songData = {
        file: songs[index].filename
      };
      getTags (songs[index], function() {
        addSongtoDB ( function() {
          index++;
          if(index < songs.length) {
            loopArray(songs);
          }
        });
      });
    };
    function getTags(song,callback) {
      id3({ file: song.path, type: id3.OPEN_LOCAL }, function(err, tags) {
        songData.title = tags.title;
        songData.artist = tags.artist;
        songData.album = tags.album;
        songData.tracklength = '';
        songData.trackNumber = tags.v1.track;
        callback();
      });
    }
    function addSongtoDB(callback) {
      newData = new Model();
      Model.fillDoc(newData, songData, function (err) {
        if(err) {
          console.log(err);
        }
      });
      callback();
    }
    loopArray(songs);
    return res.status(200).end();
  });
  return router;
};
