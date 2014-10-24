Template.glassStream.rendered = function () {
    jwplayer('player').setup({
        file: 'rtmp://glass.ci.northwestern.edu:4000/live/test.sdp',
        height: '480',
        width: '640',
        rtmp: {
            bufferlength: 3
        }
    });
};