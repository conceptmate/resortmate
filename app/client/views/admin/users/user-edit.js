/* global Template */
/* global AutoForm */
/**
 *
 */
Template.UserEdit.helpers({

  /**
   *
   */
  insertOrUpdate: function () {
    if (this.user && this.user._id) {
      return "update";
    }
    return "insert";
  },
  
  domains: function(user) {
    return Roles.getGroupsForUser(user);
  },
  
  hasRole: function(user, domain) {
    console.log('domain %o', domain);
    
    let fixedDomain = domain.replace('_', '.');
    
    console.log('fixed domain %o', fixedDomain);
    
    return Roles.userIsInRole(user, [this.name], fixedDomain);
  }
});

/**
 *
 */
Template.UserEdit.events({
  
  'change .change-role': function(e, tmpl) {
    e.preventDefault();
    
    let parentData = Template.parentData(1);
    let user = parentData.user;
    
    if (tmpl.$(e.target).is(':checked')) {
      Meteor.call('addUserRoles', user._id, user.domain, [this.name]);
    }
    else {
      Meteor.call('removeUserRoles', user._id, user.domain, [this.name]);
    }
  },

  /**
   *
   */
  'submit': function (e, tmpl) {
    e.preventDefault();

    if (AutoForm.validateForm("user-form")) {
      Router.go('admin.users');
    }
  },
});
