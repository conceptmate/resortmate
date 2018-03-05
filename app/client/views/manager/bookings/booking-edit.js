/**
 *
 */
Template.BookingEdit.helpers({

  /**
   *
   */
  insertOrUpdate: function () {
    if (this.booking && this.booking._id) {
      return "method-update";
    }
    return "method";
  },
  
  /*
   *
   */
  insertOrUpdateMethod: function () {
    if (this.booking && this.booking._id) {
      return "updateBooking";
    }
    return "addBooking";
  }
});

/**
 *
 */
Template.BookingEdit.events({

  /**
   *
   */
  'submit': function (e, tmpl) {
    e.preventDefault();

    if (AutoForm.validateForm("booking-form")) {
      Router.go('bookings');
    }
  },
});
