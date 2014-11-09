Meteor.methods({
  createTap: function(tapObject) {
    var tapAction = {"done": false, "action": "tap", "params": tapObject};
    Gestures.insert(tapAction);
  },

  panUpdate: function(panObject) {
    var panUpdate = {"done": false, "action": "pan", "params": panObject};
    Gestures.insert(panUpdate);
  },

  clearAllGestures: function() {
    Gestures.remove({});
  }
});
