/* global Session */
/* global Template */
/**
 *
 */
Template.UserList.helpers({

});

/**
 *
 */
Template.UserList.events({

  /**
   *
   */
  'click .reactive-table tbody > tr': function(e, tmpl) {
    var user = this;
    Router.go('admin.user.edit', { _id: user._id });
  },
});