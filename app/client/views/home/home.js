Template.Home.helpers({
  
  year: function(date) {
    return momentDay(date).format('YYYY');
  }
});

Template.Home.events({
  
  'click .login': function(e, tmpl) {
    Router.go('atSignIn');
  }
});