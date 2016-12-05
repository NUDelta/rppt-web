session = createSession();
let panning = false,
    tapCounter = 0;

Template.cc.onCreated(function() {
   this.subscribe('gestures', session);
   this.subscribe('keyboard', session);
});

Template.cc.onRendered(function() {
  Meteor.call('createTaskEntry', session);
  Meteor.call('clearGestures', session);
  Meteor.call('clearMessages', session);

  $(window).bind('beforeunload', () => {
    Meteor.call('cleanupStreams', session);
  });

  let bg = new Image();
  bg.src = 'imgs/delta_icon.png';
  bg.onload = () => {
    $('#qr-code').qrcode({ text: session, mode: 4, image: bg, mSize: 0.1 });
  }

  Gestures.find().observeChanges({
    added: function (id, fields) {
      if (fields.action == 'tap') {
        showTap(fields.x, fields.y);
        Gestures.remove({ _id: id });
      }
    }
  });

  Keyboard.find().observeChanges({
    added: function (id, fields) {
      $('#message-container').append("<p>".concat(fields.text, "</p>"));
      $('#message-container').animate({ scrollTop: $('#message-container').prop("scrollHeight")}, 1000);
      }
  });

});

Template.cc.helpers({
  sessionKey: function() {
    return session;
  }
});

// Generate session key strings
function createSession() {
  let max = 99999,
      min = 10000;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

function clearSession() {
  Meteor.call('clearSession', { session: session });
}

function showTap(x, y) {
  console.log('Show tap: ', x, ' ', y);
  let id  = createTap(x, y);
  setTimeout(function() { clearTap(id); }, 500);
}

function createTap(x, y) {
  let offset = 30,
      statusBarOffset = 40;
  let leftRightOffset = ($('.paper-col .content').width() - 320) / 2;

  let div = document.createElement('div');
  div.style.left = `${x + leftRightOffset}px`;
  div.style.top = `${y + statusBarOffset}px`;
  div.className = 'tap-indicator';
  div.setAttribute('id', `tapCircle${tapCounter}`);
  tapCounter += 1;

  $('#paper-wrapper').append(div);
  return tapCounter - 1;
}

function clearTap(tapId) {
  $(`#tapCircle${tapId}`).remove();
}

