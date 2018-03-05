/* global Rooms */
Rooms = new Mongo.Collection('rooms');

if (Meteor.isServer) {
  
  Rooms.allow({
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
  
   Meteor.publish('rooms', function (domain) {
    check(domain, String);
    
    if (Roles.userIsInRole(this.userId, ['curator', 'accountant', 'manager', 'admin'], domain)) {
      return Rooms.find({
        group: domain
      });
    }
    else {
      // user not authorized. do not publish secrets
      this.stop();
      return;
    }
  });

  ReactiveTable.publish('table-rooms', function () {
    if (Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      return Rooms;
    }
    return null;
  }, function () {
    return {
      group: Meteor.userDomain(this.userId)
    };
  });

  Meteor.publish('room', function (domain, roomId) {
    check(domain, String);
    check(roomId, String);
    
    if (Roles.userIsInRole(this.userId, ['curator', 'accountant', 'manager', 'admin'], domain)) {
      return Rooms.find({
        $and: [
          { group: domain },
          { _id: roomId }
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
