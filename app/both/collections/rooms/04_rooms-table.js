/* global numeral */
/* global Tables */
Tables = typeof Tables !== 'undefined' ? Tables : {};

if (Meteor.isClient) {
  Meteor.startup(function () {
    Tables.Rooms = {
      i18nPrefix: 'rooms.table',
      collection: 'table-rooms',
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
          key: 'key',
          label: function () {
            return i18n('room.key');
          },
          sortDirection: 'ascending'
        },
        {
          key: 'order',
          label: function () {
            return i18n('room.order');
          },
          sortOrder: 0,
          sortDirection: 'ascending'
        },
        {
          key: 'name',
          label: function () {
            return i18n('room.name');
          },
          sortDirection: 'ascending'
        },
        {
          key: 'description',
          label: function () {
            return i18n('room.description');
          },
          fn: Helpers.maintainLinebreaks
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
            Meteor.call('deleteRoom', this._id);
          }
        }
      ],
      group: 'rooms',
    };
  });
}