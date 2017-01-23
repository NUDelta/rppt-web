Meteor.methods({
    // Web Methods
    webCreateStream: function(session, role) {
        console.log(session)
        let cred = {};
        cred.stream = '2_MX40NTQ3MTcyMn5-MTQ4NTE0MzQ4MDE1OH4yM2FoT3d0ODVJNmEzQWx4WVo2bjRDdmR-fg';
        cred.token = 'T1==cGFydG5lcl9pZD00NTQ3MTcyMiZzaWc9ODRjZWU2ZDg2ODQ2NWNmMDI2OWZlMzk4ZWVmNmE4NWJhMWEwMjA1ZTpzZXNzaW9uX2lkPTJfTVg0ME5UUTNNVGN5TW41LU1UUTROVEUwTXpRNE1ERTFPSDR5TTJGb1QzZDBPRFZKTm1FelFXeDRXVm8yYmpSRGRtUi1mZyZjcmVhdGVfdGltZT0xNDg1MTQ5MTU1Jm5vbmNlPTAuNjIxNjIxODQ1ODI5NDUzMyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDg1MTcwNzU0';
        cred.key = key;

        console.log(`[webCreateStream]: Called as a ${role}. Creating stream.`);
        console.log(`[webCreateStream]: Session: ${cred.stream}`);
        console.log(`[webCreateStream]: Token: ${cred.token}`);
        Streams.insert({ session: session, streamId: cred.stream, role: role });
        return cred;
    },

    mobileCreateStream: function(session, role) {
        console.log(session)
        let cred = {};
        cred.stream = '2_MX40NTQ3MTcyMn5-MTQ4NTE0MzQ4MDE1OH4yM2FoT3d0ODVJNmEzQWx4WVo2bjRDdmR-fg';
        cred.token = 'T1==cGFydG5lcl9pZD00NTQ3MTcyMiZzaWc9YWJlZTNlZGM5NzJiYTlkZTczNTNiMmUwYzAwOTQwN2UyYmNhMWJiZjpzZXNzaW9uX2lkPTJfTVg0ME5UUTNNVGN5TW41LU1UUTROVEUwTXpRNE1ERTFPSDR5TTJGb1QzZDBPRFZKTm1FelFXeDRXVm8yYmpSRGRtUi1mZyZjcmVhdGVfdGltZT0xNDg1MTQzNTA1Jm5vbmNlPTAuODU3MDYwMzc1NDc0MTg4NiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDg1MTY1MTA0';
        cred.key = key;

        console.log(`[mobileCreateStream]: Called as a ${role}. Creating stream.`);
        console.log(`[mobileCreateStream]: Session: ${cred.stream}`);
        console.log(`[mobileCreateStream]: Token: ${cred.token}`);
        Streams.insert({ session: session, streamId: cred.stream, role: role });
        console.log(Streams)
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
        console.log(stream)
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
        Keyboard.remove({ session: session });
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
    keyboard: function(session, x, y, height, width) {
        Messages.update({ session: session }, { $set: { keyboard_x: x,
                                                        keyboard_y: y,
                                                        keyboard_height: height,
                                                        keyboard_width: width } });
    },

    photo: function(session, x, y, height, width) {
        Messages.update({ session: session }, { $set: { photo_x:  x,
                                                        photo_y: y,
                                                        photo_height: height,
                                                        photo_width: width} });
    },

    showCamera: function(session) {
        Messages.update({ session: session }, { $set: { camera: 'show'} });
    },

    hideCamera: function(session) {
        Messages.update({ session: session }, { $set: { camera: 'hide' } });
    },

    printKeyboardMessage: function(session, text) {
        let newMessage = { session: session, text: text };
        Keyboard.insert(newMessage);
    },

    clearMessages: function(session, text) {
        Keyboard.remove({ session: session });
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
