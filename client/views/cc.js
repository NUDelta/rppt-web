Template.cc.rendered = function () {
    Parse.initialize("3dgBmw9ZzGVprNrdoNuQZ4TgmWzjkc8rc5HT3quP", "zFyHtXjR0PTbeqCNgSVMJgiMndBWVEi4Qu8F1I1y");
    map = 1234;
    lastID = 0;

    setInterval(function() { getTap(); }, 1400); // figure out a better way?

};

function getTap() {
    var tapObject = Parse.Object.extend("taps");
    var tapQuery = new Parse.Query(tapObject);

    tapQuery.descending("createdAt");
    tapQuery.first({
        success: function(object) {
            console.log(lastID);
            if (lastID != object.id) {
                showTap(object.get("x"), object.get("y"));
                lastID = object.id;
            }
        }
    })

    // tapQuery.first({
    //     success: function(obj) {
    //         console.log(obj.get("new"))
    //         obj.set("new", false);
    //         obj.save();
    //         // if (obj.get("new")) {
    //         //     showTap(obj.get("x"), obj.get("y"));
    //         //     obj.set("new", false);
    //         //     obj.save();
    //         // }
    //     },
    //     error: function(error) {
    //         console.log("Error!" + error)
    //     }
    // })
}

function showTap(x, y) {
    console.log("showing tap");
    $("#tap-indicator").css("left", x);
    $("#tap-indicator").css("top", -460+y);
    $("#tap-indicator").show()

    setTimeout(function() { resetTap(); }, 800);
}

function resetTap() {
    $("#tap-indicator").hide();
    $("#tap-indicator").css("left", 0);
    $("#tap-indicator").css("top", -460);
}