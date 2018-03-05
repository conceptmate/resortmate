/* global AutoForm */
/**
 *
 */
Template.RoomEdit.helpers({

  /**
   *
   */
  insertOrUpdate: function () {
    if (this.room && this.room._id) {
      return "method-update";
    }
    return "method";
  },
  
  /*
   *
   */
  insertOrUpdateMethod: function () {
    if (this.room && this.room._id) {
      return "updateRoom";
    }
    return "addRoom";
  }
});

/**
 *
 */
Template.RoomEdit.events({

  /**
   *
   */
  'submit': function (e, tmpl) {
    e.preventDefault();

    if (AutoForm.validateForm("room-form")) {
      Router.go('rooms');
    }
  },
});
