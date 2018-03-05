/* global Tables */
Tables = typeof Tables !== 'undefined' ? Tables : {};

if (Meteor.isClient) {
  Meteor.startup(function () {
    Tables.Customers = {
      i18nPrefix: 'customers.table',
      collection: 'table-customers',
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
          key: 'title',
          sortable: false,
          label: function() {
            return i18n('customer.title');
          }
        },
        {
          key: 'name',
          label: function() {
            return i18n('customer.name')
          },
          fn: Helpers.maintainLinebreaks,
          sortDirection: 'ascending'
        },
        {
          key: 'address',
          label: function() {
            return i18n('customer.address');
          },
          fn: Helpers.maintainLinebreaks
        },
        {
          key: 'delete',
          sortable: false,
          label: "",
          cellClass: function(value, obj) {
            return this.key + ' align-right';
          },
          tmpl: Template.TableCellDelete,
          cellEvent: function(e, tmpl) {
            Meteor.call('deleteCustomer', this._id);
          }
        }
      ],
      group: 'customers',
    };
  });
}