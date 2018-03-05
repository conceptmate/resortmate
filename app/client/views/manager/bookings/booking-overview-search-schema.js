Schemas = typeof Schemas !== 'undefined' ? Schemas : {};

/**
 *
 */
Schemas.BookingOverviewSearch = new SimpleSchema({
  fromDate: {
    type: Date,
    label: function() {
      return i18n('app.fromDate');
    }
  },
  toDate: {
    type: Date,
    label: function() {
      return i18n('app.toDate');
    }
  }
});
