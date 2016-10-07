Meteor.methods({
    // Web Methods
    webCreateStream: function(session, role) {
        const key = '45692792';
        // const secret = Assets.getText('secret');
        const secret = 'eeca00124e924f38128aa7ded39bbda10c73eb1f';
        openTokClient = new OpenTokClient(key, secret);
        
        let cred = {};
        cred.stream = openTokClient.createSession();
        cred.token = openTokClient.generateToken(cred.stream, { role: role });
        cred.key = key;

        console.log(`[webCreateStream]: Called as a ${role}. Creating stream.`);
        console.log(`[webCreateStream]: Session: ${cred.stream}`);
        console.log(`[webCreateStream]: Token: ${cred.token}`);
        Streams.insert({ session: session, streamId: cred.stream, role: role });
        return cred;
    },

    cleanUpStreams: function(session) {
        Streams.remove({ session: session });
    },

    // Mobile Methods
    getStreamData: function(session, role) {
        let rerole = invertRole(role),
        stream = Streams.findOne({ session: session, role: rerole }),
        cred = {};
        try {
            cred.session = stream.streamId;
            cred.token = openTokClient.generateToken(stream.streamId, { role: role });
            cred.key = key;

            console.log(`[getSession]: Called as a ${role}. Returning data.`);
            console.log(`[getSession]: Session: ${cred.session}`);
            console.log(`[getSession]: Token: ${cred.token}`);
            console.log(`[getSession]: Key: ${cred.key}`);
            return cred;
        } catch (exception) {
            throw new Meteor.Error(exception.error, exception.reason);
        }
    },

    // Gesture Handling
    createTap: function(session, x, y) {
        let tapAction = { session: session, done: false, action: 'tap', x: x, y: y };
        // console.log('gesture received');
        Gestures.insert(tapAction);
    },

    clearGestures: function(session) {
        Gestures.remove({ session: session });
    },

    clearSession: function(session) {
        Gestures.remove({ session: session });
        Messages.remove({ session: session });
        Locations.remove({ session: session });
        Streams.remove({ session: session });
    },

    // Task Handling
    createTaskEntry: function(session) {
        Messages.remove({ session: session });
        Messages.insert({ session: session, type: 'task', content: 'Waiting for your first task...'});
    },

    getTaskId: function(session) {
        return Messages.findOne({ session: session });
    },

    updateTask: function(session, task) {
        Messages.update({ session: session }, { $set: { content: task } });
    },

    // mixed fidelity element control
    showKeyboard: function(session) {
        Messages.update({ session: session }, { $set: { content: 'show-keyboard' } });
    },

    hideKeyboard: function(session) {
        Messages.update({ session: session }, { $set: { content: 'hide-keyboard' } });
    }

});

function invertRole(role) {
    if (role == 'publisher') {
        return 'subscriber';
    }
    else {
        return 'publisher';
    }
}
