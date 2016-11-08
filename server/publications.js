Meteor.publish('locations', function(session) {
  check(session, String);
  return Locations.find({ session: session });
});

Meteor.publish('gestures', function(session) {
  check(session, String);
  return Gestures.find({ session: session })
});

Meteor.publish('messages', function(session) {
  check(session, String);
  return Messages.find({ session: session });
});

Meteor.publish('keyboard', function(session) {
  check(session, String);
  return Keyboard.find({ session: session });
});

