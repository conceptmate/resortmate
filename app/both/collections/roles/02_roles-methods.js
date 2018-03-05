Meteor.methods({
  
  addUserRoles: function(userId, domain, roles) {
    check(userId, String);
    check(domain, String);
    check(roles, [String]);
    
    var user = Meteor.user();

    if (!user || !Roles.userIsInRole(user, ['admin'], user.domain)) {
      throw new Meteor.Error(403, "Access denied")
    }
    
    Roles.addUsersToRoles(userId, roles, domain);
  },
  
  removeUserRoles: function(userId, domain, roles) {
    check(userId, String);
    check(domain, String);
    check(roles, [String]);
    
    var user = Meteor.user();

    if (!user || !Roles.userIsInRole(user, ['admin'], user.domain)) {
      throw new Meteor.Error(403, "Access denied")
    }
    
    Roles.removeUsersFromRoles(userId, roles, domain);
  },
  
  /**
   * update a user's permissions
   *
   * @param {Object} userId Id of user to update
   * @param {String} domain Domain to update permissions for
   * @param {Array} roles User's new permissions
   */
  updateUserRoles: function (userId, domain, roles) {
    check(userId, String);
    check(domain, String);
    check(roles, [String]);
    
    var user = Meteor.user();

    if (!user || !Roles.userIsInRole(user, ['admin'], user.domain)) {
      throw new Meteor.Error(403, "Access denied")
    }

    Roles.setUserRoles(userId, roles, domain)
  }
});