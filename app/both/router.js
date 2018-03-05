if (Meteor.isClient) {
  /**
  * Route user to successful login route if logged into system.
  */
  Router.onBeforeAction(function () {
    var user = Meteor.user();
    if (user) {
      var routeName = Router.current().route.getName();
      if (routeName === Config.homeRoute) {
        Router.go(Config.successfulLoginRoute);
      }
    }
    this.next();
  });
}

/* global AccountsTemplates */
/* global Config */
Router.route('/logout', function () {
  AccountsTemplates.logout();
});

// AccountsTemplates.configure({
//   defaultLayout: 'DefaultLayout'
// });

AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount', {
  redirect: function () {
    var user = Meteor.user();
    if (user) {
      Router.go(Config.successfulLoginRoute);
    }
  }
});
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('verifyEmail');
// AccountsTemplates.configureRoute('signUp', {
//   redirect: function () {
//     var user = Meteor.user();
//     if (user) {
//       Router.go(Config.successfulLoginRoute);
//     }
//   }
// });
AccountsTemplates.configureRoute('signIn', {
  redirect: function () {
    var user = Meteor.user();
    if (user) {
      Router.go(Config.successfulLoginRoute);
    }
  }
});
AccountsTemplates.configure({
  onLogoutHook: function () {
    Router.go(Config.homeRoute);
  }
});

/**
 * Protecting routes and only allow logged in users to resort mate
 */
Router.plugin('ensureSignedIn', {
  except: _.pluck(AccountsTemplates.routes, 'name').concat([Config.homeRoute, 'items-document.print', 'download.pdf'])
});