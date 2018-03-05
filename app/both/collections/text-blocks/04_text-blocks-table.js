/* global Helpers */
/* global Tables */
Tables = typeof Tables !== 'undefined' ? Tables : {};

if (Meteor.isClient) {
  Meteor.startup(function () {
    Tables.TextBlocks = {
      i18nPrefix: 'textBlocks.table',
      collection: 'table-text-blocks',
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
          label: function() {
            return i18n('textBlock.key');
          },
          sortDirection: 'ascending'
        },
        {
          key: 'type',
          label: function() {
            return i18n('textBlock.type');
          },
          fn: function(value, obj) {
            return i18n('textBlock.types.' + value);
          },
          sortDirection: 'ascending'
        },
        {
          key: 'text',
          label: function() {
            return i18n('textBlock.text');
          },
          fn: Helpers.maintainLinebreaks
        },
        {
          key: 'delete',
          label: "",
          sortable: false,
          cellClass: function(value, obj) {
            return this.key + ' align-right';
          },
          tmpl: Template.TableCellDelete,
          cellEvent: function(e, tmpl) {
            Meteor.call('deleteTextBlock', this._id);
          }
        }
      ],
      group: 'textBlocks',
    };
  });
}