/* global Tables */
Tables = typeof Tables !== 'undefined' ? Tables : {};

if (Meteor.isClient) {
  Meteor.startup(function () {
    Tables.ItemsDocuments = {
      i18nPrefix: function () {
        let documentType = Router.current().params.documentType;
        return documentType + '.table';
      },
      collection: 'set-by-template-helper',
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
          key: 'state',
          label: function () {
            let documentType = Router.current().params.documentType;
            if (documentType) {
              return i18n(documentType + '.state');
            }

            let parentData = Template.parentData(2);
            if (parentData.i18nPrefix) {
              return i18np(parentData.i18nPrefix, 'state');
            }

            return i18n('items_document.state');
          },
          sortOrder: 1,
          tmpl: Template.TableCellState
        },
        {
          key: 'number',
          label: function () {
            let documentType = Router.current().params.documentType;
            if (documentType) {
              return i18n(documentType + '.number');
            }

            let parentData = Template.parentData(2);
            if (parentData.i18nPrefix) {
              return i18np(parentData.i18nPrefix, 'number');
            }

            return i18n('items_document.number');
          },
          sortOrder: 0,
          sortDirection: 'descending'
        },
        {
          key: 'customer.name',
          label: function () {
            let documentType = Router.current().params.documentType;
            if (documentType) {
              return i18n(documentType + '.customer');
            }

            let parentData = Template.parentData(2);
            if (parentData.i18nPrefix) {
              return i18np(parentData.i18nPrefix, 'customer');
            }

            return i18n('items_document.customer');
          },
          fn: Helpers.maintainLinebreaks
        },
        {
          key: 'date',
          label: function () {
            let documentType = Router.current().params.documentType;
            if (documentType) {
              return i18n(documentType + '.date');
            }

            let parentData = Template.parentData(2);
            if (parentData.i18nPrefix) {
              return i18np(parentData.i18nPrefix, 'date');
            }

            return i18n('items_document.date');
          },
          fn: function (value, obj) {
            return momentDay(value).format('DD.MM.YYYY');
          },
          sortDirection: 'ascending'
        },
        {
          key: 'delete',
          label: "",
          sortable: false,
          cellClass: function (value, obj) {
            return this.key + ' align-right';
          },
          tmpl: Template.TableCellDelete,
          cellEvent: function (e, tmpl) {
            Meteor.call('deleteItemsDocument', this._id);
          }
        }
      ],
      group: 'itemsDocuments',
    };
  });
}