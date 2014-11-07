Meteor.methods({
  createTap: function (tapObject) {
    var tapAction = {"done": false, "action": "tap", "params": tapObject};
    Gestures.insert(tapAction);
  },

  clearAllGestures: function() {
    Gestures.remove({});
  }
});
