/**
 *
 */
Template.CustomerList.helpers({
  
});

/**
 *
 */
Template.CustomerList.events({

  /**
   *
   */
  'click .reactive-table tbody > tr': function(e, tmpl) {
    Router.go('customer.edit', { _id: this._id });
  }
});
