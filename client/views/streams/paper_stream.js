Template.paperStream.rendered = function () {
    setInterval(function() { getTap(); }, 1000); // figure out a better way?

    var apiKey = "45040222";
    var sessionId = "1_MX40NTA0MDIyMn5-MTQxNDA5NTYxNjEyMH5maGZKSVREODc0MkM0K0MvR3kvLzgrQ2l-fg";
    var token = "T1==cGFydG5lcl9pZD00NTA0MDIyMiZzaWc9NmY5NzE5YmZlNWE5NDc0ZGRiMWE2NDk5NmQ0YWE5NGUxNzE5MjRkOTpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTFfTVg0ME5UQTBNREl5TW41LU1UUXhOREE1TlRZeE5qRXlNSDVtYUdaS1NWUkVPRGMwTWtNMEswTXZSM2t2THpnclEybC1mZyZjcmVhdGVfdGltZT0xNDE0MDk1Njc4Jm5vbmNlPTAuOTg4MTk1OTcxOTMxMjg3NCZleHBpcmVfdGltZT0xNDE0NzAwNDEw";

    var session = OT.initSession(apiKey, sessionId);

    session.connect(token, function(error) {
        // make sure resolution matches iphone
        var properties = {height: 460, width: 320, name: "Paper Stream", mirror: false}
        var publisher = OT.initPublisher('publisher', properties);
        // publisher.setStyle("backgroundImageURI", "string")
        session.publish(publisher);
    });

    // need some handlers with play / pause buttons

};

function getTap() {
    var tapObject = Parse.Object.extend("taps")
    var tapQuery = new Parse.Query(tapObject)

    // tapQuery.first({
    //     success: function(obj) {
    //         if (obj.get("new")) {
    //             showTap(obj.get("x"), obj.get("y"));
    //             obj.set("new", false);
    //             obj.save();
    //         }
    //     },
    //     error: function(error) {
    //         console.log("Error!" + error)
    //     }
    // })
}

function showTap(x, y) {
    console.log("X: " + x)
    console.log("Y: " + y)
}