Schemas = typeof Schemas !== 'undefined' ? Schemas : {};

/**
 *
 */
Schemas.Customer = new SimpleSchema({
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
  title: {
    type: String,
    optional: true,
    label: function() {
      return i18n('customer.title');
    },
    max: 50,
    autoform: {
      placeholder: function() {
        return i18n('customer.title');
      }
    }
  },
  name: {
    type: String,
    label: function() {
      return i18n('customer.name');
    },
    max: 200,
    autoform: {
      placeholder: function() {
        return i18n('customer.name');
      }
    }
  },
  address: {
    type: String,
    optional: true,
    label: function() {
      return i18n('customer.address');
    },
    autoform: {
      placeholder: function() {
        return i18n('customer.address');
      },
      rows: 6
    }
  },
  phone: {
    type: String,
    optional: true,
    label: function() {
      return i18n('customer.phone');
    },
    autoform: {
      placeholder: function() {
        return i18n('customer.phone');
      }
    }
  },
  fax: {
    type: String,
    optional: true,
    label: function() {
      return i18n('customer.fax');
    },
    autoform: {
      placeholder: function() {
        return i18n('customer.fax');
      }
    }
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
    label: function() {
      return i18n('customer.email');
    },
    autoform: {
      placeholder: function() {
        return i18n('customer.email');
      }
    }
  },
  createdAt: {
    type: Date,
    label: function() {
      return i18n('customer.createdAt');
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

Customers.attachSchema(Schemas.Customer);