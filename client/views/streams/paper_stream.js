Template.paperStream.rendered = function () {

    var apiKey = "45090422";
    var sessionId = "1_MX40NTA5MDQyMn5-MTQxNjU1Njk0OTM2M35pc296bHpCa1g2cUFBUFlNV2YvNDNCVWZ-fg";
    var token = "T1==cGFydG5lcl9pZD00NTA5MDQyMiZzaWc9NjUxZjc0MTcwNDNkYzhlZDg2MmU5NzFlYTBkZTU1NWNmNGU5YTlkNTpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTFfTVg0ME5UQTVNRFF5TW41LU1UUXhOalUxTmprME9UTTJNMzVwYzI5NmJIcENhMWcyY1VGQlVGbE5WMll2TkROQ1ZXWi1mZyZjcmVhdGVfdGltZT0xNDE2NTU2OTY0Jm5vbmNlPTAuOTI2MDU4MzA3NTMxNzY0MSZleHBpcmVfdGltZT0xNDE5MTQ4OTQ2";

    var session = OT.initSession(apiKey, sessionId);

    session.connect(token, function(error) {
        // make sure resolution matches iphone
        var properties = {height: 460, width: 320, name: "Paper Stream", mirror: false, style: {audioLevelDisplayMode: "on", buttonDisplayMode: "on"}};
        var publisher = OT.initPublisher('publisher', properties);
        session.publish(publisher);

        $('#publisher').css('outline', 'none');
    });

    // need some handlers with play / pause buttons?

};
