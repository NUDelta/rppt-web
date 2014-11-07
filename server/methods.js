Meteor.startup(function () {
  Meteor.methods({
    createTap: function (tapObject) {
      console.log('New tap registered!');
      var tapAction = {"done": false, "action": "tap", "params": tapObject};
      console.log(tapAction);

      Gestures.insert(tapAction);
    },
    clearAllGestures: function() {
      console.log('New client. Clearing all data.');
      Gestures.remove({});
    }
  });
});