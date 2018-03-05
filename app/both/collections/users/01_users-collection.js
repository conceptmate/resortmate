if (Meteor.isServer) {

  Meteor.users.allow({
    insert: function (userId, doc) {
      // the user must be logged in, and the document must be owned by the user
      // return doc.owner === userId;
      let domain = Meteor.userDomain(userId);
      return Roles.userIsInRole(userId, ['admin'], domain);
    },
    update: function (userId, doc, fields, modifier) {
      // can only change your own documents
      // return doc.owner === userId;
      let domain = Meteor.userDomain(userId);
      return Roles.userIsInRole(userId, ['admin'], domain);
    },
    remove: function (userId, doc) {
      // can only remove your own documents
      // return doc.owner === userId;
      let domain = Meteor.userDomain(userId);
      return Roles.userIsInRole(userId, ['admin'], domain);
    }
  });

  ReactiveTable.publish('table-users', function () {
    if (Roles.userIsInRole(this.userId, ['admin'], Meteor.userDomain(this.userId))) {
      return Meteor.users;
    }
    return null;
  });
  
  Meteor.publish('user', function (domain, userId) {
    check(domain, String);
    check(userId, String);
    
    if (Roles.userIsInRole(this.userId, ['admin'], domain)) {
      return Meteor.users.find({
        $and: [
          // { domain: domain },
          { _id: userId }
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