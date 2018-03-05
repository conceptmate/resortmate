/* global Roles */
if (Meteor.isServer) {
  Meteor.methods({
    
    /**
     * Creates a new user account and sends an enrollment email to the user, so that they can
     * set their password.
     * 
     * @param {String} email The new user's email address.
     * @param {String} domain The user's domain.
     */
    addUser: function(user) {
      if (!Roles.userIsInRole(this.userId, ['admin'], Meteor.userDomain(this.userId))) {
        throw new Meteor.Error(401, 'Permission denied');
      }
      
      let userId = Accounts.createUser(user);
      
      let fixedDomain = user.domain.replace('.', '_');
      let roles = {};
      roles[fixedDomain] = ['manager'];
      
      let modifier = {
        $set: {
          domain: user.domain,
          roles: roles
        }
      };
      
      // update the user object including roles and domain
      Meteor.users.update({ _id: userId }, modifier);
      
      Accounts.sendEnrollmentEmail(userId);
    },
    
    deleteUser: function(userId) {
      check(userId, String);
      
      if (!Roles.userIsInRole(this.userId, ['admin'], Meteor.userDomain(this.userId))) {
        throw new Meteor.Error(401, 'Permission denied');
      }
      
      // delete user
      Meteor.users.remove({ _id: userId });
    },
    
    updateUserDomain: function(domain) {
      check(domain, String);
      
      if (!Roles.userIsInRole(this.userId, ['curator', 'accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
        throw new Meteor.Error(401, 'Permission denied');
      }
      
      Meteor.users.update({
        _id: this.userId
      }, {
        $set: {
          domain: domain
        }
      });
    }
  });
}