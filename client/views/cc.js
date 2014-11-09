Template.cc.rendered = function () {
    
    Parse.initialize("3dgBmw9ZzGVprNrdoNuQZ4TgmWzjkc8rc5HT3quP", "zFyHtXjR0PTbeqCNgSVMJgiMndBWVEi4Qu8F1I1y");
    map = null;
    panning = false;

    Meteor.call("clearAllGestures");
    Gestures.find().observeChanges({
        added: function (id, fields) {
            if (fields["action"] == "tap") {
                showTap(fields["params"]);
            }
            else if (fields["action"] == "pan") {
                showPan(fields["params"]);
            }
        }
    });
};

function showTap(params) {
    var offset = 15; // from CSS
    
    x = params["x"] - offset;
    y = params["y"] - offset - 460;

    $("#tap-indicator").css("left", x);
    $("#tap-indicator").css("top", y);
    $("#tap-indicator").show()

    // setTimeout(function() { resetTap(); }, 800);
}

function showPan(params) {
    panning = true;

    xshifted = x + params["x"];
    yshifted = y + params["y"];

    $("#tap-indicator").css("left", xshifted);
    $("#tap-indicator").css("top", yshifted);

    panning = false;
    // setTimeout(function() {
    //     if (!panning)
    //         resetTap();
    // }, 800);
}

function resetTap() {
    $("#tap-indicator").hide();
    $("#tap-indicator").css("left", 0);
    $("#tap-indicator").css("top", -460);
}