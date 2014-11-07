Template.cc.rendered = function () {
    
    Parse.initialize("3dgBmw9ZzGVprNrdoNuQZ4TgmWzjkc8rc5HT3quP", "zFyHtXjR0PTbeqCNgSVMJgiMndBWVEi4Qu8F1I1y");
    map = 1234;

    Meteor.call("clearAllGestures");

    Gestures.find().observeChanges({
        added: function (id, fields) {
            if (fields["action"] == "tap") {
                showTap(fields["params"]);
            }
        }
    });
};

// function getTap() {
//     var tapObject = Parse.Object.extend("taps");
//     var tapQuery = new Parse.Query(tapObject);

//     tapQuery.descending("createdAt");
//     tapQuery.first({
//         success: function(object) {
//             console.log(lastID);
//             if (lastID != object.id) {
//                 showTap(object.get("x"), object.get("y"));
//                 lastID = object.id;
//             }
//         }
//     })

//     // tapQuery.first({
//     //     success: function(obj) {
//     //         console.log(obj.get("new"))
//     //         obj.set("new", false);
//     //         obj.save();
//     //         // if (obj.get("new")) {
//     //         //     showTap(obj.get("x"), obj.get("y"));
//     //         //     obj.set("new", false);
//     //         //     obj.save();
//     //         // }
//     //     },
//     //     error: function(error) {
//     //         console.log("Error!" + error)
//     //     }
//     // })
// }

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