session = createSession();
let panning = false;

Template.cc.onRendered(function() {
  Meteor.call('createTaskEntry', session);
  Meteor.call('clearGestures', session);

  // Handle this via subscriptions
  // Gestures.find({ session: session }).observeChanges({
  //     added: function (id, fields) {
  //         if (fields['action'] == 'tap') {
  //             showTap(fields['params']);
  //         } else if (fields['action'] == 'pan') {
  //             showPan(fields['params']);
  //         }
  //     }
  // });
  //
  // tapCounter = 0;
});

// Generate session key strings
function createSession() {
  return 'hello'
}

Template.cc.helpers({
  sessionKey: function() {
    if (Streams.findOne({ session: session })) {
      return session;
    } else {
      return "";
    }
  }
});


// function showTap(params) {
//     x = params['x'];
//     y = params['y'];
//     var id  = createTap(x, y)
//     setTimeout(function() { resetTap(id); }, 500);
// }
//
// function createTap(x, y) {
//     var offset = 30;
//
//     var div = document.createElement('div');
//     div.style.width = '30px';
//     div.style.height = '30px';
//     div.style.background = 'blue';
//     div.style.borderRadius = '15px';
//     div.style.opacity = 0.6;
//     div.style.zIndex = 1234;
//     div.style.position = 'absolute';
//     div.style.left = (x + offset).toString() + 'px';
//     div.style.top = (y + offset).toString() + 'px';
//     div.setAttribute('id', 'tapIcon' + tapCounter.toString());
//     tapCounter += 1;
//
//     $('#paper-wrapper').append(div);
//     return tapCounter - 1;
// }
//
// function showPan(params) {
//     var xshifted = x + params['x'];
//     var yshifted = y + params['y'];
//
//     var id = createTap(xshifted, yshifted);
//
//     setTimeout(function() { resetTap(id); }, 500);
// }
//
// function resetTap(divID) {
//     $('#' + 'tapIcon' + divID).remove();
// }
