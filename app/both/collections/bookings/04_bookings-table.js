/* global numeral */
/* global Tables */
Tables = typeof Tables !== 'undefined' ? Tables : {};

if (Meteor.isClient) {
  Meteor.startup(function () {
    Tables.Bookings = {
      i18nPrefix: 'bookings.table',
      collection: 'table-bookings',
      rowsPerPage: 10,
      showFilter: true,
      showNavigation: 'auto',
      useFontAwesome: false,
      // showColumnToggles: true,
      fields: [
        {
          key: 'edit',
          sortable: false,
          label: "",
          tmpl: Template.TableCellEdit
        },
        {
          key: 'checkedIn',
          label: function() {
            return i18n('booking.checkedIn');
          },
          tmpl: Template.TableCellCheckedIn
        },
        {
          key: 'customerId',
          label: function () {
            return i18n('booking.customer');
          },
          sortDirection: 'ascending',
          tmpl: Template.TableCustomerCell
        },
        {
          key: 'roomId',
          label: function() {
            return i18n('booking.room');
          },
          fn: function(value, obj) {
            let userId = Meteor.userId();
            Meteor.subscribe('room', Meteor.userDomain(userId), value);
            let room = Rooms.findOne({ _id: value });
            
            if (room) {
              return room.name;
            }
            return undefined;
          }
        },
        {
          key: 'description',
          label: function () {
            return i18n('booking.description');
          }
        },
        {
          key: 'hasBreakfast',
          label: function () {
            return i18n('booking.hasBreakfast');
          },
          tmpl: Template.TableCellHasBreakfast
        },
        {
          key: 'arrivalDate',
          sortOrder: 0,
          sortDirection: 'ascending',
          label: function () {
            return i18n('booking.arrivalDate');
          },
          fn: function(value, obj) {
            return momentDay(value).format('DD.MM.YYYY');
          }
        },
        {
          key: 'departureDate',
          label: function () {
            return i18n('booking.departureDate');
          },
          fn: function(value, obj) {
            return momentDay(value).format('DD.MM.YYYY');
          }
        },
        {
          key: 'days',
          label: function () {
            return i18n('booking.stay');
          },
          fn: function(value, obj) {
            if (value > 1) {
              return i18nf('booking.days', value);
            }
            return i18nf('booking.day', value);
          }
        },
        {
          key: 'delete',
          sortable: false,
          label: "",
          cellClass: function (value, obj) {
            return this.key + ' align-right';
          },
          tmpl: Template.TableCellDelete,
          cellEvent: function(e, tmpl) {
            Meteor.call('deleteBooking', this._id);
          }
        }
      ],
      group: 'bookings',
    };
  });
}