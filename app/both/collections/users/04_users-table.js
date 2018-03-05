/* global i18n */
/* global Tables */
Tables = typeof Tables !== 'undefined' ? Tables : {};

if (Meteor.isClient) {
  Meteor.startup(function () {
    Tables.Users = {
      i18nPrefix: 'users.table',
      collection: 'table-users',
      rowsPerPage: 10,
      showFilter: true,
      showNavigation: 'auto',
      useFontAwesome: false,
      // showColumnToggles: true,
      fields: [
        {
          key: 'edit',
          label: "",
          sortable: false,
          tmpl: Template.TableCellEdit
        },
        {
          key: 'profile.name',
          label: function() {
            return i18n('admin.user.name');
          },
          sortDirection: 'ascending'
        },
        {
          key: 'emails',
          label: function() {
            return i18n('admin.user.emails');
          },
          fn: function(value, obj) {
            return value[0].address;
          },
          sortDirection: 'ascending'
        },
        {
          key: 'domain',
          label: function() {
            return i18n('admin.user.domain');
          }
        },
        {
          key: 'delete',
          label: "",
          sortable: false,
          cellClass: function(value, obj) {
            
            // do not show delete icon if it is current user
            if (Meteor.userId() === obj._id) {
              return this.key + ' hidden';
            }
            return this.key + ' align-right';
          },
          tmpl: Template.TableCellDelete,
          cellEvent: function(e, tmpl) {
            Meteor.call('deleteUser', this._id);
          }
        }
      ],
      group: 'admin.users',
    };
  });
}