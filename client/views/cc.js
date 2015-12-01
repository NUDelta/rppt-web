session = createSession();
let panning = false,
    tapCounter = 0;

Template.cc.onRendered(function() {
  Meteor.call('createTaskEntry', session);
  Meteor.call('clearGestures', session);
  $('#qr-code').qrcode({ text: session });

  // Handle this via subscriptions
  Gestures.find({ session: session }).observeChanges({
    added: function (id, fields) {
      if (fields.action == 'tap') {
        showTap(fields.x, fields.y);
        Gestures.remove({ _id: id });
      }
    }
  });
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

function showTap(x, y) {
  let id  = createTap(x, y);
  setTimeout(function() { clearTap(id); }, 500);
}

function createTap(x, y) {
  let offset = 30,
      statusBarOffset = 20;

  let div = document.createElement('div');
  div.style.left = `${x}px`;
  div.style.top = `${y - statusBarOffset}px`;
  div.className = 'tap-indicator';
  div.setAttribute('id', `tapCircle${tapCounter}`);
  tapCounter += 1;

  $('#paper-wrapper').append(div);
  return tapCounter - 1;
}

function clearTap(tapId) {
  $(`#tapCircle${tapId}`).remove();
}
