/* global SimpleSchema */
/* global Schemas */
/* global i18n */
Schemas = typeof Schemas !== 'undefined' ? Schemas : {};

/**
 *
 */
Schemas.Item = new SimpleSchema({
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
  key: {
    type: String,
    label: function () {
      return i18n('item.key');
    },
    max: 50,
    autoform: {
      placeholder: function() {
        return i18n('item.key');
      }
    }
  },
  description: {
    type: String,
    label: function () {
      return i18n('item.description');
    },
    max: 2000,
    optional: true,
    autoform: {
      placeholder: function() {
        return i18n('item.description');
      },
      rows: 4
    }
    // fieldset-> row: make textarea
  },
  price: {
    type: Number,
    decimal: true,
    label: function () {
      return i18n('item.price');
    },
    min: 0,
    autoform: {
      placeholder: function() {
        return i18n('item.price');
      },
      step: 0.01,
      format: '0.00',
      prefix: '€'//,
      // suffix: 'suffix'
    }
  },
  vat: {
    type: Number,
    decimal: true,
    label: function () {
      return i18n('item.vat');
    },
    min: 0,
    autoform: {
      placeholder: function() {
        return i18n('item.vat');
      },
      format: '0.00',      
      prefix: '%'//,
      // suffix: '%'
    }
  },
  vatType: {
    type: String,
    optional: true,                     // remove in v1.0
    label: function () {
      return i18n('item.vatType');
    },
    // allowedValues: ['gross', 'net'],
    defaultValue: 'gross',
    autoform: {
      placeholder: function() {
        return i18n('item.vatType');
      },
      options: function() {
        return [
          {
            value: 'net',
            label: i18n('item.vatTypes.net')
          },
          {
            value: 'gross',
            label: i18n('item.vatTypes.gross')
          }
        ];
      }
    }
  },
  createdAt: {
    type: Date,
    label: function() {
      return i18n('items.createdAt');
    },
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
      else {
        this.unset();
      }
    }//,
    // denyUpdate: true
  }
});

Items.attachSchema(Schemas.Item);