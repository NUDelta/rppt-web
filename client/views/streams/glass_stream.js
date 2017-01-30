Template.glassStream.rendered = function () {
    // Not dealing with glass -- always subscribes first to publisher. Will figure out later.
    // Meteor.call('webCreateStream', session, 'subscriber', function(err, cred) {
    //     if (err) {
    //         alert(err);
    //     } else {
    //         let stream = OT.initSession(cred.key, cred.stream);
    //         stream.on("streamCreated", function(event) {
    //             let properties = {
    //                 height: 266,
    //                 width: 400,
    //                 name: 'Glass Stream',
    //                 style: {
    //                     backgroundImageURI: "stickies.jpg"
    //                 }
    //             };
    //             stream.subscribe(event.stream, "glass", properties);
    //             $('#glass').css('outline', 'none');
    //           });
    //         stream.connect(cred.token);
    //     }
    // });
};
