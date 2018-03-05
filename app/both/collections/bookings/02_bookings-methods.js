/* global check */
Meteor.methods({

  /**
   * 
   */
  addBooking: function (booking) {
    check(booking, Object);
    
    if (!Roles.userIsInRole(this.userId, ['curator', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return Bookings.insert(booking, {
      tx: true,
      instant: true
    });
  },
  
  /**
   * 
   */
  updateBooking: function(modifier, bookingId) {
    check(modifier, Object);
    check(bookingId, String);
    
    if (!Roles.userIsInRole(this.userId, ['curator', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return Bookings.update({ _id: bookingId }, modifier, {
      tx: true,
      instant: true
    });
  },
  
  /**
   *
   */
  deleteBooking: function (bookingId) {
    check(bookingId, String);
    
    if (!Roles.userIsInRole(this.userId, ['curator', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return Bookings.remove({ _id: bookingId }, {
      tx: true,
      instant: true
    });
  },
  
  /**
   * 
   */
  clearBookings: function() {
    if (!Roles.userIsInRole(this.userId, ['admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return Bookings.remove({}, {
      tx: true,
      instant: true
    });
  }
});