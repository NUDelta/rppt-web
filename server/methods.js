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
  },

  setNewTask: function(task) {
    Messages.remove({});
    var taskEntry = {"type": "task", "content": task};
    Messages.insert(taskEntry);
  },

  returnNewTask: function() {
    return Messages.findOne().content;
  },

  createSession: function(role) {
    console.log("[createSession]: Called as a " + role + ". Creating session.");
    var cred = {};
    var session = openTokClient.createSession();
    var token = openTokClient.generateToken(session, { role: role });
    cred.session = session;
    cred.token = token;
    cred.key = '45126992';
    console.log("[createSession]: Session: " + cred.session);
    console.log("[createSession]: Token: " + cred.token);
    console.log("[createSession]: Key: " + cred.key);
    Sessions.insert({session: session, role: role});
    return cred;
  },

  getSession: function(role) {
    console.log("[getSession]: Called as a " + role + ". Returning data.");
    var rerole = invertRole(role);
    var session = Sessions.findOne({role: rerole});
    var cred = {};
    cred.session = session.session;
    cred.token = openTokClient.generateToken(session.session, { role: role });
    cred.key = '45126992';
    console.log("[getSession]: Session: " + cred.session);
    console.log("[getSession]: Token: " + cred.token);
    console.log("[getSession]: Key: " + cred.key);
    // Sessions.remove({_id: session});
    return cred;
  },
});

function invertRole(role) {
  if (role == 'publisher') {
    return 'subscriber';
  }
  else {
    return 'publisher';
  }
}