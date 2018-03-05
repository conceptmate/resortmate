/* global Items */
Items = new Mongo.Collection('items');

if (Meteor.isServer) {
  
  Items.allow({
    insert: function (userId, doc) {
      // the user must be logged in, and the document must be owned by the user
      // return doc.owner === userId;
      let domain = Meteor.userDomain(userId);
      return Roles.userIsInRole(userId, ['accountant', 'manager', 'admin'], domain);
    },
    update: function (userId, doc, fields, modifier) {
      // can only change your own documents
      // return doc.owner === userId;
      let domain = Meteor.userDomain(userId);
      return Roles.userIsInRole(userId, ['accountant', 'manager', 'admin'], domain);
    },
    remove: function (userId, doc) {
      // can only remove your own documents
      // return doc.owner === userId;
      let domain = Meteor.userDomain(userId);
      return Roles.userIsInRole(userId, ['accountant', 'manager', 'admin'], domain);
    }
  });
  
   Meteor.publish('items', function (domain) {
    check(domain, String);
    
    if (Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], domain)) {
      return Items.find({
        group: domain
      });
    }
    else {
      // user not authorized. do not publish secrets
      this.stop();
      return;
    }
  });

  ReactiveTable.publish('table-items', function () {
    console.log('user domain ' + Meteor.userDomain(this.userId) + ' id: ' + this.userId);
    if (Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      return Items;
    }
    return null;
  }, function () {
    return {
      group: Meteor.userDomain(this.userId)
    };
  });

  Meteor.publish('item', function (domain, itemId) {
    check(domain, String);
    check(itemId, String);
    
    if (Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], domain)) {
      return Items.find({
        $and: [
          { group: domain },
          { _id: itemId }
        ]
      });
    }
    else {
      // user not authorized. do not publish secrets
      this.stop();
      return;
    }
  });
}
