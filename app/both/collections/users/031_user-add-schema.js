/* global Schemas */
Schemas = typeof Schemas !== 'undefined' ? Schemas : {};

Schemas.UserAdd = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: function() {
      return i18n('userAdd.email');
    },
    autoform: {
      placeholder: function() {
        return i18n('userAdd.email');
      }
    }
  },
  domain: {
    type: String,
    regEx: SimpleSchema.RegEx.Domain,
    label: function() {
      return i18n('userAdd.domain');
    },
    autoform: {
      placeholder: function() {
        return i18n('userAdd.domain');
      }
    }
  },
  profile: {
    type: Schemas.UserProfile,
    optional: true,
    label: function() {
      return i18n('userAdd.profile');
    },
    autoform: {
      placeholder: function() {
        return i18n('userAdd.profile');
      }
    }
  }
});
