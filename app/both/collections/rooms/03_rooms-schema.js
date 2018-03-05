/* global Schemas */
/* global SimpleSchema */
/* global Meteor */
/* global i18n */
Schemas = typeof Schemas !== 'undefined' ? Schemas : {};

/**
 *
 */
Schemas.Room = new SimpleSchema({
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
      return i18n('room.key');
    },
    max: 50,
    autoform: {
      placeholder: function() {
        return i18n('room.key');
      }
    }
  },
  order: {
    type: Number,
    label: function () {
      return i18n('room.order');
    },
    defaultValue: 1,
    autoform: {
      placeholder: function() {
        return i18n('room.order');
      }
    }
  },
  name: {
    type: String,
    label: function () {
      return i18n('room.name');
    },
    autoform: {
      placeholder: function() {
        return i18n('room.name');
      }
    }
  },
  description: {
    type: String,
    label: function () {
      return i18n('room.description');
    },
    max: 2000,
    optional: true,
    autoform: {
      placeholder: function() {
        return i18n('room.description');
      },
      rows: 4
    }
    // fieldset-> row: make textarea
  },
  createdAt: {
    type: Date,
    label: function() {
      return i18n('room.createdAt');
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

Rooms.attachSchema(Schemas.Room);