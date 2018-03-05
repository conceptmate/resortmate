/* global UserController */
/* global BookingController */
BookingController = UserController.extend({

  // Subscriptions or other things we want to "wait" on. More on waitOn in the
  // next section.
  waitOn: function () {
    let bookingId = this.params._id;
    let userId = Meteor.userId();
    let domain = Meteor.userDomain(userId);
    
    if (domain && bookingId) {
      // TODO publishComposite('booking') -> with rooms
      return [
        Meteor.subscribe('rooms', domain, bookingId),
        Meteor.subscribe('booking', domain, bookingId)
      ];
    }
  },

  // A data function that can be used to automatically set the data context for
  // our layout. This function can also be used by hooks and plugins. For
  // example, the "dataNotFound" plugin calls this function to see if it
  // returns a null value, and if so, renders the not found template.
  data: function () {
    let bookingId = this.params._id;
    
    if (bookingId) {
      // let booking = Bookings.findOne({ _id: this.params._id }, {
      //   transform: function (booking) {
      //     return new ResortMate.Booking(booking);
      //   }
      // });
      
      let booking = Bookings.findOne({ _id: this.params._id });
      
      // console.log('booking %o', booking);
      
      return {
        booking: booking
      };
    }
    return undefined;
  },

  edit: function () {
    this.render('BookingEdit');

    let openTimetableAction = this.createAction('bookings.timetable', function() {
      Router.go('bookings.timetable');
    });
    let actions = this.createDefaultActions('#booking-form', 'bookings');

    // insert openTimetable action at index 0
    actions.splice(0, 0, openTimetableAction);

    this.render('ContentActions', {
      to: 'actions',
      data: {
        actions: actions
      }
    });
  },

  list: function () {
    this.render('BookingList');

    this.render('ContentActions', {
      to: 'actions',
      data: {
        actions: [
          this.createAction('bookings.timetable', function() {
              Router.go('bookings.timetable');
          }),
          this.createAction('booking.add', function() {
              Router.go('booking.add');
          })
        ]
      }
    });
  }
});

Router.route('/bookings', {
  name: 'bookings',
  controller: BookingController,
  action: 'list',
});

Router.route('/bookings/add', {
  name: 'booking.add',
  controller: BookingController,
  action: 'edit',
});

Router.route('/bookings/edit/:_id', {
  name: 'booking.edit',
  controller: BookingController,
  action: 'edit',
});