/* global Meteor */
if (Meteor.isServer) {
  
  Meteor.publish('user-domain', function() {
    return Meteor.users.find({
      _id: this.userId
    }, {
      fields: {
        domain: 1
      }
    })
  });
}

if (Meteor.isClient) {
  Meteor.subscribe('user-domain');
}