/* global Schemas */
Schemas = typeof Schemas !== 'undefined' ? Schemas : {};

Schemas.UserProfile = new SimpleSchema({
  name: {
    type: String,
    optional: true,
    label: function() {
      return i18n('userProfile.name');
    },
    autoform: {
      placeholder: function() {
        return i18n('userProfile.name');
      }
    }
  },
  language: {
    type: String,
    label: function() {
      return i18n('userProfile.language');
    },
    defaultValue: 'de',
    autoform: {
      placeholder: function() {
        return i18n('userProfile.language');
      },
      firstOption: function() {
        return i18n('languages.select');
      },
      options:[
        {
          label: function() {
            return i18n('languages.de');
          },
          value: 'de'
        },
        {
          label: function() {
            return i18n('languages.en');
          },
          value: 'en'
        }
      ]
    },
    // options: [
    //   { label: 'Deutsch', value: 'de' },
    //   { label: 'Englisch', value: 'en' }
    // ],
    optional: true
  },
  picture: {
    type: String,
    optional: true,
    label: function() {
      return i18n('userProfile.picture');
    },
    autoform: {
      placeholder: function() {
        return i18n('userProfile.picture');
      },
      afFieldInput: {
        type: 'fileUpload',
        collection: 'ProfilePictures'
      }
    }
  }
});
