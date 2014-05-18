$(document).ready(function() {

	Parse.initialize("3dgBmw9ZzGVprNrdoNuQZ4TgmWzjkc8rc5HT3quP", "zFyHtXjR0PTbeqCNgSVMJgiMndBWVEi4Qu8F1I1y");
	var messageObject = Parse.Object.extend("message");
    var messageQuery = new Parse.Query(messageObject);

    messageQuery.find({
        success: function(results) {
            console.log("found something");
            if (results.length == 0) {
                var message = "Connecting..."
            }
            else {
                var message = results[0].get("msg");
            }
            $("body").empty();
            $("body").append(message);
        },
        error: function(error) {
            console.log(":(")
        }
    });
})