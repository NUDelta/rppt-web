Router.route('/', function() {
    this.render('cc');
});

Router.route('/restful', { where: 'server' })
    .get(function(req, res) {
        console.log('GETTING.');
        // console.log(req);
        console.log(res);
    })
    .post(function() {
        console.log('POSTING.');
        console.log(this);
        Test.insert(this.request.body);
        return '121212';
    });
