Router.route('/', function() {
    this.render('cc');
});

Router.configure({
  loadingTemplate: 'loading',
});
