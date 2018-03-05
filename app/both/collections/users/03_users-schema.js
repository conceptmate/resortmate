/* global Schemas */
Schemas = typeof Schemas !== 'undefined' ? Schemas : {};

Schemas.User = new SimpleSchema({
  // username: {
  //   type: String,
  //   regEx: /^[a-z0-9A-Z_]{3,15}$/,
  //   optional: true,
  //   blackbox: true,
  //   autoform: {
  //     type: "hidden",
  //     label: false
  //   },
  // },
  profile: {
    type: Schemas.UserProfile,
    optional: true
  },
  domain: {
    type: String,
    optional: true
  },
  // status: {
  //   type: Object,
  //   optional: true,
  //   blackbox: true,
  //   autoform: {
  //     type: "hidden",
  //     label: false
  //   },
  // },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
    autoform: {
      type: "hidden",
      label: false,
      omit: true
    },
  },
  roles: {
    type: Object,
    blackbox: true,
    optional: true,
    autoform: {
      type: "hidden",
      label: false,
      omit: true
    },
  },
  emails: {
    type: Array,
    label: function() {
      return i18n('user.emails');
    },
    minCount: 0,
    autoform: {
      // type: "hidden",
      label: false
    },
  },
  'emails.$': {
    type: Object,
    autoform: {
      // type: "hidden",
      label: false
    },
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    autoform: {
      // type: "hidden",
      // label: false
    },
  },
  "emails.$.verified": {
    type: Boolean,
    autoform: {
      // type: "hidden",
      // label: false
    },
  },
  createdAt: {
    type: Date,
    optional: true,
    autoform: {
      type: "hidden",
      label: false
    },
  }
});

Meteor.users.attachSchema(Schemas.User);