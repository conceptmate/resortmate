/* global momentDay */
/* global Customers */
/* global Rooms */
Schemas = typeof Schemas !== 'undefined' ? Schemas : {};

/**
 *
 */
Schemas.Booking = new SimpleSchema({
  owner: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue: function () {
      if (this.isInsert) {
        return this.userId;
      }
      else {
        this.unset();
      }
    }
  },
  group: {
    type: String,
    autoValue: function () {
      if (!this.isSet) {
        return Meteor.userDomain(this.userId);
      }
    }
  },
  customerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: function () {
      return i18n('booking.customer');
    },
    autoform: {
      type: 'object-select',
      placeholder: function() {
        return i18n('booking.customer');
      },
      config: {
        data: function (customerId) {
          let userId = Meteor.userId();
          let domain = Meteor.userDomain(userId);
          Meteor.subscribe('customer', domain, customerId);
          return Customers.findOne({ _id: customerId });
        },
        options: function (value) {
          let userId = Meteor.userId();
          let domain = Meteor.userDomain(userId);
          Meteor.subscribe('customers-by-name', domain, value);
          return Customers.find({
            name: {
              $regex: value,
              $options: 'i'
            }
          }, {
              limit: 10
            });
        },
        template: 'Customer2',
        optionTemplate: 'CustomerOption'
      }
    }
  },
  roomId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: function () {
      return i18n('booking.room');
    },
    autoform: {
      type: 'object-select',
      placeholder: function() {
        return i18n('booking.room');
      },
      config: {
        data: function (roomId) {
          let userId = Meteor.userId();
          Meteor.subscribe('room', Meteor.userDomain(userId), roomId);
          return Rooms.findOne({ _id: roomId });
        },
        options: function (value) {
          let userId = Meteor.userId();
          Meteor.subscribe('rooms', Meteor.userDomain(userId));
          return Rooms.find({
            name: {
              $regex: value,
              $options: 'i'
            }
          }, {
              limit: 10
            });
        },
        template: 'Room2',
        optionTemplate: 'RoomOptions'
      }
    }
  },
  arrivalDate: {
    type: Date,
    label: function () {
      return i18n('booking.arrivalDate');
    },
    autoform: {
      placeholder: function() {
        return i18n('booking.arrivalDate');
      }
    }
  },
  departureDate: {
    type: Date,
    label: function () {
      return i18n('booking.departureDate');
    },
    autoform: {
      placeholder: function() {
        return i18n('booking.departureDate');
      }
    }
  },
  days: {
    type: Number,
    label: function () {
      return i18n('booking.stay');
    },
    autoValue: function () {
      let arrivalDate = this.field('arrivalDate').value;
      let departureDate = this.field('departureDate').value;
      let arrDate = momentDay(arrivalDate);
      let depDate = momentDay(departureDate);
      return depDate.diff(arrDate, 'days');
    },
    autoform: {
      placeholder: function() {
        return i18n('booking.stay');
      },
      readonly: true
    }
  },
  hasBreakfast: {
    type: Boolean,
    optional: true,
    label: function () {
      return i18n('booking.hasBreakfast');
    },
    autoform: {
      defaultValue: true,
      placeholder: function() {
        return i18n('booking.hasBreakfast');
      }
    }
  },
  options: {
    type: [String],
    label: function() {
      return i18n('booking.options.label');
    },
    optional: true,
    autoform: {
      type: 'select-checkbox',
      placeholder: function() {
        return i18n('booking.options');
      },
      options: function () {
        return [
          {
            value: 'split-bed',
            label: function() {
              return i18n('booking.options.splitBed');
            }
          },
          {
            value: 'rollaway',
            label: function() {
              return i18n('booking.options.rollaway');
            }
          },
          {
            value: 'cot',
            label: function() {
              return i18n('booking.options.cot');
            }
          }
        ];
      }
    }
  },
  description: {
    type: String,
    label: function () {
      return i18n('booking.description');
    },
    max: 2000,
    optional: true,
    autoform: {
      placeholder: function() {
        return i18n('booking.description');
      },
      rows: 4
    }
  },
  checkedIn: {
    type: Boolean,
    optional: true,
    label: function () {
      return i18n('booking.checkedIn');
    },
    autoform: {
      placeholder: function() {
        return i18n('booking.checkedIn');
      }
    }
  },
  checkInDate: {
    type: Date,
    optional: true,
    label: function () {
      return i18n('booking.checkInDate');
    },
    autoValue: function () {
      // console.log('%o', this);

      // ignore auto value on insert, e.g., on import backup
      if (this.isInsert) {
        return this.value;
      }
      
      // auto set check in date when checked in flag is
      // set to true.
      let checkedInField = this.field('checkedIn');
      let checkedIn = checkedInField.value;

      this.unset();

      if (!checkedInField.isSet || !checkedIn) {
        this.unset();
      }
      else {
        this.operator = '$set';
        return {
          $set: new Date()
        }
      }

      return null;
    },
    autoform: {
      placeholder: function() {
        return i18n('booking.checkInDate');
      },
      readonly: true
    }
  },
  createdAt: {
    type: Date,
    label: function () {
      return i18n('booking.createdAt');
    },
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
      else {
        this.unset();
      }
    }//,
    // denyUpdate: true,
  }
});

Bookings.attachSchema(Schemas.Booking);