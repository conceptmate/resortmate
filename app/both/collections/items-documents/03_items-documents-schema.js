Schemas = typeof Schemas !== 'undefined' ? Schemas : {};

/**
 *
 */
Schemas.ItemsDocuments = new SimpleSchema({
  owner: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue: function() {
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
    autoValue: function() {
      if (!this.isSet) {
        return Meteor.userDomain(this.userId);
      }
    }
  },
  documentType: {
    type: String
  },
  state: {
    type: String,
    autoValue: function() {
      let offer = this.field('offer');
      let invoice = this.field('invoice');
      return (offer.value || invoice.value) ? 'handled' : 'open';
    }
  },
  offer: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  invoice: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  customer: {
    type: Object,
    blackbox: true,
    optional: true
  },
  number: {
    type: Number
  },
  date: {
    type: Date,
    label: function () {
      return i18n('documents.date');
    },
    autoValue: function() {
      if (this.isInsert && !this.isSet) {
        console.log('date called');
        return new Date();
      }
    }
  },
  prefix: {
    type: String,
    optional: true
  },
  suffix: {
    type: String,
    optional: true
  },
  items: {
    type: Array,
    optional: true,
    minCount: 0,
    autoform: {
      type: 'table'
    }
  },
  'items.$': {
    type: Object,
    label: function () {
      return i18n('documents.items.item');
    }//,
    // autoform: {
    //   type: 'table-item'
    // }
  },
  'items.$.key': {
    type: String,
    optional: true            // remove in production
  },
  'items.$.quantity': {
    type: Number,
    optional: true,            // remove in production
    decimal: true
  },
  'items.$.description': {
    type: String,
    optional: true            // remove in production
  },
  'items.$.vat': {
    type: Number,
    optional: true,            // remove in production
    decimal: true
  },
  'items.$.vatType': {
    type: String,
    optional: true
  },
  'items.$.price': {
    type: Number,
    optional: true,            // remove in production
    decimal: true
  },
  createdAt: {
    type: Date,
    label: function () {
      return i18n('documents.createdAt');
    },
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
      else {
        this.unset();
      }
    },
    denyUpdate: true
  },
});

ItemsDocuments.attachSchema(Schemas.ItemsDocuments);
