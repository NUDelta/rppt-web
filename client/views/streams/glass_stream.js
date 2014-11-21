Template.glassStream.rendered = function () {

    var apiKey = "45090422";
    var sessionId = "2_MX40NTA5MDQyMn5-MTQxNjU1MjI1MDQ5OH4wSW1xakI5cDFIYk9JOURyVXFQUFFjTGF-fg";
    var token = "T1==cGFydG5lcl9pZD00NTA5MDQyMiZzaWc9YmFlMmU0YzI5ZWJlOTJkZjI3OWFiNjlkNzA3NGQ0N2UyMmJiZjVhNDpyb2xlPXN1YnNjcmliZXImc2Vzc2lvbl9pZD0yX01YNDBOVEE1TURReU1uNS1NVFF4TmpVMU1qSTFNRFE1T0g0d1NXMXhha0k1Y0RGSVlrOUpPVVJ5VlhGUVVGRmpUR0YtZmcmY3JlYXRlX3RpbWU9MTQxNjU1MjI2OCZub25jZT0wLjUyNjEzNDg4MjY5MTUzNzkmZXhwaXJlX3RpbWU9MTQxOTE0NDI0Mw==";

    var session = OT.initSession(apiKey, sessionId);

    session.on("streamCreated", function(event) {
        var style = {backgroundImageURI: "stickies.jpg"}
        var properties = {height: 320, width: 480, name: "Glass Stream", style: style};
        var subscriber = session.subscribe(event.stream, "subscriber", properties);

        $('#subscriber').css('outline', 'none');
      });

    session.connect(token);
};