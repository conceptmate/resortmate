/* global Bookings */
Bookings = new Mongo.Collection('bookings', {
  transform: function (booking) {
    // let booking2 = new ResortMate.Booking(booking);
    // console.log('booking %o', booking2);
    return booking;
  }
});

if (Meteor.isServer) {

  Bookings.allow({
    insert: function (userId, doc) {
      // the user must be logged in, and the document must be owned by the user
      // return doc.owner === userId;
      let domain = Meteor.userDomain(userId);
      return Roles.userIsInRole(userId, ['curator', 'manager', 'admin'], domain);
    },
    update: function (userId, doc, fields, modifier) {
      // can only change your own documents
      // return doc.owner === userId;
      let domain = Meteor.userDomain(userId);
      return Roles.userIsInRole(userId, ['curator', 'manager', 'admin'], domain);
    },
    remove: function (userId, doc) {
      // can only remove your own documents
      // return doc.owner === userId;
      let domain = Meteor.userDomain(userId);
      return Roles.userIsInRole(userId, ['curator', 'manager', 'admin'], domain);
    }
  });

  ReactiveTable.publish('table-bookings', function () {
    
    if (!Roles.userIsInRole(this.userId, ['curator', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      this.ready();
      return;
    }
    return Bookings;
  }, function () {
    return {
      group: Meteor.userDomain(this.userId)
    };
  });

  Meteor.publishComposite('booking', function (domain, bookingId) {
    check(domain, String);
    check(bookingId, String);

    if (!Roles.userIsInRole(this.userId, ['curator', 'manager', 'admin'], domain)) {
      this.ready();
      return;
    }

    return {
      find: function () {
        return Bookings.find({
          $and: [
            { group: domain },
            { _id: bookingId }
          ]
        });
      },
      children: [{
        find: function (booking) {
          return Customers.find({
            $and: [
              { group: domain },
              { _id: booking.customerId }
            ]
          }, {
              limit: 1
            });
        }
      }]
    };
  });

  Meteor.publishComposite('bookings', function (domain, fromDate, toDate) {
    check(domain, String);
    check(fromDate, Date);
    check(toDate, Date);

    if (!Roles.userIsInRole(this.userId, ['curator', 'manager', 'admin'], domain)) {
      this.ready();
      return;
    }

    return {
      find: function () {
        return Bookings.find({
          $and: [
            { group: domain },
            {
              $or: [
                {
                  $and: [
                    { arrivalDate: { $gte: fromDate } },
                    { arrivalDate: { $lte: toDate } }
                  ]
                },
                {
                  $and: [
                    { departureDate: { $gte: fromDate } },
                    { departureDate: { $lte: toDate } }
                  ]
                },
                {
                  $and: [
                    { arrivalDate: { $lt: fromDate } },
                    { departureDate: { $gt: toDate } }
                  ]
                }
              ]
            }
          ]
        });
      },
      children: [{
        find: function (booking) {
          return Customers.find({
            $and: [
              { group: domain },
              { _id: booking.customerId }
            ]
          }, {
              limit: 1
            });
        }
      }]
    };
  });

  Meteor.publish('customer-bookings', function (domain, customerId) {
    check(domain, String);
    check(customerId, String);

    if (!Roles.userIsInRole(this.userId, ['curator', 'manager', 'admin'], domain)) {
      this.ready();
      return;
    }

    return Bookings.find({
      group: domain,
      customerId: customerId
    });
  });
}