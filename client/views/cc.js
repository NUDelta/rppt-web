Template.cc.rendered = function () {
    
    Parse.initialize("3dgBmw9ZzGVprNrdoNuQZ4TgmWzjkc8rc5HT3quP", "zFyHtXjR0PTbeqCNgSVMJgiMndBWVEi4Qu8F1I1y");
    map = null;

    Meteor.call("clearAllGestures");
    Gestures.find().observeChanges({
        added: function (id, fields) {
            if (fields["action"] == "tap") {
                showTap(fields["params"]);
            }
        }
    });
};

function showTap(params) {
    var x = params["x"];
    var y = params["y"];

    var offset = 15; // from CSS
    $("#tap-indicator").css("left", x-15);
    $("#tap-indicator").css("top", -460+y-15);
    $("#tap-indicator").show()

    setTimeout(function() { resetTap(); }, 800);
}

function resetTap() {
    $("#tap-indicator").hide();
    $("#tap-indicator").css("left", 0);
    $("#tap-indicator").css("top", -460);
}