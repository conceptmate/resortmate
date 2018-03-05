/* global AutoForm */
/**
 *
 */
Template.ItemEdit.helpers({

  /**
   *
   */
  insertOrUpdate: function () {
    if (this.item && this.item._id) {
      return "method-update";
    }
    return "method";
  },
  
  /*
   *
   */
  insertOrUpdateMethod: function () {
    if (this.item && this.item._id) {
      return "updateItem";
    }
    return "addItem";
  }
});

/**
 *
 */
Template.ItemEdit.events({

  /**
   *
   */
  'submit': function (e, tmpl) {
    e.preventDefault();

    if (AutoForm.validateForm("item-form")) {
      Router.go('items');
    }
  },
});
