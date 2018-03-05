/**
 *
 */
Template.CustomerEdit.helpers({

  /**
   *
   */
  insertOrUpdate: function () {
    if (this.customer && this.customer._id) {
      return "method-update";
    }
    return "method";
  },
  
  /*
   *
   */
  insertOrUpdateMethod: function () {
    if (this.customer && this.customer._id) {
      return "updateCustomer";
    }
    return "addCustomer";
  }
});

/**
 *
 */
Template.CustomerEdit.events({

  /**
   *
   */
  'submit': function (e, tmpl) {
    e.preventDefault();

    if (AutoForm.validateForm("customer-form")) {
      Router.go('customers');
    }
  },
});
