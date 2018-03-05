/* global DefaultController */
DefaultController = RouteController.extend({

  layoutTemplate: 'DefaultLayout',
  loadingTemplate: 'DefaultLoading',

  landing: function() {
    this.render('Home');
  },
});

Router.route('/', {
  name: 'home',
  controller: DefaultController,
  action: 'landing'
});
