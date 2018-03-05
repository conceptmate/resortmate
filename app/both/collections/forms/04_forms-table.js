// /* global numeral */
// /* global Tables */
// Tables = typeof Tables !== 'undefined' ? Tables : {};

// if (Meteor.isClient) {
//   Meteor.startup(function () {
//     Tables.Forms = {
//       collection: 'table-forms',
//       rowsPerPage: 10,
//       showFilter: true,
//       showNavigation: 'auto',
//       useFontAwesome: false,
//       // showColumnToggles: true,
//       fields: [
//         {
//           key: 'edit',
//           sortable: false,
//           label: "",
//           tmpl: Template.TableCellEdit
//         },
//         {
//           key: 'key',
//           label: function () {
//             return i18n('forms.key');
//           },
//           sortDirection: 'ascending'
//         },
//         {
//           key: 'description',
//           label: function () {
//             return i18n('forms.description');
//           },
//           fn: Helpers.maintainLinebreaks
//         },
//         {
//           key: 'delete',
//           sortable: false,
//           label: "",
//           cellClass: function (value, obj) {
//             return this.key + ' align-right';
//           },
//           tmpl: Template.FormListTableDeleteCell
//         }
//       ],
//       group: 'forms',
//     };
//   });
// }