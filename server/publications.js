Meteor.publish('locations', function(session) {
  check(session, String);
  return Locations.find({ session: session });
});

Meteor.publish('gestures', function(session) {
  check(session, String);
  return Gestures.find({ session: session })
});
