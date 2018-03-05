/* global i18n */
/* global SimpleSchema */
/* global Schemas */
Schemas = typeof Schemas !== 'undefined' ? Schemas : {};

/**
 *
 */
Schemas.TextBlock = new SimpleSchema({
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
      return i18n('textBlock.key');
    },
    max: 50,
    autoform: {
      placeholder: function() {
        return i18n('textBlock.key');
      }
    }
  },
  type: {
    type: String,
    label: function () {
      return i18n('textBlock.type');
    },
    autoform: {
      placeholder: function() {
        return i18n('textBlock.type');
      },
      firstOption: function() {
        return i18n('textBlock.types.select');
      },
      options: function() {
        return [
          {
            label: function() {
              return i18n('textBlock.types.prefix');
            },
            value: 'prefix'
          },
          {
            label: function() {
              return i18n('textBlock.types.suffix');
            },
            value: 'suffix'
          }
        ];
      }
    }
  },
  text: {
    type: String,
    label: function () {
      return i18n('textBlock.text');
    },
    max: 2000,
    autoform: {
      placeholder: function() {
        return i18n('textBlock.text');
      },
      rows: 6
    }
  },
  createdAt: {
    type: Date,
    label: function () {
      return i18n('items.createdAt');
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

TextBlocks.attachSchema(Schemas.TextBlock);