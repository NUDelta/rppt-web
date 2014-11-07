Router.route('/', function() {
    this.render('cc');
});

Router.route('/restful', {where: 'server'})
    .get(function() {
        // get request
    })
    .post(function() {
        var req = this.request;
        var res = this.response;
        res.end('post request\n');
        console.log(req);
        console.log(res);
    });
