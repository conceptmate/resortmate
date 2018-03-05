/* global numeral */
/* global Tables */
Tables = typeof Tables !== 'undefined' ? Tables : {};

if (Meteor.isClient) {
  Meteor.startup(function () {
    Tables.Items = {
      i18nPrefix: 'items.table',
      collection: 'table-items',
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
            return i18n('item.key');
          },
          sortDirection: 'ascending'
        },
        {
          key: 'description',
          label: function () {
            return i18n('item.description');
          },
          fn: Helpers.maintainLinebreaks
        },
        {
          key: 'price',
          label: function () {
            return i18n('item.price');
          },
          headerClass: function () {
            return this.key + ' align-right';
          },
          cellClass: function (value, obj) {
            return this.key + ' align-right';
          },
          fn: function (value, obj) {
            return '€ ' + numeral(value).format('0,0.00');
          }
        },
        {
          key: 'vat',
          label: function() {
            return i18n('item.vat');
          },
          headerClass: function () {
            return this.key + ' align-right';
          },
          cellClass: function (value, obj) {
            return this.key + ' align-right';
          },
          fn: function (value, obj) {
            return numeral(value / 100).format('0%');
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
            Meteor.call('deleteItem', this._id);
          }
        }
      ],
      group: 'items',
    };
  });
}