session = createSession();
let panning = false,
    tapCounter = 0;

Template.cc.onRendered(function() {
  Meteor.call('createTaskEntry', session);
  Meteor.call('clearGestures', session);

  let bg = new Image();
  bg.src = 'imgs/delta_icon.png';
  bg.onload = () => {
    $('#qr-code').qrcode({ text: session, mode: 4, image: bg, mSize: 0.4 });
  }

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
  let max = 99999,
      min = 10000;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
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
