Template.paperStream.rendered = function () {

    var apiKey = "45040222";
    var sessionId = "2_MX40NTA0MDIyMn5-MTQxNDc3NTMzNjIzOX5JQ2hRNkhMZTlJQ1NOd2hNbzBwSGNmbU9-fg";
    var token = "T1==cGFydG5lcl9pZD00NTA0MDIyMiZzaWc9M2M4NzdhZGRjYmVhZDY4N2VlYWNjMWU2ZjM4ZmEzNjk3YTY4MTVhZDpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTJfTVg0ME5UQTBNREl5TW41LU1UUXhORGMzTlRNek5qSXpPWDVKUTJoUk5raE1aVGxKUTFOT2QyaE5iekJ3U0dObWJVOS1mZyZjcmVhdGVfdGltZT0xNDE0Nzc1Mzc4Jm5vbmNlPTAuMTI4MTg1ODAyMDk5MTEwNDYmZXhwaXJlX3RpbWU9MTQxNzM2NzMyMw==";

    var session = OT.initSession(apiKey, sessionId);

    session.connect(token, function(error) {
        // make sure resolution matches iphone
        var properties = {height: 460, width: 320, name: "Paper Stream", mirror: false}
        var publisher = OT.initPublisher('publisher', properties);
        // publisher.setStyle("backgroundImageURI", "stickies.jpg"); not working
        session.publish(publisher);
    });

    // need some handlers with play / pause buttons

};
