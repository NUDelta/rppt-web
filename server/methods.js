Meteor.methods({
  createTap: function(tapObject) {
    let tapAction = {'done': false, 'action': 'tap', 'params': tapObject};
    Gestures.insert(tapAction);
  },

  panUpdate: function(panObject) {
    let panUpdate = {'done': false, 'action': 'pan', 'params': panObject};
    Gestures.insert(panUpdate);
  },

  clearAllGestures: function() {
    Gestures.remove({});
  },

  setNewTask: function(task) {
    Messages.remove({});
    let taskEntry = {'type': 'task', 'content': task};
    Messages.insert(taskEntry);
  },

  returnNewTask: function() {
    return Messages.findOne().content;
  },

  // This should only be called by web client.
  createSession: function(role) {
    console.log('[createSession]: Called as a ' + role + '. Creating session.');
    let cred = {};
    let session = openTokClient.createSession();
    let token = openTokClient.generateToken(session, { role: role });
    cred.session = session;
    cred.token = token;
    cred.key = key;
    console.log('[createSession]: Session: ' + cred.session);
    console.log('[createSession]: Token: ' + cred.token);
    console.log('[createSession]: Key: ' + cred.key);
    Sessions.insert({session: session, role: role});
    return cred;
  },

  getSession: function(role) {
    console.log('[getSession]: Called as a ' + role + '. Returning data.');
    let rerole = invertRole(role);
    let session = Sessions.findOne({role: rerole});
    let cred = {};
    cred.session = session.session;
    cred.token = openTokClient.generateToken(session.session, { role: role });
    cred.key = key;
    console.log('[getSession]: Session: ' + cred.session);
    console.log('[getSession]: Token: ' + cred.token);
    console.log('[getSession]: Key: ' + cred.key);
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
