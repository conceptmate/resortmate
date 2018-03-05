/* global Accounts */
if (Meteor.isServer) {
  Meteor.startup(function() {

    Accounts.onCreateUser(function(options, user) {
      // We still want the default hook's 'profile' behavior.
      if (options.profile) {
        user.profile = options.profile;
      }
      else {
        user.profile = {};
      }
      
      // this is required by the schema validation
      user.domain = 'no-domain';
      
      return user;
    });
  });
}
