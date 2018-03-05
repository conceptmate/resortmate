/* global Customers */
/* global Mongo */
/* global i18n */
/* global SimpleSchema */
/* global Schemas */
Customers = new Mongo.Collection('customers');

if (Meteor.isServer) {
  Customers.allow({
    insert: function (userId, doc) {
      // the user must be logged in, and the document must be owned by the user
      // return doc.owner === userId;
      let domain = Meteor.userDomain(userId);
      return Roles.userIsInRole(userId, ['curator', 'accountant', 'manager', 'admin'], domain);
    },
    update: function (userId, doc, fields, modifier) {
      // can only change your own documents
      // return doc.owner === userId;
      let domain = Meteor.userDomain(userId);
      return Roles.userIsInRole(userId, ['curator', 'accountant', 'manager', 'admin'], domain);
    },
    remove: function (userId, doc) {
      // can only remove your own documents
      // return doc.owner === userId;
      let domain = Meteor.userDomain(userId);
      return Roles.userIsInRole(userId, ['curator', 'accountant', 'manager', 'admin'], domain);
    }
  });

  ReactiveTable.publish('table-customers', function () {
    if (Roles.userIsInRole(this.userId, ['curator', 'accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      return Customers;
    }
    return null;
  }, function () {
    return {
      group: Meteor.userDomain(this.userId)
    };
  });

  // Meteor.publish('customers-for-bookings', function (domain) {
  //   check(domain, String);

  //   if (Roles.userIsInRole(this.userId, ['manager', 'admin'], domain)) {
  //     return Customers.find({
  //       group: domain
  //     });
  //   }
  //   else {
  //     // user not authorized. do not publish secrets
  //     this.stop();
  //     return;
  //   }
  // });

  Meteor.publish('customer', function (domain, customerId) {
    check(domain, String);
    check(customerId, String);

    if (Roles.userIsInRole(this.userId, ['curator', 'accountant', 'manager', 'admin'], domain)) {
      return Customers.find({
        $and: [
          { group: domain },
          { _id: customerId }
        ]
      });
    }
    else {
      // user not authorized. do not publish secrets
      this.stop();
      return;
    }
  });

  Meteor.publish('customers-by-name', function (domain, name) {
    check(domain, String);
    check(name, String);

    if (Roles.userIsInRole(this.userId, ['curator', 'accountant', 'manager', 'admin'], domain)) {
      return Customers.find({
        $and: [
          { group: domain },
          {
            name: {
              $regex: name,
              $options: 'i'
            }
          }
        ]
      }, {
          limit: 20
        });
    }
    else {
      // user not authorized. do not publish secrets
      this.stop();
      return;
    }
  });
}
