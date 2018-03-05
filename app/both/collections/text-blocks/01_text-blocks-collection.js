/* global TextBlocks */
/* global TextBlocks */
TextBlocks = new Mongo.Collection('text-blocks');

if (Meteor.isServer) {
  
  TextBlocks.allow({
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

  Meteor.publish('text-blocks', function (domain) {
    check(domain, String);
    
    if (Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], domain)) {
      return TextBlocks.find({
        group: domain
      });
    }
    else {
      // user not authorized. do not publish secrets
      this.stop();
      return;
    }
  });

  ReactiveTable.publish('table-text-blocks', function () {
    if (Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      return TextBlocks;
    }
    return null;
  }, function () {
    return {
      group: Meteor.userDomain(this.userId)
    };
  });

  Meteor.publish('text-block', function (domain, textBlockId) {
    check(domain, String);
    check(textBlockId, String);
    
    if (Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], domain)) {
      return TextBlocks.find({
        $and: [
          { group: domain },
          { _id: textBlockId }
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
