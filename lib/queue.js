"use strict";
module.exports = function (spotify) {
  var Track = require("./track")(spotify);
  var firebaseQueue = require("./firebase").ref.child("queue");
  var internalQueue = [];

  firebaseQueue.on("value", function(data){
    console.log("Queue updated");
    internalQueue = [];
    data.forEach(function(item){
      internalQueue.push({ref: item.ref(), uri: item.val().uri});
    });
  });

  function next(){
    var nextTrack = internalQueue.shift();
    if (nextTrack) {
      nextTrack.ref.remove();
      return new Track(nextTrack.uri);
    }
  }

  return {
    next: next,
  };
};
