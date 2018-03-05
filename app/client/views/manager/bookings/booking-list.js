/**
 *
 */
Template.BookingList.helpers({

});

/**
 *
 */
Template.BookingList.events({

  /**
   *
   */
  'click .reactive-table tbody > tr': function(e, tmpl) {
    var booking = this;
    Router.go('booking.edit', { _id: booking._id });
  }
});
