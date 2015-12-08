Gestures = new Mongo.Collection('gestures');

Gestures.allow({ 
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc, fields, modifier) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
  }
});
